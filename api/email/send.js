/* ============================================================================
   POST /api/email/send
   Dispatches one drafted message through Resend.
   ----------------------------------------------------------------------------
   Constraint 1 of the programme is that nothing is auto-sent: every message is
   generated, reviewed and sent by a named human. This route is what that human
   press of the button reaches. It sends exactly one message, to recipients the
   caller states, and it will not accept a batch — there is no path here that
   mails a list.
   ==========================================================================*/

import { HubError } from '../_lib/zoho.js';
import { authorise, body, fail } from '../_lib/http.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') throw new HubError(405, 'Use POST.');
    authorise(req);

    const key = process.env.RESEND_API_KEY;
    if (!key) throw new HubError(500, 'RESEND_API_KEY is not set on the server.');

    const { to, cc, subject, html, replyTo, sentBy } = await body(req);

    const list = [].concat(to || []).filter(Boolean);
    if (!list.length) throw new HubError(400, 'No recipient.');
    if (list.length > 5) throw new HubError(422, 'This route sends one message to a named handful of people, not a campaign. Use the marketing platform for a list.');
    if (!subject) throw new HubError(400, 'No subject.');
    if (!html) throw new HubError(400, 'No body.');
    if (!sentBy) throw new HubError(400, 'Name the person sending this. Every outbound message is attributable to a human.');

    /* A pasted "Name <addr>" header is accepted; anything without an address
       is not, because Resend would silently drop it.                        */
    const addr = s => { const m = String(s).match(/<([^>]+)>/); return (m ? m[1] : String(s)).trim(); };
    const bad = list.map(addr).filter(a => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a));
    if (bad.length) throw new HubError(400, `Not a valid email address: ${bad.join(', ')}.`);

    const payload = {
      from: process.env.RESEND_FROM || 'Valura Partners <partners@valura.ai>',
      to: list.map(addr),
      subject,
      html,
      headers: { 'X-Valura-Sent-By': String(sentBy) }
    };
    if (cc) payload.cc = [].concat(cc).filter(Boolean).map(addr);
    if (replyTo) payload.reply_to = addr(replyTo);

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await r.json().catch(() => ({}));
    if (!r.ok) {
      throw new HubError(r.status === 403 || r.status === 401 ? 502 : 422,
        json.message || `Resend rejected the message (HTTP ${r.status}).`,
        json.name === 'validation_error'
          ? 'Most often the sending domain is not verified in Resend. Verify valura.ai there, or set RESEND_FROM to an address on a domain that is.'
          : json);
    }

    res.status(200).json({ ok: true, id: json.id, to: payload.to, sentBy, sentAt: new Date().toISOString() });
  } catch (err) {
    fail(res, err);
  }
}
