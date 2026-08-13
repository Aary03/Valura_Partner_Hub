/* ============================================================================
   POST /api/sign/send
   Renders the agreement as a PDF and puts it out for signature through Zoho.
   ----------------------------------------------------------------------------
   This is the one route in the Hub that reaches a real counterparty, so it is
   deliberately explicit: it refuses to send a partner an agreement whose
   commercial terms have not cleared the gates that make them lawful to offer.
   ==========================================================================*/

import { renderPdf, pageCount, PX_TO_PT } from '../_lib/render.js';
import { createRequest, submitRequest, HubError } from '../_lib/zoho.js';
import { authorise, body, fail, originOf } from '../_lib/http.js';

export const config = { maxDuration: 60, memory: 1769 };

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') throw new HubError(405, 'Use POST.');
    authorise(req);

    const { partner, valuraSigner, expiryDays, notes, dryRun, doc } = await body(req);
    /* The Introducing Broker Agreement is what goes out for signature.
       `doc: 'agreement'` still renders the older Partner Agreement template. */
    const which = doc === 'agreement' ? 'agreement' : 'ib';
    if (!partner) throw new HubError(400, 'No partner record in the request body.');

    /* -- Refuse to send something that should not be sent ----------------- */
    const problems = [];
    if (!partner.legalName) problems.push('the partner has no legal name');
    if (!partner.effectiveDate) problems.push('no effective date is set, so the agreement cannot be dated');
    if (!partner.signatoryName) problems.push('no partner signatory is named');
    if (!partner.signatoryEmail) problems.push('the partner signatory has no email address');
    if (!partner.registeredAddress) problems.push('the partner has no registered address for §1');

    const unapproved = (partner.nonStandardTerms || []).filter(n => n.text && (n.approvals || []).length < 2);
    if (unapproved.length) {
      problems.push(`${unapproved.length} non-standard term(s) carry fewer than two approvals`);
    }
    if (problems.length) {
      throw new HubError(422, `This agreement is not ready to issue: ${problems.join('; ')}.`);
    }

    const signer = {
      name: (valuraSigner && valuraSigner.name) || 'Priyesh Ranjan',
      email: (valuraSigner && valuraSigner.email) || ''
    };
    if (!signer.email) throw new HubError(400, 'A Valura signatory email is required — Zoho sends the counter-signature request to it.');

    /* -- Render exactly what the Hub displays ----------------------------- */
    const origin = originOf(req);
    const { pdf, meta } = await renderPdf({
      origin, partner, doc: which, opts: { esign: true, showVars: false }
    });

    const pages = pageCount(pdf);
    const geom = meta.esign;
    if (!geom || !Array.isArray(geom.fields)) {
      throw new HubError(500, 'The print surface did not report the e-signature geometry.');
    }

    /* The execution sheet is always the last page, so it resolves without
       having to predict how many sheets the body ran to. Pixels at 96dpi
       become PDF points at 72dpi.                                           */
    const lastPage = pages - 1;
    const fieldsFor = role => geom.fields.filter(f => f.role === role).map(f => ({
      name: f.name, type: f.type, label: f.label, page: lastPage,
      x: f.x * PX_TO_PT, y: f.y * PX_TO_PT, w: f.w * PX_TO_PT, h: f.h * PX_TO_PT
    }));

    /* The partner's own name is on the request, the file and the covering
       note — this is what they see in the Zoho email before they open it. */
    const name = partner.tradingName || partner.legalName;
    const docTitle = which === 'ib' ? 'Introducing Broker Agreement' : 'Partner Agreement';
    const requestName = `${docTitle} — Valura × ${name}`;
    const filename = `valura-${which === 'ib' ? 'introducing-broker' : 'partner'}-agreement-${(partner.slug || 'partner')}.pdf`;

    if (dryRun) {
      return res.status(200).json({
        ok: true, dryRun: true, pages, lastPage,
        bytes: pdf.length, sheets: meta.sheets,
        fields: { valura: fieldsFor('valura'), partner: fieldsFor('partner') },
        pdfBase64: pdf.toString('base64')
      });
    }

    /* -- Two-step send ----------------------------------------------------- */
    const created = await createRequest({
      pdf, filename, requestName,
      expiryDays: expiryDays || 15,
      notes: notes || `${docTitle} between Valura India IFSC Private Limited and ${name}, effective ${partner.effectiveDate}. Schedule A carries the agreed revenue share.`,
      actions: [
        { name: signer.name, email: signer.email, note: 'Counter-signature for Valura.' },
        { name: partner.signatoryName, email: partner.signatoryEmail,
          note: 'Please review the agreement and its schedules before signing.' }
      ]
    });

    const byEmail = e => created.actions.find(a => (a.email || '').toLowerCase() === e.toLowerCase());
    const aValura = byEmail(signer.email);
    const aPartner = byEmail(partner.signatoryEmail);
    if (!aValura || !aPartner) {
      throw new HubError(502, 'Zoho did not return an action for every recipient.', created.actions);
    }

    await submitRequest({
      requestId: created.requestId,
      documentId: created.documentIds[0],
      actions: [
        { ...aValura, fields: fieldsFor('valura') },
        { ...aPartner, fields: fieldsFor('partner') }
      ]
    });

    res.status(200).json({
      ok: true,
      requestId: created.requestId,
      requestName,
      pages,
      recipients: [
        { role: 'Valura', name: signer.name, email: signer.email, order: 1 },
        { role: 'Partner', name: partner.signatoryName, email: partner.signatoryEmail, order: 2 }
      ],
      sentAt: new Date().toISOString()
    });
  } catch (err) {
    fail(res, err);
  }
}
