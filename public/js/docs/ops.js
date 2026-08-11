/* ============================================================================
   Operational artefacts — intake form, KYB checklist, business plan, statement
   ==========================================================================*/

window.VLR = window.VLR || {};
VLR.Doc = VLR.Doc || {};

/* -- Partner intake form — collected once, everything generates from it --- */
VLR.Doc.intakeForm = function (p) {
  const d = VLR.derive(p);
  const sec = (no, title, note, fields) => `
    <h2 class="sec"><span class="no">${no}</span>${title}</h2>
    ${note ? `<p class="fine" style="margin-top:-4px">${note}</p>` : ''}
    <table class="dt"><tbody>${fields.map(f => `<tr>
      <td style="width:38%">${f[0]}${f[2] ? ' <span style="color:var(--down)">*</span>' : ''}</td>
      <td>${f[1] ? VLR.fmt.esc(f[1]) : '<span style="color:var(--text-faint)">—</span>'}</td>
    </tr>`).join('')}</tbody></table>`;

  return `
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: 'Partner intake · one form, once', cobrand: true,
      title: `Everything downstream is <em>generated from this</em>.`,
      stand: `Your partner code, microsite, visiting cards, collateral pack, business plan and client onboarding documents are all produced from the answers below. We do not ask for the same thing twice.`,
      meta: [['Partner', d.displayName], ['Due', 'D+3 from signature'], ['Sections', '8']] })}

    ${sec('01', 'Entity', 'As it appears on the certificate of incorporation.', [
      ['Legal name', p.legalName, true], ['Trading name', p.tradingName],
      ['Registered address', p.registeredAddress, true], ['Correspondence address', p.correspondenceAddress],
      ['CIN', p.cin, true], ['PAN', p.pan, true], ['GST', p.gst, true],
      ['Date of incorporation', p.incorporationDate ? VLR.fmt.date(p.incorporationDate) : '', true],
      ['Website', p.website], ['Regulatory registrations held — type, number, validity', p.regRegistrations]
    ])}

    ${sec('02', 'People', 'The signatory must match the board resolution. Portal seats are by tier.', [
      ['Authorised signatory', [p.signatoryName, p.signatoryTitle, p.signatoryEmail, p.signatoryMobile].filter(Boolean).join(' · '), true],
      ['Primary business contact', [p.businessContact, p.businessEmail, p.businessMobile].filter(Boolean).join(' · '), true],
      ['Marketing contact', [p.marketingContact, p.marketingEmail].filter(Boolean).join(' · ')],
      ['Operations contact', [p.opsContact, p.opsEmail].filter(Boolean).join(' · ')],
      ['Compliance contact', [p.complianceContact, p.complianceEmail].filter(Boolean).join(' · ')],
      ['Portal seats required', String(d.portalSeats)]
    ])}

    <h2 class="sec"><span class="no">03</span>People needing a Valura email ID or a visiting card</h2>
    <p class="fine" style="margin-top:-4px">Valura creates the mailboxes and hands over credentials — the partner configures nothing. Cards carry variable data per person against a fixed layout.</p>
    <table class="dt">
      <thead><tr><th>Name</th><th>Title</th><th>Mobile</th><th>Mailbox</th><th class="num">Cards</th><th>Address to be created</th></tr></thead>
      <tbody>${(p.people || []).filter(x => x.name).length
        ? (p.people || []).filter(x => x.name).map(x => `<tr>
            <td>${VLR.fmt.esc(x.name)}</td><td>${VLR.fmt.esc(x.title || '')}</td><td>${VLR.fmt.esc(x.mobile || '')}</td>
            <td>${x.wantsEmailId ? 'Yes' : '—'}</td><td class="num">${x.wantsCard ? (x.cardQty || 100) : '—'}</td>
            <td class="mono" style="font-size:9px">${x.wantsEmailId ? VLR.fmt.esc(VLR.Doc.emailFor(p, x)) : '—'}</td></tr>`).join('')
        : `<tr><td colspan="6" style="color:var(--text-faint)">No people listed yet — this is the list requested at D+1 and due with this form at D+3.</td></tr>`}
      </tbody>
    </table>

    ${sec('04', 'Brand', 'Logo at 1000px or more, light and dark. Your colours occupy the partner slot of the lockup only.', [
      ['Logo — light background', p.logoLight ? 'Received' : '', true],
      ['Logo — dark background', p.logoDark ? 'Received' : ''],
      ['Primary colour', p.primaryHex, true], ['Secondary colour', p.secondaryHex],
      ['Preferred lockup', p.lockup === 'stacked' ? 'Stacked' : 'Side by side'],
      ['Tagline', p.tagline], ['Brand fonts', p.brandFontNote],
      ['Social handles', Object.values(p.social || {}).filter(Boolean).join(' · ')]
    ])}

    ${sec('05', 'Digital', 'Determines whether the microsite runs on a Valura subdomain or yours.', [
      ['Do you own a domain?', p.ownsDomain ? 'Yes — ' + (p.domain || '') : 'No'],
      ['Preferred microsite slug', d.slug],
      ['Do you control DNS?', p.controlsDns ? 'Yes' : 'No'],
      ['Preferred email format', p.emailFormat],
      ['Existing CRM or email platform', p.crm]
    ])}

    ${sec('06', 'Commercial', 'Bank details are used for quarterly settlement under Clause 5.3.1.', [
      ['Tier elected', d.t.label, true],
      ['Year-1 AUM target (USD)', p.aumTargetUsd ? VLR.fmt.usd(p.aumTargetUsd) : ''],
      ['Expected client count', p.clientTarget ? String(p.clientTarget) : ''],
      ['Average ticket (USD)', p.avgTicketUsd ? VLR.fmt.usd(p.avgTicketUsd) : ''],
      ['USD bank account', [p.bankName, p.bankAccount, p.swift, p.iban].filter(Boolean).join(' · '), true],
      ['GST invoicing entity', p.gstEntity, true]
    ])}

    ${sec('07', 'GTM and logistics', 'Languages is not cosmetic — it decides whether collateral is produced once or four times.', [
      ['Client segments served', p.clientSegments], ['Cities', p.cities],
      ['Languages your clients read in', p.languages, true],
      ['Marketing budget band', p.marketingBudgetInr ? VLR.fmt.inr(p.marketingBudgetInr) : d.t.spendBandInr],
      ['Offline event appetite', p.offlineAppetite],
      ['Shipping address for the kit', p.shippingAddress, true],
      ['Welcome kits required', String(p.welcomeKitQty || 1)],
      ['Gift preferences', p.giftPreference]
    ])}

    ${sec('08', 'Compliance', 'The Pre-Existing Clients declaration must be captured now. After a dispute begins it is unprovable.', [
      ['Pre-Existing Clients (Clause 12.2 carve-out)', p.preExistingClients, true],
      ['Other platforms you distribute for', p.otherPlatforms],
      ['Regulatory action in the last five years', p.regulatoryAction, true],
      ['Adverse media declaration', p.regulatoryAction ? 'Declared as above' : '', true]
    ])}

    <div class="callout"><b>Declaration.</b> The information given above is true and complete. The signatory confirms authority to bind ${VLR.fmt.esc(d.displayName)} and undertakes to notify Valura within ten business days of any material change, including a change of control, registered address, authorised signatory, bank account or regulatory standing.</div>

    <div class="sign-grid">
      <div class="sign-box"><div class="who">${VLR.fmt.esc(d.displayName)}</div><div class="line"></div>
        <div class="f">${VLR.fmt.esc(p.signatoryName || 'Authorised signatory')}<br>Date: ______________</div></div>
      <div class="sign-box"><div class="who">Received by Valura</div><div class="line"></div>
        <div class="f">Compliance review · target ${VLR.CONFIG.ops.kybTatHours}h to partner code<br>Date: ______________</div></div>
    </div>
    ${VLR.Doc.foot(p, d.ent.legalName, 'Partner intake form · one form, once')}
  </section>`;
};

