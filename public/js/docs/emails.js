/* ============================================================================
   THE EMAIL SEQUENCE — drafted, never dispatched.
   ----------------------------------------------------------------------------
   Every message here is generated, queued and sent by a named human after
   review. The Hub does not have send credentials and is not meant to.
   Each template goes through the same variable set as every other artefact,
   so a partner never receives two different versions of the same number.
   ==========================================================================*/

window.VLR = window.VLR || {};
VLR.Doc = VLR.Doc || {};

VLR.Doc.emails = function (p) {
  const d = VLR.derive(p);
  const C = VLR.CONFIG, ops = C.ops;
  const cal = p.effectiveDate ? VLR.Cal.build(p) : { events: [] };
  const dayOf = k => {
    const e = cal.events.find(x => x.k === k);
    return e ? VLR.fmt.date(e.date) : 'to be dated from signature';
  };
  const name = f => VLR.fmt.esc((f || '').split(' ')[0] || 'there');
  const who = VLR.fmt.esc(d.displayName);
  const owner = C.team.BD.name;

  const emailPeople = (p.people || []).filter(x => x.wantsEmailId && x.name);
  const cardPeople = (p.people || []).filter(x => x.wantsCard && x.name);

  const E = [];

  /* -- E01 · Welcome + intake ------------------------------------------- */
  E.push({
    code: 'E01', day: 'D0', when: dayOf('d0_welcome'), stage: '03_onboard_kyb',
    to: `${p.signatoryName || 'Signatory'} <${p.signatoryEmail || 'signatory@partner'}>`,
    cc: p.businessEmail || '', from: `${owner} <${ops.partnersEmail}>`,
    subject: `Welcome to Valura — one form, and we start the 30-day clock`,
    body: `
      <h2>Signed. Here is exactly what happens next.</h2>
      <p>${name(p.signatoryName)}, the Partner Agreement between ${VLR.fmt.esc(d.ent.legalName)} and ${who} was executed on <strong>${VLR.fmt.date(p.effectiveDate)}</strong>. That date is Day 0, and every date below is computed from it.</p>
      <p>There is one action for you today: complete the partner intake form. Everything downstream — your partner code, your microsite, your visiting cards, your collateral pack and your client onboarding documents — is generated from that single form. We do not ask for the same information twice.</p>
      <p><a class="mail-cta" href="#">Open the intake form</a></p>
      <table class="mail-tbl">
        <tr><td>Intake + KYB pack due</td><td><strong>${dayOf('intake_due')}</strong></td></tr>
        <tr><td>Partner code issued</td><td>${dayOf('code')} — within ${ops.kybTatHours} hours of document completeness</td></tr>
        <tr><td>Microsite and collateral live</td><td>${dayOf('microsite')}</td></tr>
        <tr><td>Certification and business plan</td><td>${dayOf('exam')}</td></tr>
        <tr><td>First funded ticket</td><td><strong>${dayOf('funded')}</strong></td></tr>
      </table>
      <p>Your kickoff call is <strong>${dayOf('kickoff')}</strong>. ${VLR.fmt.esc(owner)} is your named owner at Valura and will be on it, along with the escalation path in writing.</p>
      <p>A calendar invitation for the full 30 days is attached, and a live feed is linked from your portal so it stays current if a date moves.</p>`,
    notes: 'Attach: the activation calendar ICS, the executed agreement PDF, the KYB checklist. Send from the named owner, not a no-reply address.'
  });

  /* -- E02 · The email-ID and cards ask --------------------------------- */
  E.push({
    code: 'E02', day: 'D+1', when: dayOf('email_ask'), stage: '04_identity_kit', ask: true,
    to: `${p.businessContact || p.signatoryName || 'Business contact'} <${p.businessEmail || p.signatoryEmail || 'contact@partner'}>`,
    cc: p.opsEmail || '', from: `${owner} <${ops.partnersEmail}>`,
    subject: `Who needs a Valura email address and a card? — send us the list by ${dayOf('intake_due')}`,
    body: `
      <h2>We create the mailboxes. You just tell us who.</h2>
      <p>${name(p.businessContact || p.signatoryName)}, as discussed on the kickoff call — we provision co-branded email identities for your team on Valura's domain, and print visiting cards with variable data per person. You do not configure anything: we create the mailboxes, set up the signature block, and hand over the credentials.</p>
      <p><strong>What we need from you, for each person:</strong></p>
      <ul>
        <li>Full name, as it should appear on the card</li>
        <li>Title</li>
        <li>Mobile number, as it should be printed</li>
        <li>Whether they need a mailbox, a card, or both</li>
        <li>Preferred address format — the default is <span style="font-family:monospace">firstname@${VLR.fmt.esc(d.slug)}.${ops.emailRoot}</span></li>
      </ul>
      ${emailPeople.length || cardPeople.length ? `
      <p>From your intake form so far, we have:</p>
      <table class="mail-tbl">
        ${(p.people || []).filter(x => x.name).map(x => `<tr>
          <td>${VLR.fmt.esc(x.name)}${x.title ? ' — ' + VLR.fmt.esc(x.title) : ''}</td>
          <td>${[x.wantsEmailId ? 'mailbox' : null, x.wantsCard ? `${x.cardQty || 100} cards` : null].filter(Boolean).join(' · ') || 'nothing requested'}</td>
        </tr>`).join('')}
      </table>
      <p>Reply with any additions or corrections, or confirm that the list is complete.</p>`
      : `<p>Reply to this email with the list, or add it to the People section of your intake form — either works.</p>`}
      <p>Your tier includes <strong>${d.portalSeats} portal seats</strong>. Mailboxes beyond that number are available; we will confirm the cost before creating them.</p>
      <p>Deadline is <strong>${dayOf('intake_due')}</strong>, with the intake form. Mailboxes and credentials are handed over on <strong>${dayOf('email_give')}</strong>, alongside your partner code and portal logins. Cards go to print on ${dayOf('microsite')}.</p>`,
    notes: 'This is the "ask" email. It is in the calendar at D+1 and the answer is due with the intake form at D+3. Mailbox handover is a dated calendar item at D+5 — do not let it drift into "when we get to it".'
  });

  /* -- E03 · KYB reminder ------------------------------------------------ */
  E.push({
    code: 'E03', day: 'D+2', when: dayOf('intake_due'), stage: '03_onboard_kyb',
    to: `${p.complianceContact || p.opsContact || p.signatoryName || 'Ops'} <${p.complianceEmail || p.opsEmail || p.signatoryEmail || 'ops@partner'}>`,
    cc: '', from: `Valura Compliance <${ops.complianceEmail}>`,
    subject: `KYB pack — ${C.kybPack.filter(k => k.required).length} documents, due ${dayOf('intake_due')}`,
    body: `
      <h2>The list is short and it is the same for everyone.</h2>
      <p>${name(p.complianceContact || p.opsContact)}, we publish a turnaround of <strong>${ops.kybTatHours} hours from document completeness to partner code</strong>. The clock starts when the last document lands, so the fastest route is to send them together.</p>
      <table class="mail-tbl">
        ${C.kybPack.filter(k => k.required).map(k => `<tr><td>${VLR.fmt.esc(k.label)}</td><td>${(p.kyb[k.code] || {}).status === 'APPROVED' ? 'Received and approved' : ((p.kyb[k.code] || {}).status === 'SUBMITTED' ? 'Received, in review' : 'Outstanding')}</td></tr>`).join('')}
      </table>
      <p>Upload each one in the portal rather than emailing them — documents there are stored against your record with an access log, which is what a regulator will ask to see.</p>
      <p>Two of these are easy to skip and expensive to skip. The <strong>USD bank account proof</strong> is how you are paid under Clause 5.3.1, and the <strong>Pre-Existing Clients declaration</strong> records which clients were yours before Valura — that is the Clause 12.2 carve-out, and it cannot be established after a disagreement has started.</p>
      <p><a class="mail-cta" href="#">Upload documents</a></p>`,
    notes: 'Sent by Compliance, not BD. Do not chase by WhatsApp only — the portal upload is the auditable record.'
  });

  /* -- E04 · Partner code + logins + mailboxes --------------------------- */
  const disc = VLR.Econ.disclosure({ ...p, platformSharePct: d.platformSharePct,
    brokerageSharePct: d.brokerageSharePct, placementSharePct: d.placementSharePct });
  E.push({
    code: 'E04', day: 'D+5', when: dayOf('code'), stage: '03_onboard_kyb',
    to: `${p.signatoryName || 'Signatory'} <${p.signatoryEmail || 'signatory@partner'}>`,
    cc: [p.businessEmail, p.opsEmail].filter(Boolean).join(', '),
    from: `${owner} <${ops.partnersEmail}>`,
    subject: `${p.partnerCode || 'Your partner code'} is live — logins, mailboxes and your client link`,
    body: `
      <h2>You are live. Here is everything, in one message.</h2>
      <p>${name(p.signatoryName)}, compliance has approved your KYB pack. Your partner code is <strong>${VLR.fmt.esc(p.partnerCode || 'pending')}</strong>, and it is now active in the client onboarding journey.</p>
      <table class="mail-tbl">
        <tr><td>Partner code</td><td><strong>${VLR.fmt.esc(p.partnerCode || 'pending')}</strong></td></tr>
        <tr><td>Portal</td><td>${ops.micrositeRoot}/login — ${d.portalSeats} seats</td></tr>
        <tr><td>Your client link</td><td>${VLR.fmt.esc(d.micrositeUrl)}</td></tr>
        <tr><td>Microsite goes live</td><td>${dayOf('microsite')}</td></tr>
      </table>
      ${emailPeople.length ? `
      <p><strong>Co-branded mailboxes — created, credentials attached separately:</strong></p>
      <table class="mail-tbl">
        ${emailPeople.map(x => `<tr><td>${VLR.fmt.esc(x.name)}</td><td style="font-family:monospace">${VLR.fmt.esc(VLR.Doc.emailFor(p, x))}</td></tr>`).join('')}
      </table>
      <p>Each mailbox forces a password reset on first login. Signature blocks are pre-installed and match the ones in your collateral pack — please do not replace them with your own, as the disclosure line at the bottom is required.</p>`
      : `<p>No co-branded mailboxes were requested. If that changes, reply and we will create them — usually same day.</p>`}
      <p><strong>What your clients see.</strong> Every client who opens an account through your link is shown your remuneration as a real figure, at KYC time. That disclosure reads:</p>
      <p style="border-left:2px solid #02A24B;padding:10px 14px;background:#EAF6EF;font-size:12px;color:#0B4F31;margin:0 0 13px">${VLR.fmt.esc(disc.text)}</p>
      <p>This is required by clause 18(a) of the IFSCA global access framework. It is generated from your commercial terms, so it is always current, and it does not increase what your client pays.</p>
      <p><a class="mail-cta" href="#">Open your portal</a></p>`,
    notes: 'Credentials go in a separate message, never in this one. Verify the disclosure has been approved by Compliance before this email is queued — the Hub blocks the code otherwise.'
  });

  /* -- E05 · Kit proofs -------------------------------------------------- */
  E.push({
    code: 'E05', day: 'D+7', when: dayOf('proofs'), stage: '04_identity_kit',
    to: `${p.marketingContact || p.businessContact || 'Marketing'} <${p.marketingEmail || p.businessEmail || 'marketing@partner'}>`,
    cc: '', from: `Valura Design <${ops.partnersEmail}>`,
    subject: `Your co-branded pack — proofs for approval`,
    body: `
      <h2>Proofs, not concepts. One round of changes, then print.</h2>
      <p>${name(p.marketingContact || p.businessContact)}, your collateral is generated from the brand kit you sent — logo, ${VLR.fmt.esc(p.primaryHex)} primary, ${VLR.fmt.esc(p.secondaryHex)} secondary, ${p.lockup === 'stacked' ? 'stacked' : 'side-by-side'} lockup. Nothing here was designed by hand, which is why it arrives in two days rather than two weeks.</p>
      <table class="mail-tbl">
        <tr><td>Visiting cards</td><td>${cardPeople.length ? cardPeople.map(x => VLR.fmt.esc(x.name) + ' × ' + (x.cardQty || 100)).join(', ') : 'awaiting the name list'}</td></tr>
        <tr><td>Brochure and one-pager</td><td>Co-branded, economics generated from your Schedule A</td></tr>
        <tr><td>Email signature</td><td>One per mailbox, pre-installed</td></tr>
        <tr><td>Social kit</td><td>LinkedIn banner, launch tile, story frame</td></tr>
        <tr><td>Client onboarding wrapper</td><td>Cover and footer only — the body is regulated text and cannot be altered</td></tr>
      </table>
      <p>Two things we cannot change, and it is better to say so now than at proof stage: the body copy of anything client-facing is approved regulated text, and your colours sit in the partner slot of the lockup rather than replacing Valura's page colours. Everything else is yours to mark up.</p>
      <p>Mark up the PDF directly and send it back by ${dayOf('microsite')}. Cards go to print that day.</p>`,
    notes: 'Four-step loop: Valura creates → partner marks up → confirmed on the weekly call → it goes out. Do not print on a verbal approval.'
  });

  /* -- E06 · Microsite live + pack delivered ------------------------------ */
  E.push({
    code: 'E06', day: 'D+10', when: dayOf('microsite'), stage: '04_identity_kit',
    to: `${p.marketingContact || p.businessContact || 'Marketing'} <${p.marketingEmail || p.businessEmail || 'marketing@partner'}>`,
    cc: p.signatoryEmail || '', from: `Valura Design <${ops.partnersEmail}>`,
    subject: `${VLR.fmt.esc(d.micrositeUrl)} is live`,
    body: `
      <h2>Your microsite is live and every link on it carries your code.</h2>
      <p>${name(p.marketingContact || p.businessContact)}, ${VLR.fmt.esc(d.micrositeUrl)} is published. Every client who starts from it is attributed to ${VLR.fmt.esc(p.partnerCode || 'your code')} automatically — there is nothing for the client to enter and nothing for you to track.</p>
      <table class="mail-tbl">
        <tr><td>Microsite</td><td>${VLR.fmt.esc(d.micrositeUrl)}</td></tr>
        <tr><td>Collateral pack</td><td>Brochure, one-pager, segment deck, social kit, signature — in your portal</td></tr>
        <tr><td>Visiting cards</td><td>At print — delivered with the welcome kit on ${dayOf('kit_del')}</td></tr>
        <tr><td>Guardrails card</td><td>Two pages. Please read it before the launch campaign.</td></tr>
      </table>
      <p>The guardrails card is the short version of what you may and may not say. The two that catch people out: no comparative claim with a competitor's figures unless it is accurate, current and substantiable, and nothing that states or implies a guaranteed return or capital protection. Neither is a Valura preference — both are in the IFSCA advertisement code.</p>
      <p><a class="mail-cta" href="#">Open the collateral pack</a></p>`,
    notes: 'Publication requires the Schedule D trademark licence to be signed. The Hub blocks the microsite otherwise.'
  });

  /* -- E07 · Training open ------------------------------------------------ */
  E.push({
    code: 'E07', day: 'D+12', when: dayOf('training'), stage: '05_plan_enable',
    to: `${p.businessContact || p.signatoryName || 'Team'} <${p.businessEmail || p.signatoryEmail || 'team@partner'}>`,
    cc: '', from: `Valura Enablement <${ops.partnersEmail}>`,
    subject: `Certification is open — and it gates your launch`,
    body: `
      <h2>Nine modules, one exam, and no launch without it.</h2>
      <p>${name(p.businessContact || p.signatoryName)}, the training modules are open in your portal. Everyone at ${who} who will speak to a client about Valura needs to complete them and pass the exam at <strong>${C.examPassMark}%</strong>.</p>
      <table class="mail-tbl">
        ${C.training.map((m, i) => `<tr><td>${String(i + 1).padStart(2, '0')}</td><td>${VLR.fmt.esc(m)}</td></tr>`).join('')}
      </table>
      <p>This is a gate rather than a suggestion: the launch campaign on ${dayOf('launch_ann')} does not open until certification is recorded. It is also the evidence that your team was trained on what may and may not be said, which is what Clause 8.1 and 8.2 require and what a regulator would ask for.</p>
      <p>Exam and business plan sign-off are both on <strong>${dayOf('exam')}</strong>.</p>
      <p><a class="mail-cta" href="#">Start module 01</a></p>`,
    notes: 'Certificates carry an expiry and a recertification reminder. Certification blocks the Stage 06 gate in the Hub.'
  });

  /* -- E08 · Launch announcement — co-branded, to the partner's clients --- */
  E.push({
    code: 'E08', day: 'D+15', when: dayOf('launch_ann'), stage: '06_launch', cobrand: true,
    to: `${who} client base — via the partner's own channel`,
    cc: '', from: `${p.signatoryName || 'Partner'} <${VLR.Doc.emailFor(p, p.people && p.people[0]) || (p.signatoryEmail || 'partner@partner')}>`,
    subject: `Global markets, now available through ${who}`,
    body: `
      <h2>You can now invest globally, through us.</h2>
      <p>We have partnered with <strong>Valura</strong> — a broker-dealer registered with the International Financial Services Centres Authority in GIFT City — so that you can hold global equities, ETFs, UCITS and mutual funds, structured products and private-market opportunities through a single account, with us alongside you.</p>
      <p><strong>What that means in practice:</strong></p>
      <ul>
        <li>One account for global markets, opened online, with KYC done digitally.</li>
        <li>Published charges with nothing added: ${VLR.fmt.pct(C.clientSchedule.platformFeePct)} a year on assets held, ${VLR.fmt.pct(C.clientSchedule.grossBrokeragePct)} per trade, no account opening fee, no annual maintenance fee, no charge for market data or tax statements.</li>
        <li>GIFT City-domiciled funds and external funds are exempt from the platform fee entirely.</li>
        <li>Tax statements and capital-gains reports prepared for you at no cost.</li>
      </ul>
      <p>We are paid by Valura for introducing you, and the exact amount is shown to you when you open your account. It does not increase what you pay.</p>
      <p><a class="mail-cta" href="#">Open an account</a></p>
      <p>We are hosting a session on ${dayOf('webinar')} where Valura will walk through the platform and answer questions directly. Reply to this email and we will hold you a place.</p>`,
    notes: 'Client-facing. Approved copy, unaltered. No guaranteed-return language, no competitor comparison with figures, no "indicative" pricing — the last one contradicts the clause 38(j) undertaking. Sent from the partner\'s channel, not Valura\'s.'
  });

  /* -- E09 · Webinar invite ---------------------------------------------- */
  E.push({
    code: 'E09', day: 'D+18', when: dayOf('webinar'), stage: '06_launch', cobrand: true,
    to: `${who} client base`, cc: '', from: `${p.signatoryName || 'Partner'} <${p.signatoryEmail || 'partner@partner'}>`,
    subject: `${dayOf('webinar')} — how global investing actually works, in 45 minutes`,
    body: `
      <h2>Bring the questions you have not been able to get answered.</h2>
      <p>We are hosting a joint session with Valura. No pitch deck marathon — 20 minutes on how the account, custody and settlement actually work, 25 minutes of questions.</p>
      <table class="mail-tbl">
        <tr><td>When</td><td>${dayOf('webinar')}, 5:00 pm IST</td></tr>
        <tr><td>Where</td><td>Online — link on registration</td></tr>
        <tr><td>Who</td><td>Valura presents · ${who} hosts</td></tr>
      </table>
      <p><strong>What we will cover:</strong> where your money and your assets actually sit and who holds them; what you pay, line by line; what is available beyond listed equities; and how the tax reporting works for an Indian resident and for an NRI.</p>
      <p><a class="mail-cta" href="#">Register</a></p>`,
    notes: 'Valura hosts and presents; the partner introduces and closes. Recording goes to non-attendees within 24 hours.'
  });

  /* -- E10 · First funded ticket ----------------------------------------- */
  E.push({
    code: 'E10', day: 'D+30', when: dayOf('funded'), stage: '06_launch',
    to: `${p.signatoryName || 'Signatory'} <${p.signatoryEmail || 'signatory@partner'}>`,
    cc: p.businessEmail || '', from: `${owner} <${ops.partnersEmail}>`,
    subject: `First funded ticket settled — 30-day review on ${dayOf('funded')}`,
    body: `
      <h2>Thirty days, signature to settled.</h2>
      <p>${name(p.signatoryName)}, your first funded ticket has settled. That closes the activation programme and opens the running relationship.</p>
      <p>At the review we will read the funnel end to end — reached, viewed, lead, KYC started, funded — and compare it against the other partners in your segment. That comparison is the useful part: it shows where your journey leaks rather than whether the number is good.</p>
      <table class="mail-tbl">
        <tr><td>From here</td><td>Weekly input reviews for the first 90 days</td></tr>
        <tr><td>Statements</td><td>Quarterly, within ${ops.statementDueBusinessDays} business days of quarter end</td></tr>
        <tr><td>Quarterly business review</td><td>${dayOf('qbr')}</td></tr>
        ${p.tier !== 'ANCHOR' ? `<tr><td>Anchor eligibility</td><td>Monitored automatically — ${VLR.fmt.usd(C.anchorQualification.personalAumUsd)} personal AUM, or ${C.anchorQualification.networkSubPartners} sub-partners at ${VLR.fmt.usd(C.anchorQualification.networkAumUsd)} combined, sustained ${C.anchorQualification.sustainedMonths} months</td></tr>` : ''}
      </table>
      <p>The weekly reviews look at inputs — calls, meetings, IOIs, KYCs started — not at AUM. AUM is a lagging measure and there is nothing to manage in it.</p>`,
    notes: 'Do not send until the ticket has actually settled, not merely funded. The gate is settlement.'
  });

  /* -- E11 · Quarterly statement ----------------------------------------- */
  const stmt = p.effectiveDate ? VLR.Cal.statementDeadlines(p.effectiveDate, 1)[0] : null;
  E.push({
    code: 'E11', day: 'Quarterly', when: stmt ? VLR.fmt.date(stmt.due) : 'Within 15 business days of quarter end',
    stage: '07_run_review', hard: true,
    to: `${p.signatoryName || 'Signatory'} <${p.signatoryEmail || 'signatory@partner'}>`,
    cc: p.opsEmail || '', from: `Valura Finance <${ops.partnersEmail}>`,
    subject: `${stmt ? stmt.quarter : 'Quarterly'} statement — ${VLR.fmt.esc(p.partnerCode || 'your code')}`,
    body: `
      <h2>Your statement, and the fifteen days you have to query it.</h2>
      <p>${name(p.signatoryName)}, your statement for ${stmt ? stmt.quarter : 'the quarter'} is attached and in your portal. It is issued within ${ops.statementDueBusinessDays} business days of quarter end as Clause 5.3.2 requires.</p>
      <table class="mail-tbl">
        <tr><td>Period</td><td>${stmt ? stmt.quarter + ', ended ' + VLR.fmt.date(stmt.quarterEnd) : '—'}</td></tr>
        <tr><td>Statement issued</td><td>${stmt ? VLR.fmt.date(stmt.due) : '—'}</td></tr>
        <tr><td>Query window closes</td><td><strong>${stmt ? VLR.fmt.date(stmt.disputeCloses) : '—'}</strong></td></tr>
      </table>
      <p>The statement shows average chargeable AUM, the platform-fee share, brokerage on executed trades, placements, gross payable, withholding tax, GST and net payable. Every line is derived from the same calculation as your term sheet and your Schedule A, so it should reconcile to what you were shown at the outset.</p>
      <p>Under Clause 5.3.5 you have ${ops.disputeWindowDays} days from receipt to raise a query in writing. After that the statement is deemed accepted — so if a number looks wrong, say so before ${stmt ? VLR.fmt.date(stmt.disputeCloses) : 'the window closes'} rather than at the next review.</p>
      <p>Please raise your GST invoice against this statement so we can release payment.</p>`,
    notes: 'This deadline is contractual. The Hub raises it as a hard deadline and escalates if unmet — a late statement is a breach of Clause 5.3.2.'
  });

  /* -- E12 · QBR invite --------------------------------------------------- */
  E.push({
    code: 'E12', day: 'D+90', when: dayOf('qbr'), stage: '07_run_review',
    to: `${p.signatoryName || 'Signatory'} <${p.signatoryEmail || 'signatory@partner'}>`,
    cc: p.businessEmail || '', from: `${owner} <${ops.partnersEmail}>`,
    subject: `Quarterly business review — ${dayOf('qbr')}`,
    body: `
      <h2>Plan against actual, and whether the tier is still right.</h2>
      <p>${name(p.signatoryName)}, the first quarterly review is on ${dayOf('qbr')}. Ninety minutes, and we will have the numbers ready rather than assembling them in the room.</p>
      <table class="mail-tbl">
        <tr><td>Statement reconciliation</td><td>Line by line against your Schedule A</td></tr>
        <tr><td>Plan versus actual</td><td>AUM, clients, ticket size, conversion at each funnel step</td></tr>
        <tr><td>Tier review</td><td>${d.t.label} confirmed, or moved</td></tr>
        <tr><td>Anchor eligibility</td><td>Checked against the Schedule B.1 thresholds</td></tr>
        <tr><td>Product feedback</td><td>What you asked for that we do not yet have</td></tr>
      </table>
      <p>The last line matters more than it looks. Most of what gets built next quarter comes out of these conversations.</p>`,
    notes: 'Send the statement and the funnel read 48 hours ahead so the meeting is a decision, not a presentation.'
  });

  return E;
};

