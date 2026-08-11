/* ============================================================================
   POST /api/pdf  { partner, doc, opts }
   Any Hub artefact as a real PDF, rendered by the same code that draws it on
   screen. "Print / PDF" in the browser still works and needs no server; this
   exists so a document can be attached to an email or filed without a human
   driving a print dialog.
   ==========================================================================*/

import { renderPdf, pageCount } from './_lib/render.js';
import { HubError } from './_lib/zoho.js';
import { authorise, body, fail, originOf } from './_lib/http.js';

export const config = { maxDuration: 60, memory: 1769 };

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') throw new HubError(405, 'Use POST.');
    authorise(req);

    const { partner, doc, opts, filename } = await body(req);
    if (!partner) throw new HubError(400, 'No partner record in the request body.');

    const { pdf, meta } = await renderPdf({
      origin: originOf(req), partner, doc: doc || 'agreement', opts: opts || {}
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition',
      `attachment; filename="${(filename || `valura-${doc || 'agreement'}-${partner.slug || 'partner'}`).replace(/[^a-z0-9._-]/gi, '-')}.pdf"`);
    res.setHeader('X-Pdf-Pages', String(pageCount(pdf)));
    res.setHeader('X-Pdf-Sheets', String(meta.sheets || ''));
    res.status(200).send(pdf);
  } catch (err) {
    fail(res, err);
  }
}
