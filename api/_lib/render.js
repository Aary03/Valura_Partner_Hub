/* ============================================================================
   HTML → PDF, using the Hub's own rendering.
   ----------------------------------------------------------------------------
   The documents are laid out at a fixed A4 pixel size and every rate in them
   comes from js/economics.js. Rather than rebuild any of that server-side,
   this loads /print.html in headless Chromium, hands it the partner record,
   and prints. What Zoho receives is byte-identical to what the Hub shows.
   ==========================================================================*/

import puppeteer from 'puppeteer-core';
import { HubError } from './zoho.js';

/* @sparticuz/chromium is imported dynamically, and the reason matters.
   ------------------------------------------------------------------------
   At module load it calls setupLambdaEnvironment(), which extracts the shared
   libraries and sets LD_LIBRARY_PATH — but only if it believes it is inside a
   Lambda. It decides that from AWS_EXECUTION_ENV or AWS_LAMBDA_JS_RUNTIME.

   Vercel sets neither. So on Vercel the package concluded it was on a normal
   machine, inflated only chromium.br, skipped al2023.tar.br entirely and never
   touched LD_LIBRARY_PATH — leaving a binary in /tmp that dies looking for
   libnss3.so, which was sitting unread in the bundle the whole time.

   Setting the flag first fixes it, and it has to happen before the module is
   evaluated. ES imports are hoisted, so a static import would run the
   detection before any line here could set the variable.                    */
async function loadChromium() {
  if (onLambda) {
    process.env.AWS_LAMBDA_JS_RUNTIME ??= 'nodejs20.x';   // selects the AL2023 pack
  }
  return (await import('@sparticuz/chromium')).default;
}

/* 794 × 1123 CSS px is A4 at 96dpi; PDF points are 72dpi. Everything the
   Hub measures in px converts to points with this one factor, which is also
   what maps the signature anchors onto the Zoho page.                       */
export const PX_TO_PT = 72 / 96;
export const A4_PT = { w: 595.28, h: 841.89 };

let browserPromise = null;

/* @sparticuz/chromium ships a Linux binary for the Lambda filesystem, which
   cannot run on a developer's Mac. On Vercel we use it; anywhere else we use
   the Chrome already installed, so `vercel dev` and a plain `node` script
   both work.                                                                */
const onLambda = Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL);

const LOCAL_CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium'
].filter(Boolean);

async function localExecutable() {
  const { existsSync } = await import('node:fs');
  const found = LOCAL_CHROME.find(p => { try { return existsSync(p); } catch { return false; } });
  if (!found) {
    throw new HubError(500,
      'No Chrome found for local rendering. Set CHROME_PATH to a Chrome or Chromium binary, or run this on Vercel where the bundled Chromium is used.');
  }
  return found;
}

async function launch() {
  if (!browserPromise) {
    browserPromise = (async () => {
      const chromium = onLambda ? await loadChromium() : null;
      const executablePath = chromium ? await chromium.executablePath() : await localExecutable();
      try {
        return await puppeteer.launch({
          args: chromium
            ? [...chromium.args, '--font-render-hinting=none']
            : ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
          defaultViewport: { width: 900, height: 1200, deviceScaleFactor: 1 },
          executablePath,
          headless: true
        });
      } catch (e) {
        if (onLambda && /libnss3|shared librar/i.test(e.message)) {
          /* If this still fires, the packs are present but were not unpacked —
             report what the loader was actually given, so the next fix is not
             another guess. */
          const { existsSync, readdirSync } = await import('node:fs');
          const libDir = '/tmp/al2023/lib';
          let libs = 'not created';
          try { libs = existsSync(libDir) ? readdirSync(libDir).length + ' files' : 'not created'; } catch {}
          throw new HubError(500,
            'Chromium started but could not load its shared libraries.',
            `LD_LIBRARY_PATH=${process.env.LD_LIBRARY_PATH || 'unset'} · ` +
            `AWS_LAMBDA_JS_RUNTIME=${process.env.AWS_LAMBDA_JS_RUNTIME || 'unset'} · ` +
            `${libDir}: ${libs}. ` +
            `Underlying error: ${e.message}`);
        }
        throw e;
      }
    })().catch(e => { browserPromise = null; throw e; });
  }
  return browserPromise;
}

/**
 * @param origin  where /print.html is served from
 * @param partner the partner record, exactly as the Hub holds it
 * @param doc     which artefact to render — see public/print.html
 * @param opts    passed through to the document generator (e.g. { esign: true })
 */
export async function renderPdf({ origin, partner, doc, opts }) {
  const browser = await launch();
  const page = await browser.newPage();
  try {
    const url = `${origin}/print.html`;
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25_000 });
    if (!res || !res.ok()) throw new HubError(502, `Could not load the print surface at ${url} (HTTP ${res ? res.status() : 'no response'}).`);

    await page.waitForFunction('window.VLRPrint && window.VLRPrint.ready === true', { timeout: 15_000 });

    const outcome = await page.evaluate((p, d, o) => window.VLRPrint.render(p, d, o), partner, doc, opts || {});
    if (outcome && outcome.error) throw new HubError(500, `The document generator failed: ${outcome.error}`);

    /* Web fonts decide the layout. Printing before they land would silently
       fall back to a system serif and shift every line.                     */
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));

    const pdf = await page.pdf({
      format: 'a4',
      landscape: Boolean(outcome && outcome.landscape),
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    return { pdf: Buffer.from(pdf), meta: outcome || {} };
  } finally {
    await page.close().catch(() => {});
  }
}

/* Page count without adding a PDF parsing dependency: every page object in
   the file carries /Type /Page (but not /Pages).                            */
export function pageCount(pdf) {
  const s = pdf.toString('latin1');
  const m = s.match(/\/Type\s*\/Page[^s]/g);
  return m ? m.length : 1;
}