/* Derive a co-branded address for a person from the partner's format. */
VLR.Doc.emailFor = function (p, person) {
  if (!person || !person.name) return '';
  const d = VLR.derive(p);
  const first = String(person.name).trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
  const fmt = p.emailFormat || 'firstname@{slug}.valura.ai';
  return fmt.replace('firstname', first).replace('{slug}', d.slug || 'partner');
};

/* Render one email as a card. */
VLR.Doc.emailCard = function (p, e) {
  const d = VLR.derive(p);
  return `
  <article class="mail">
    <div class="mail-hdr">
      <div class="row"><span class="k">Stage</span><span class="v">${e.day} · ${VLR.fmt.esc(e.when)}${e.hard ? ' · contractual deadline' : ''}</span></div>
      <div class="row"><span class="k">From</span><span class="v">${VLR.fmt.esc(e.from)}</span></div>
      <div class="row"><span class="k">To</span><span class="v">${VLR.fmt.esc(e.to)}</span></div>
      ${e.cc ? `<div class="row"><span class="k">Cc</span><span class="v">${VLR.fmt.esc(e.cc)}</span></div>` : ''}
      <div class="row"><span class="k">Subject</span><span class="v"><b>${VLR.fmt.esc(e.subject)}</b></span></div>
    </div>
    <div class="mail-band">${VLR.Doc.lockup(p, { onInk: true, size: 16 })}</div>
    <div class="mail-body">${e.body}</div>
    <div class="mail-foot">
      <div class="lbl" style="font-family:var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--text-faint)">${e.cobrand ? 'Co-branded · client-facing' : 'Partner-facing'} · ${VLR.fmt.esc(e.code)}</div>
      <p style="margin:7px 0 0">${VLR.fmt.esc(d.ent.legalName)} · ${VLR.fmt.esc(d.ent.licence)} · ${VLR.fmt.esc(d.ent.address)}</p>
      <p style="margin:6px 0 0">Investments are subject to market risk. This message is not investment advice and Valura does not assess suitability. ${e.cobrand ? VLR.fmt.esc(d.displayName) + ' is an introducing partner of Valura and is remunerated for introductions; the amount is disclosed to you at account opening and does not increase what you pay.' : ''}</p>
    </div>
  </article>
  <div class="callout warn" style="max-width:640px;margin:0 auto 26px"><b>Before sending —</b> ${VLR.fmt.esc(e.notes)}</div>`;
};
