/* POST /api/sign/remind  { requestId }
   Re-sends the signature email to whoever it is currently waiting on.
   Zoho only ever emails the recipient whose turn it is, so this cannot be
   used to chase someone who has not been reached yet. */

import { accessToken, getRequest, HubError } from '../_lib/zoho.js';
import { authorise, body, fail } from '../_lib/http.js';

const DC = { com: 'https://sign.zoho.com', eu: 'https://sign.zoho.eu', in: 'https://sign.zoho.in',
             au: 'https://sign.zoho.com.au', jp: 'https://sign.zoho.jp',
             ca: 'https://sign.zohocloud.ca', sa: 'https://sign.zoho.sa' };

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') throw new HubError(405, 'Use POST.');
    authorise(req);

    const { requestId } = await body(req);
    if (!requestId) throw new HubError(400, 'Pass requestId.');

    const current = await getRequest(requestId);
    if (current.status !== 'inprogress') {
      throw new HubError(409, `Nothing to remind — the request is "${current.status}".`);
    }

    const host = DC[(process.env.ZOHO_SIGN_DC || 'com').toLowerCase()] || DC.com;
    const token = await accessToken();
    const r = await fetch(`${host}/api/v1/requests/${requestId}/remind`, {
      method: 'POST', headers: { Authorization: `Zoho-oauthtoken ${token}` }
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.status === 'failure') {
      throw new HubError(422, j.message || `Zoho would not send the reminder (HTTP ${r.status}).`, j);
    }

    const waitingOn = current.actions.filter(a => a.status === 'UNOPENED' || a.status === 'VIEWED');
    res.status(200).json({ ok: true, requestId, remindedAt: new Date().toISOString(), waitingOn });
  } catch (err) {
    fail(res, err);
  }
}