/* -- KYB checklist and review record -------------------------------------- */
VLR.Doc.kybChecklist = function (p) {
  const d = VLR.derive(p);
  const st = c => (p.kyb[c] || {}).status || 'PENDING';
  const req = VLR.CONFIG.kybPack.filter(k => k.required);
  const done = req.filter(k => st(k.code) === 'APPROVED').length;
  return `
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: 'Know-your-business · review record', cobrand: false,
      title: `${done} of ${req.length} required documents <em>approved</em>.`,
      stand: `The published turnaround is ${VLR.CONFIG.ops.kybTatHours} hours from document completeness to partner code. The clock starts when the last document lands, which is why we ask for them together.`,
      meta: [['Partner', d.displayName], ['Entity', d.ent.short], ['Reviewer', VLR.CONFIG.team.COMPLIANCE.name]] })}

    <table class="dt">
      <thead><tr><th>Document</th><th>Required</th><th>Status</th><th>Note</th></tr></thead>
      <tbody>${VLR.CONFIG.kybPack.map(k => `<tr>
        <td>${VLR.fmt.esc(k.label)}</td>
        <td>${k.required ? 'Yes' : 'If applicable'}</td>
        <td style="color:${st(k.code) === 'APPROVED' ? 'var(--brand)' : (st(k.code) === 'REJECTED' ? 'var(--down)' : 'var(--text-muted)')}">${st(k.code)}</td>
        <td>${VLR.fmt.esc((p.kyb[k.code] || {}).note || '')}</td></tr>`).join('')}
      </tbody>
    </table>

    <h2 class="sec"><span class="no">01</span>Risk rating</h2>
    <table class="dt">
      <tbody>
        <tr><td>Segment</td><td>${VLR.fmt.esc(d.seg.label)}</td></tr>
        <tr><td>Regulated in its own right</td><td>${p.regRegistrations ? 'Yes — ' + VLR.fmt.esc(p.regRegistrations) : 'No registrations declared'}</td></tr>
        <tr><td>Regulatory action, last 5 years</td><td>${VLR.fmt.esc(p.regulatoryAction || 'Not declared')}</td></tr>
        <tr><td>Other platforms distributed for</td><td>${VLR.fmt.esc(p.otherPlatforms || 'None declared')}</td></tr>
        <tr><td>Anchor linkage</td><td>${p.anchorPartnerCode ? 'Sub-partner of ' + VLR.fmt.esc(p.anchorPartnerCode) : 'Direct'}</td></tr>
      </tbody>
    </table>

    <div class="callout ${done === req.length ? '' : 'stop'}">
      ${done === req.length
        ? `<b>Complete.</b> Partner code may be issued, subject to the referral disclosure resolving and being approved by a compliance user.`
        : `<b>Incomplete.</b> ${req.length - done} required document(s) outstanding. No partner code may be issued.`}
    </div>

    <div class="sign-grid">
      <div class="sign-box"><div class="who">Reviewed by</div><div class="line"></div>
        <div class="f">${VLR.fmt.esc(VLR.CONFIG.team.COMPLIANCE.name)}<br>Date: ______________</div></div>
      <div class="sign-box"><div class="who">Partner code issued</div><div class="line"></div>
        <div class="f">${VLR.fmt.esc(p.partnerCode || 'Pending')}<br>Date: ______________</div></div>
    </div>
    ${VLR.Doc.foot(p, 'Internal · retained for the regulatory record', 'KYB review record')}
  </section>`;
};

