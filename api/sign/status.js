/* GET /api/sign/status?requestId=…  — where a signature request has got to. */

import { getRequest, HubError } from '../_lib/zoho.js';
import { authorise, fail } from '../_lib/http.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') throw new HubError(405, 'Use GET.');
    authorise(req);

    const requestId = (req.query && req.query.requestId) ||
      new URL(req.url, 'http://x').searchParams.get('requestId');
    if (!requestId) throw new HubError(400, 'Pass requestId.');

    const r = await getRequest(requestId);
    res.status(200).json({ ok: true, ...r });
  } catch (err) {
    fail(res, err);
  }
}
