/* Shared request plumbing: auth, body parsing, error shape. */

import { HubError } from './zoho.js';

/* Every route is gated on a shared secret. A deployed Hub with open API
   routes would let anyone who guessed the URL send documents out under
   Valura's Zoho account.                                                    */
export function authorise(req) {
  const expected = process.env.HUB_API_KEY;
  if (!expected) {
    throw new HubError(500, 'HUB_API_KEY is not set on the server. Set it in the Vercel project settings and enter the same value in the Hub under Connections.');
  }
  const given = req.headers['x-hub-key'] ||
    (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (given !== expected) throw new HubError(401, 'Wrong or missing Hub API key.');
}

export async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try { return JSON.parse(raw); }
  catch { throw new HubError(400, 'Request body is not valid JSON.'); }
}

export function fail(res, err) {
  const status = err instanceof HubError ? err.status : 500;
  if (status >= 500) console.error('[hub]', err);
  res.status(status).json({
    ok: false,
    error: err.message || 'Unexpected error.',
    detail: err.detail || undefined
  });
}

export function originOf(req) {
  if (process.env.HUB_ORIGIN) return process.env.HUB_ORIGIN.replace(/\/$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  /* Parenthesised deliberately: `a || b ? c : d` binds as `(a || b) ? c : d`,
     which on Vercel — where x-forwarded-proto is always present — resolved
     every origin to http:// and sent the renderer through a redirect. */
  const proto = req.headers['x-forwarded-proto'] ||
    (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');
  return `${proto}://${host}`;
}