/* -- Business plan --------------------------------------------------------- */
VLR.Doc.businessPlan = function (p) {
  const d = VLR.derive(p);
  const C = VLR.CONFIG;
  const aumTarget = p.aumTargetUsd || d.t.aumTargetY1Usd;
  const avgTicket = p.avgTicketUsd || Math.round(aumTarget / (p.clientTarget || d.t.clientTargetY1));
  const pl = VLR.Econ.plan({ aumTarget, avgTicket, rotation: p.rotation, giftCityShare: p.giftCityShare,
    tierKey: p.tier, placementsPerYearUsd: p.placementsPerYearUsd || 0, placementMix: p.placementMix });
  const monthly = p.monthlyCostUsd || 1500;
  const be = VLR.Econ.breakEvenMonth(pl.months, monthly);
  const fx = C.ops.fxUsdInr;

  /* Weekly input targets, worked backwards from the client target */
  const clients = pl.clients;
  const conv = { meetingToKyc: 0.35, callToMeeting: 0.30 };
  const kycNeeded = Math.ceil(clients / 0.7);
  const meetings = Math.ceil(kycNeeded / conv.meetingToKyc);
  const calls = Math.ceil(meetings / conv.callToMeeting);

  return `
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: `Business plan · year one · ${d.t.label}`, cobrand: true,
      title: `${VLR.fmt.usdShort(aumTarget)} of referred AUM, and <em>what it takes to get there</em>.`,
      stand: `Built backwards from the target: AUM to clients, clients to meetings, meetings to calls. The weekly numbers at the end are the only ones anyone can actually manage.`,
      meta: [['AUM target', VLR.fmt.usdShort(aumTarget)], ['Clients', String(clients)], ['Avg ticket', VLR.fmt.usd(avgTicket)], ['Break-even', be ? 'Month ' + be : 'Not in year 1']] })}

    <h2 class="sec"><span class="no">01</span>The target, decomposed</h2>
    <div class="kv">
      <div><div class="k">Year-1 AUM</div><div class="v">${VLR.fmt.usdShort(aumTarget)}</div></div>
      <div><div class="k">Clients needed</div><div class="v">${clients}</div></div>
      <div><div class="k">Average ticket</div><div class="v">${VLR.fmt.usd(avgTicket)}</div></div>
      <div><div class="k">Exit run-rate income</div><div class="v">${VLR.fmt.usd(pl.exitRunRateUsd)}</div></div>
    </div>

    <h2 class="sec"><span class="no">02</span>Weekly input targets</h2>
    <p class="fine" style="margin-top:-4px">Outputs are observed; inputs are managed. These are the numbers reviewed weekly for the first 90 days.</p>
    <table class="dt">
      <thead><tr><th>Input</th><th class="num">Year</th><th class="num">Per month</th><th class="num">Per week</th><th>Assumption</th></tr></thead>
      <tbody>
        <tr><td>Introductory calls</td><td class="num">${calls}</td><td class="num">${Math.ceil(calls / 12)}</td><td class="num"><b>${Math.ceil(calls / 48)}</b></td><td>${VLR.fmt.pct(conv.callToMeeting, 0)} convert to a meeting</td></tr>
        <tr><td>Client meetings</td><td class="num">${meetings}</td><td class="num">${Math.ceil(meetings / 12)}</td><td class="num"><b>${Math.ceil(meetings / 48)}</b></td><td>${VLR.fmt.pct(conv.meetingToKyc, 0)} start KYC</td></tr>
        <tr><td>KYCs started</td><td class="num">${kycNeeded}</td><td class="num">${Math.ceil(kycNeeded / 12)}</td><td class="num"><b>${Math.ceil(kycNeeded / 48)}</b></td><td>70% fund</td></tr>
        <tr class="hl"><td>Funded clients</td><td class="num">${clients}</td><td class="num">${Math.ceil(clients / 12)}</td><td class="num"><b>${(clients / 48).toFixed(1)}</b></td><td>At ${VLR.fmt.usd(avgTicket)} average</td></tr>
      </tbody>
    </table>

    <h2 class="sec"><span class="no">03</span>Month-by-month P&amp;L</h2>
    <table class="dt">
      <thead><tr><th class="num">M</th><th class="num">Closing AUM</th><th class="num">Clients</th><th class="num">Recurring</th><th class="num">Placement</th><th class="num">Total USD</th><th class="num">Total INR</th><th class="num">Cumulative net</th></tr></thead>
      <tbody>${(() => { let cum = 0; return pl.months.map(m => { cum += m.totalUsd - monthly; return `<tr${be === m.month ? ' class="hl"' : ''}>
        <td class="num">${m.month}</td>
        <td class="num">${VLR.fmt.usdShort(m.closingAum)}</td>
        <td class="num">${m.clients}</td>
        <td class="num">${VLR.fmt.usd(m.recurringUsd)}</td>
        <td class="num">${m.placementUsd ? VLR.fmt.usd(m.placementUsd) : '—'}</td>
        <td class="num">${VLR.fmt.usd(m.totalUsd)}</td>
        <td class="num">${VLR.fmt.inr(m.totalUsd * fx)}</td>
        <td class="num" style="color:${cum >= 0 ? 'var(--brand)' : 'var(--down)'}">${VLR.fmt.usd(cum)}</td></tr>`; }).join(''); })()}
        <tr class="tot"><td colspan="5">Year one</td>
          <td class="num">${VLR.fmt.usd(pl.year1Usd)}</td>
          <td class="num">${VLR.fmt.inr(pl.year1Usd * fx)}</td>
          <td class="num">${VLR.fmt.usd(pl.year1Usd - monthly * 12)}</td></tr>
      </tbody>
    </table>
    <p class="fine">Assumes a running cost of ${VLR.fmt.usd(monthly)} a month (${VLR.fmt.inr(monthly * fx)}) covering the partner's own time allocation, marketing and travel, and an AUM ramp that reaches target in month 12. ${be ? `Break-even in month ${be}.` : 'Break-even falls beyond year one at these assumptions — either the target or the cost base needs revisiting.'}</p>

    <h2 class="sec"><span class="no">04</span>Budget and co-funding</h2>
    <table class="dt">
      <thead><tr><th>Line</th><th class="num">Partner</th><th class="num">Valura co-fund at ${VLR.fmt.pct(d.t.coFundingPct, 0)}</th><th>Note</th></tr></thead>
      <tbody>${(() => {
        const band = p.marketingBudgetInr || 600000;
        const lines = [
          ['Launch event / roundtable', 0.35], ['Digital campaign and content', 0.25],
          ['Print, kit and gifting', 0.20], ['Webinars and travel', 0.20]
        ];
        return lines.map(([l, w]) => `<tr><td>${l}</td>
          <td class="num">${VLR.fmt.inr(band * w)}</td>
          <td class="num">${VLR.fmt.inr(band * w * d.t.coFundingPct)}</td>
          <td>Against approved spend</td></tr>`).join('') +
          `<tr class="tot"><td>Total</td><td class="num">${VLR.fmt.inr(band)}</td><td class="num">${VLR.fmt.inr(band * d.t.coFundingPct)}</td><td>${VLR.fmt.esc(d.t.spendBandInr)} band</td></tr>`;
      })()}
      </tbody>
    </table>

    <h2 class="sec"><span class="no">05</span>Resources and readiness</h2>
    <table class="dt">
      <tbody>
        <tr><td>People certified before launch</td><td>${(p.people || []).length || 1} — certification gates Stage 06</td></tr>
        <tr><td>Coverage from Valura</td><td>${VLR.fmt.esc(d.t.coverage)} · ${VLR.fmt.esc(d.t.cadence)}</td></tr>
        <tr><td>Client segments</td><td>${VLR.fmt.esc(p.clientSegments || d.seg.label)}</td></tr>
        <tr><td>Languages</td><td>${VLR.fmt.esc(p.languages)} — decides whether collateral is produced once or several times</td></tr>
        <tr><td>Cities</td><td>${VLR.fmt.esc(p.cities || '—')}</td></tr>
      </tbody>
    </table>

    <div class="sign-grid">
      <div class="sign-box"><div class="who">${VLR.fmt.esc(d.displayName)} — plan agreed</div><div class="line"></div>
        <div class="f">${VLR.fmt.esc(p.signatoryName || '—')}<br>Date: ______________</div></div>
      <div class="sign-box"><div class="who">Valura — plan signed off</div><div class="line"></div>
        <div class="f">${VLR.fmt.esc(C.team.BD.name)} · ${VLR.fmt.esc(C.team.FINANCE.name)}<br>Date: ______________</div></div>
    </div>
    ${VLR.Doc.foot(p, d.ent.legalName, 'Business plan · year one · projections, not guarantees')}
  </section>`;
};

