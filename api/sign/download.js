/* GET /api/sign/download?requestId=…  — the executed copy, with its audit trail. */

import { downloadRequest, getRequest, HubError } from '../_lib/zoho.js';
import { authorise, fail } from '../_lib/http.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') throw new HubError(405, 'Use GET.');
    authorise(req);

    const requestId = (req.query && req.query.requestId) ||
      new URL(req.url, 'http://x').searchParams.get('requestId');
    if (!requestId) throw new HubError(400, 'Pass requestId.');

    const r = await getRequest(requestId);
    if (r.status !== 'completed') {
      throw new HubError(409, `Nothing to download yet — the request is "${r.status}". The executed copy exists only once every party has signed.`);
    }

    const pdf = await downloadRequest(requestId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="executed-${requestId}.pdf"`);
    res.status(200).send(pdf);
  } catch (err) {
    fail(res, err);
  }
}
