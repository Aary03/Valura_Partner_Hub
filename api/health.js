/* GET /api/health — is the deployment wired up? Reports which integrations are
   configured without ever echoing a secret. Requires the Hub key like every
   other route, so it cannot be used to fingerprint the deployment. */

import { accessToken, HubError } from './_lib/zoho.js';
import { authorise, fail } from './_lib/http.js';

export default async function handler(req, res) {
  try {
    authorise(req);
    const out = {
      ok: true,
      zoho: { configured: Boolean(process.env.ZOHO_SIGN_CLIENT_ID && process.env.ZOHO_SIGN_REFRESH_TOKEN),
              dc: process.env.ZOHO_SIGN_DC || 'com', reachable: null },
      resend: { configured: Boolean(process.env.RESEND_API_KEY),
                from: process.env.RESEND_FROM || null },
      renderer: { configured: true }
    };

    if (out.zoho.configured) {
      try { await accessToken(); out.zoho.reachable = true; }
      catch (e) { out.zoho.reachable = false; out.zoho.error = e.message; }
    }

    res.status(200).json(out);
  } catch (err) {
    fail(res, err);
  }
}