/* -- Quarterly statement --------------------------------------------------- */
VLR.Doc.statement = function (p) {
  const d = VLR.derive(p);
  const C = VLR.CONFIG;
  const stmts = p.effectiveDate ? VLR.Cal.statementDeadlines(p.effectiveDate, 1) : [];
  const s = stmts[0];
  /* Illustrative quarter at 40% of the year-1 target — the generator runs on
     real ledger data in production; the shape and every rate are final.     */
  const aum = (p.aumTargetUsd || d.t.aumTargetY1Usd) * 0.4;
  const r = VLR.Econ.recurring({ aum, tierKey: p.tier, rotation: p.rotation, giftCityShare: p.giftCityShare,
    platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct });
  const q = x => x / 4;
  const placementQ = (p.placementsPerYearUsd || 0) / 4;
  const pf = placementQ ? VLR.Econ.placementOnDeal({ tierKey: p.tier, assetClass: p.placementMix || 'STRUCTURED',
    subscriptionUsd: placementQ, placementSharePct: d.placementSharePct }) : null;
  const gross = q(r.partnerTotal) + (pf ? pf.partnerFeeUsd : 0);
  const tds = gross * 0.10;
  const gst = gross * 0.18;
  const net = gross - tds;

  return `
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: `Quarterly statement · ${s ? s.quarter : '—'}`, cobrand: true,
      title: `${VLR.fmt.usd(net)} net payable, <em>and how we got there</em>.`,
      stand: `Issued within ${C.ops.statementDueBusinessDays} business days of quarter end as Clause 5.3.2 requires. Every line derives from the same calculation as your term sheet and Schedule A.`,
      meta: [['Partner code', p.partnerCode || 'Pending'], ['Period', s ? s.quarter : '—'],
             ['Issued', s ? VLR.fmt.date(s.due) : '—'], ['Query window closes', s ? VLR.fmt.date(s.disputeCloses) : '—']] })}

    <h2 class="sec"><span class="no">01</span>Recurring fee</h2>
    <table class="dt">
      <thead><tr><th>Line</th><th class="num">Basis</th><th class="num">Rate</th><th class="num">Amount USD</th></tr></thead>
      <tbody>
        <tr><td>Average Referred-Customer AUM</td><td class="num">${VLR.fmt.usd(aum)}</td><td class="num">—</td><td class="num">—</td></tr>
        <tr><td>Less fee-exempt assets</td><td class="num">${VLR.fmt.usd(r.exemptAum)}</td><td class="num">${VLR.fmt.pct(p.giftCityShare, 0)}</td><td class="num">—</td></tr>
        <tr><td>Average Chargeable AUM</td><td class="num">${VLR.fmt.usd(r.chargeableAum)}</td><td class="num">—</td><td class="num">—</td></tr>
        <tr><td>Platform fee collected in quarter</td><td class="num">${VLR.fmt.usd(r.chargeableAum)}</td><td class="num">${VLR.fmt.pct(C.clientSchedule.platformFeePct)} p.a.</td><td class="num">${VLR.fmt.usd(q(r.platformFeeCollected))}</td></tr>
        <tr class="hl"><td>Your share of the platform fee</td><td class="num">—</td><td class="num">${VLR.fmt.pct(d.platformSharePct, 0)}</td><td class="num">${VLR.fmt.usd(q(r.platformToPartner))}</td></tr>
        <tr><td>Traded value in quarter</td><td class="num">${VLR.fmt.usd(q(r.tradedValue))}</td><td class="num">${VLR.fmt.pct(p.rotation, 0)} p.a. rotation</td><td class="num">—</td></tr>
        <tr><td>Net brokerage retained</td><td class="num">—</td><td class="num">${VLR.fmt.pct(C.clientSchedule.netBrokerageRetainedPct)}</td><td class="num">${VLR.fmt.usd(q(r.netRetained))}</td></tr>
        <tr class="hl"><td>Your share of net brokerage</td><td class="num">—</td><td class="num">${VLR.fmt.pct(d.brokerageSharePct, 0)}</td><td class="num">${VLR.fmt.usd(q(r.brokerageToPartner))}</td></tr>
      </tbody>
    </table>

    <h2 class="sec"><span class="no">02</span>Placements</h2>
    ${pf ? `<table class="dt">
      <thead><tr><th>Asset class</th><th class="num">Subscription value</th><th class="num">Your rate</th><th class="num">Amount USD</th></tr></thead>
      <tbody><tr><td>${VLR.fmt.esc(pf.label)}</td><td class="num">${VLR.fmt.usd(pf.subscriptionUsd)}</td>
        <td class="num">${VLR.fmt.pct(pf.partnerRate)}</td><td class="num">${VLR.fmt.usd(pf.partnerFeeUsd)}</td></tr></tbody>
    </table>` : `<p class="fine">No primary placements settled in this period.</p>`}

    <h2 class="sec"><span class="no">03</span>Settlement</h2>
    <table class="dt">
      <tbody>
        <tr><td>Gross payable</td><td class="num">${VLR.fmt.usd(gross)}</td></tr>
        <tr><td>Withholding tax at source</td><td class="num">− ${VLR.fmt.usd(tds)}</td></tr>
        <tr class="tot"><td>Net payable</td><td class="num">${VLR.fmt.usd(net)} · ${VLR.fmt.inr(net * C.ops.fxUsdInr)}</td></tr>
        <tr><td>GST to be added on your invoice</td><td class="num">${VLR.fmt.usd(gst)}</td></tr>
      </tbody>
    </table>
    <p class="fine">Withholding is applied at the prevailing rate under Indian tax law; the rate shown is indicative pending your PAN and treaty documentation. Raise a valid GST invoice against this statement before payment is released. Payment is made in USD to the account nominated under Clause 5.3.1.</p>

    <div class="callout warn"><b>Query window.</b> Under Clause 5.3.5 you have ${C.ops.disputeWindowDays} days from receipt to raise any query in writing${s ? ` — until ${VLR.fmt.date(s.disputeCloses)}` : ''}. After that this statement is deemed accepted.</div>

    <div class="callout"><b>This is a generated specimen.</b> The production statement runs on the settled ledger. The structure, every rate and every derivation shown here are final; only the AUM, traded value and placement figures are drawn from the plan rather than the ledger.</div>
    ${VLR.Doc.foot(p, d.ent.legalName + ' · ' + d.ent.licence, `Statement · ${s ? s.quarter : ''} · Clause 5.3.2`)}
  </section>`;
};
