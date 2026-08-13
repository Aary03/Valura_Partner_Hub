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

/* -- Business plan — on the finalised P&L model ----------------------------
   Every figure comes from VLR.Econ.partnerPlan(), a port of
   Valura_Partner_PnL_Dashboard.xlsx. Blended rate, monthly roll-forward, cost
   escalator, working capital and the three cases all tie to that workbook.
   ------------------------------------------------------------------------ */
VLR.Doc.businessPlan = function (p) {
  const d = VLR.derive(p);
  const C = VLR.CONFIG;
  const fx = C.ops.fxUsdInr;
  const usd = n => VLR.fmt.usd(n / fx);

  const plan = VLR.Econ.partnerPlan({
    clientsPerMonth: p.clientsPerMonth, rampMonths: p.rampMonths,
    avgTicketInr: p.avgTicketInr, migratedBookInr: p.migratedBookInr,
    retention: p.retention, aumGrowth: p.aumGrowth,
    anchor: p.tier === 'ANCHOR', subPartnerAumPerMonthInr: p.subPartnerAumPerMonthInr,
    includeDayOne: p.includeDayOne !== false,
    blendedRate: VLR.Econ.blendedFromPricing(p).blended
  });
  const br = VLR.Econ.blendedFromPricing(p);
  const vb = VLR.Econ.valuraBorne();
  const bud = plan.budget;
  const inp = plan.inputs;

  const yearRow = (label, w) => `<tr>
    <td>${label}</td>
    <td class="num">${VLR.fmt.inr(w.revenue)}</td>
    <td class="num">${VLR.fmt.inr(w.gross)}</td>
    <td class="num">${VLR.fmt.inr(w.coFund)}</td>
    <td class="num">${VLR.fmt.inr(w.net)}</td>
    <td class="num" style="color:${w.profit >= 0 ? 'var(--brand)' : 'var(--down)'}">${VLR.fmt.inr(w.profit)}</td>
    <td class="num">${usd(w.profit)}</td></tr>`;

  return `
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: `Business plan · ${d.t.label} · 36 months`, cobrand: true,
      title: `${VLR.fmt.inrCr(plan.full.closingAum)} of book, and <em>what it costs to build it</em>.`,
      stand: `Revenue compounds while the cost base stays broadly flat, so the question is never whether the book pays. It is how much working capital carries you to the month it starts to.`,
      meta: [
        ['Blended rate', VLR.fmt.pct(plan.rate, 3) + ' p.a.'],
        ['Peak capital', VLR.fmt.inr(plan.peakCapital)],
        ['Breakeven', plan.breakEvenMonth ? 'Month ' + plan.breakEvenMonth : 'Beyond month 36'],
        ['Valura funds', VLR.fmt.inr(plan.valuraTotalAnnual) + ' p.a.']
      ] })}

    <h2 class="sec"><span class="no">01</span>Working capital — what you fund before the book pays</h2>
    <div class="kv k3">
      <div><div class="k">Peak capital required</div><div class="v">${VLR.fmt.inr(plan.peakCapital)}</div>
        <div class="fine" style="margin-top:4px">The deepest the cumulative cash position goes — the most you are out of pocket.</div></div>
      <div><div class="k">Month of peak deficit</div><div class="v">${plan.peakMonth}</div>
        <div class="fine" style="margin-top:4px">Cash burn bottoms out here, before the book turns it.</div></div>
      <div><div class="k">Recommended reserve</div><div class="v">${VLR.fmt.inr(plan.reserve)}</div>
        <div class="fine" style="margin-top:4px">Peak plus 20%. Do not start without this available.</div></div>
    </div>
    ${plan.dayOne ? `<p class="fine">Day-one setup of ${VLR.fmt.inr(plan.dayOne)} — office deposit, capex and licensing — lands before month 1 and is inside the peak above.</p>` : ''}

    <h2 class="sec"><span class="no">02</span>Cost, revenue, profit</h2>
    <table class="dt">
      <thead><tr><th>Period</th><th class="num">Revenue</th><th class="num">Gross spend</th><th class="num">Valura co-funds</th><th class="num">Your net spend</th><th class="num">Net profit</th><th class="num">In USD</th></tr></thead>
      <tbody>
        ${yearRow('First 6 months', plan.m6)}
        ${yearRow('Year 1', plan.y1)}
        ${yearRow('3 years', plan.full)}
      </tbody>
    </table>
    <div class="kv">
      <div><div class="k">Closing AUM</div><div class="v">${VLR.fmt.inrCr(plan.full.closingAum)}</div></div>
      <div><div class="k">Clients acquired</div><div class="v">${Math.round(plan.full.clients)}</div></div>
      <div><div class="k">Monthly revenue, month 36</div><div class="v">${VLR.fmt.inr(plan.exitMrr)}</div></div>
      <div><div class="k">Cumulative breakeven</div><div class="v sm">${plan.breakEvenMonth ? 'Month ' + plan.breakEvenMonth : 'Beyond month 36'}</div></div>
    </div>

    <h2 class="sec"><span class="no">03</span>Output — what the spend produces</h2>
    <table class="dt"><tbody>
      <tr><td>Cost per client acquired — 3-year net spend ÷ clients</td><td class="num">${VLR.fmt.inr(plan.costPerClient)}</td></tr>
      <tr><td>Revenue per ₹1 of net spend, over 3 years</td><td class="num">${plan.revenuePerRupee.toFixed(2)}×</td></tr>
      <tr><td>AUM built per ₹1 of net spend</td><td class="num">${plan.aumPerRupee.toFixed(1)}×</td></tr>
      <tr><td>Year-3 run-rate revenue, months 25–36</td><td class="num">${VLR.fmt.inr(plan.year3RunRate)}</td></tr>
    </tbody></table>
    ${VLR.Doc.foot(p, d.ent.legalName, 'Business plan · page 1 · illustrative, not a guarantee')}
  </section>

  <section class="pg a4">
    ${VLR.Doc.eyebrow('Assumptions · where the earning comes from')}
    <h2 class="sec"><span class="no">04</span>What this runs on</h2>
    <table class="dt">
      <thead><tr><th>Input</th><th class="num">Value</th><th>Why it matters</th></tr></thead>
      <tbody>
        <tr><td>New clients per month, steady state</td><td class="num">${inp.clientsPerMonth}</td><td>Reached after the ramp.</td></tr>
        <tr><td>Ramp-up months</td><td class="num">${inp.rampMonths}</td><td>Month 1 runs at 1/${inp.rampMonths}th of steady state.</td></tr>
        <tr><td>Average first ticket</td><td class="num">${VLR.fmt.inr(inp.avgTicket)}</td><td>The first cheque, not the eventual relationship.</td></tr>
        <tr><td>Existing book migrated during ramp</td><td class="num">${VLR.fmt.inr(inp.migrated)}</td><td>Spread evenly over the ramp. Zero for a cold start.</td></tr>
        <tr><td>Client retention p.a.</td><td class="num">${VLR.fmt.pct(inp.retention, 0)}</td><td rowspan="2">Together these give a monthly roll-forward of ${inp.roll.toFixed(6)}, applied to the closing book each month.</td></tr>
        <tr><td>AUM growth — market plus top-ups, p.a.</td><td class="num">${VLR.fmt.pct(inp.growth, 0)}</td></tr>
        <tr class="hl"><td>Blended partner earning rate</td><td class="num">${VLR.fmt.pct(plan.rate, 3)} p.a.</td><td>Derived from the split agreed on the pricing sheet, not typed in.</td></tr>
      </tbody>
    </table>

    <h2 class="sec"><span class="no">05</span>Where the earning comes from</h2>
    <table class="dt">
      <thead><tr><th>Asset class</th><th class="num">% of portfolio</th><th class="num">Platform</th><th class="num">Brokerage</th><th class="num">Placement</th><th class="num">Trail</th><th class="num">Your rate</th><th class="num">Share</th></tr></thead>
      <tbody>${br.rows.map(r => `<tr>
        <td>${VLR.fmt.esc(r.label)}</td>
        <td class="num">${VLR.fmt.pct(r.weight, 0)}</td>
        <td class="num">${VLR.fmt.pct(r.platformRate)}</td>
        <td class="num">${VLR.fmt.pct(r.brokerageRate)}</td>
        <td class="num">${r.placementRate ? VLR.fmt.pct(r.placementRate) : '—'}</td>
        <td class="num">${r.trailRate ? VLR.fmt.pct(r.trailRate) : '—'}</td>
        <td class="num"><b>${VLR.fmt.pct(r.rate)}</b></td>
        <td class="num">${VLR.fmt.pct(r.shareOfEarnings, 1)}</td></tr>`).join('')}
        <tr class="tot"><td>Blended</td><td class="num">100%</td><td class="num" colspan="4"></td>
          <td class="num">${VLR.fmt.pct(br.blended)}</td><td class="num">100%</td></tr>
      </tbody>
    </table>

    <h2 class="sec"><span class="no">06</span>What each class earns you</h2>
    <table class="dt">
      <thead><tr><th>Asset class</th><th class="num">First 6 months</th><th class="num">Year 1</th><th class="num">3 years</th><th class="num">Monthly by month 36</th></tr></thead>
      <tbody>${br.rows.map(r => `<tr>
        <td>${VLR.fmt.esc(r.label)}</td>
        <td class="num">${VLR.fmt.inr(plan.m6.revenue * r.shareOfEarnings)}</td>
        <td class="num">${VLR.fmt.inr(plan.y1.revenue * r.shareOfEarnings)}</td>
        <td class="num">${VLR.fmt.inr(plan.full.revenue * r.shareOfEarnings)}</td>
        <td class="num">${VLR.fmt.inr(plan.exitMrr * r.shareOfEarnings)}</td></tr>`).join('')}
        <tr class="tot"><td>Total</td>
          <td class="num">${VLR.fmt.inr(plan.m6.revenue)}</td>
          <td class="num">${VLR.fmt.inr(plan.y1.revenue)}</td>
          <td class="num">${VLR.fmt.inr(plan.full.revenue)}</td>
          <td class="num">${VLR.fmt.inr(plan.exitMrr)}</td></tr>
      </tbody>
    </table>
    <p class="fine">Placement fees on pre-IPO and private funds are one-time when money is deployed, shown per annum on the convention that the allocation redeploys roughly once a year. Change the portfolio mix to match this partner's actual client base and the whole model reprices.</p>
    ${VLR.Doc.foot(p, d.ent.legalName, 'Business plan · page 2')}
  </section>

  <section class="pg a4">
    ${VLR.Doc.eyebrow('Your cost lines · what Valura funds · what Valura absorbs')}

    <h2 class="sec"><span class="no">07</span>Your monthly cost lines, and Valura's co-marketing</h2>
    <table class="dt">
      <thead><tr><th>Cost line</th><th class="num">Monthly</th><th class="num">Valura %</th><th class="num">Valura pays</th><th class="num">Your net</th><th class="num">Your net p.a.</th></tr></thead>
      <tbody>${bud.rows.map(r => `<tr${r.coFund >= 1 ? ' class="hl"' : ''}>
        <td>${VLR.fmt.esc(r.label)}${r.escalates ? ' <span class="mono" style="font-size:7px;color:var(--text-faint)">ESC</span>' : ''}</td>
        <td class="num">${VLR.fmt.inr(r.monthly)}</td>
        <td class="num">${r.coFund ? VLR.fmt.pct(r.coFund, 0) : '—'}</td>
        <td class="num">${r.valuraPays ? VLR.fmt.inr(r.valuraPays) : '—'}</td>
        <td class="num">${VLR.fmt.inr(r.partnerNet)}</td>
        <td class="num">${VLR.fmt.inr(r.annualNet)}</td></tr>`).join('')}
        <tr class="tot"><td>Total</td>
          <td class="num">${VLR.fmt.inr(bud.grossMonthly)}</td>
          <td class="num">${VLR.fmt.pct(bud.coFundPct, 1)}</td>
          <td class="num">${VLR.fmt.inr(bud.valuraMonthly)}</td>
          <td class="num">${VLR.fmt.inr(bud.netMonthly)}</td>
          <td class="num">${VLR.fmt.inr(bud.netMonthly * 12)}</td></tr>
      </tbody>
    </table>
    <p class="fine">Lines marked ESC escalate at ${VLR.fmt.pct(bud.escalator, 0)} a year, stepping at months 13 and 25. A second relationship manager switches on at ${C.budget.secondRm.triggerClients} clients or ${VLR.fmt.inrCr(C.budget.secondRm.triggerAumInr)} of AUM, whichever comes first.</p>

    <h2 class="sec"><span class="no">08</span>Valura's central co-marketing pool</h2>
    <table class="dt">
      <thead><tr><th>Central item</th><th class="num">₹ per partner p.a.</th><th>Notes</th></tr></thead>
      <tbody>${C.budget.centralPool.map(r => `<tr>
        <td>${VLR.fmt.esc(r.label)}</td><td class="num">${VLR.fmt.inr(r.annual)}</td><td>${VLR.fmt.esc(r.note)}</td></tr>`).join('')}
        <tr class="tot"><td>Central pool</td><td class="num">${VLR.fmt.inr(bud.centralAnnual)}</td><td></td></tr>
      </tbody>
    </table>
    <div class="callout"><b>Valura's cash into your growth: ${VLR.fmt.inr(plan.valuraTotalAnnual)} a year</b> — ${VLR.fmt.inr(bud.valuraMonthly * 12)} of line-level co-marketing plus the ${VLR.fmt.inr(bud.centralAnnual)} central pool. Over three years, ${VLR.fmt.inr(plan.full.coFund)}.</div>

    <h2 class="sec"><span class="no">09</span>And what Valura carries that never reaches your cost sheet</h2>
    <p class="fine" style="margin-top:-4px">The co-marketing above is cash. The list below is infrastructure — built once and operated for every partner. Three of these appear in Valura's own schedule as charges that are listed and then waived, so that what is absorbed is visible rather than silently assumed.</p>
    <table class="dt">
      <thead><tr><th>What Valura runs and pays for</th><th>Basis</th><th class="num">Indicative if charged</th><th>Notes</th></tr></thead>
      <tbody>${vb.rows.map(r => `<tr>
        <td>${VLR.fmt.esc(r.item)}</td>
        <td>${VLR.fmt.esc(r.basis)}</td>
        <td class="num">${r.listedInr ? VLR.fmt.inr(r.listedInr) + ' p.a.' : '—'}</td>
        <td>${VLR.fmt.esc(r.note)}</td></tr>`).join('')}
        <tr class="tot"><td>Indicative annual value absorbed</td><td></td>
          <td class="num">${VLR.fmt.inr(vb.annualInr)}</td>
          <td>${usd(vb.annualInr)} · across ${vb.countedItems} of ${vb.totalItems} lines</td></tr>
      </tbody>
    </table>
    <p class="fine">Indicative values are what these would cost a partner to buy or build alone. They are shown for transparency: they are not charges, not a credit and not a set-off. Nothing in this table is billed to the partner under any circumstance contemplated by the agreement.</p>
    ${VLR.Doc.foot(p, d.ent.legalName, 'Business plan · page 3')}
  </section>

  <section class="pg a4">
    ${VLR.Doc.eyebrow('Month by month')}
    <h2 class="sec"><span class="no">10</span>Thirty-six months</h2>
    <table class="dt" style="font-size:8.5px">
      <thead><tr><th class="num">M</th><th class="num">Clients</th><th class="num">Closing AUM</th><th class="num">Revenue</th>
        <th class="num">Gross cost</th><th class="num">Valura</th><th class="num">Your net</th><th class="num">Profit</th><th class="num">Cumulative</th></tr></thead>
      <tbody>${plan.months.map(m => `<tr${plan.breakEvenMonth === m.month ? ' class="hl"' : (m.month === plan.peakMonth ? ' style="background:#FBF3E2"' : '')}>
        <td class="num">${m.month}</td>
        <td class="num">${m.clients.toFixed(0)}</td>
        <td class="num">${VLR.fmt.inrCr(m.closingAum)}</td>
        <td class="num">${VLR.fmt.inr(m.revenue)}</td>
        <td class="num">${VLR.fmt.inr(m.gross)}</td>
        <td class="num">${VLR.fmt.inr(m.coFund)}</td>
        <td class="num">${VLR.fmt.inr(m.net)}</td>
        <td class="num" style="color:${m.profit >= 0 ? 'var(--brand)' : 'var(--down)'}">${VLR.fmt.inr(m.profit)}</td>
        <td class="num" style="color:${m.cumulative >= 0 ? 'var(--brand)' : 'var(--down)'}">${VLR.fmt.inr(m.cumulative)}</td></tr>`).join('')}
      </tbody>
    </table>
    <p class="fine">The amber row is the month of peak cash deficit; the green row is cumulative breakeven. INR throughout, at ₹${fx} to the dollar.</p>
    ${VLR.Doc.foot(p, d.ent.legalName, 'Business plan · page 4')}
  </section>

  <section class="pg a4">
    ${VLR.Doc.band(p, { label: 'Three cases', cobrand: false,
      title: `Low, medium, high — <em>and what each returns</em>.`,
      stand: `All three run through the identical engine: same asset mix, same retention and growth, same fee schedule. Only the commitment inputs differ, so the comparison isolates what the partner actually controls.`,
      meta: [['Horizon', '36 months'], ['Engine', 'Identical'], ['Variables', 'Six']] })}

    ${(() => {
      const cases = VLR.Econ.threeCases({ anchor: p.tier === 'ANCHOR', blendedRate: br.blended });
      const row = (label, fn, fmt) => `<tr><td>${label}</td>${cases.map(c =>
        `<td class="num">${(fmt || VLR.fmt.inr)(fn(c))}</td>`).join('')}</tr>`;
      return `<table class="dt">
        <thead><tr><th>Commitment</th>${cases.map(c => `<th class="num">${VLR.fmt.esc(c.label)}</th>`).join('')}</tr></thead>
        <tbody>
          ${row('Gross monthly spend', c => c.grossMonthlyInr)}
          ${row('New clients per month', c => c.clientsPerMonth, x => String(x))}
          ${row('Average first ticket', c => c.avgTicketInr)}
          ${row('Existing book migrated', c => c.migratedBookInr)}
          ${row('Your net monthly spend', c => c.plan.budget.netMonthly)}
        </tbody>
      </table>

      <h2 class="sec"><span class="no">11</span>What each returns over 3 years</h2>
      <table class="dt">
        <thead><tr><th>Outcome</th>${cases.map(c => `<th class="num">${VLR.fmt.esc(c.label.split('—')[0].trim())}</th>`).join('')}</tr></thead>
        <tbody>
          ${row('Clients acquired', c => c.plan.full.clients, x => String(Math.round(x)))}
          ${row('Closing AUM — month 36', c => c.plan.full.closingAum, VLR.fmt.inrCr)}
          ${row('Revenue — year 1', c => c.plan.y1.revenue)}
          ${row('Revenue — 3 years', c => c.plan.full.revenue)}
          ${row('Your net spend — 3 years', c => c.plan.full.net)}
          ${row('Valura co-funds — 3 years', c => c.plan.full.coFund)}
          <tr class="tot"><td>Net profit / (build cost)</td>${cases.map(c =>
            `<td class="num" style="color:${c.plan.full.profit >= 0 ? 'var(--brand)' : 'var(--down)'}">${VLR.fmt.inr(c.plan.full.profit)}</td>`).join('')}</tr>
          ${row('Revenue per ₹1 of net spend', c => c.plan.revenuePerRupee, x => x.toFixed(2) + '×')}
          ${row('Cumulative breakeven', c => c.plan.breakEvenMonth, x => x ? 'Month ' + x : 'Beyond 36')}
          ${row('Monthly revenue by month 36', c => c.plan.exitMrr)}
          ${row('Peak capital required', c => c.plan.peakCapital)}
        </tbody>
      </table>
      <div class="callout"><b>The pattern to notice:</b> revenue compounds while cost stays broadly flat, so the larger the commitment the harder every rupee works — ${cases[2].plan.revenuePerRupee.toFixed(2)}× on the high case against ${cases[0].plan.revenuePerRupee.toFixed(2)}× on the low one, and ${VLR.fmt.inr(cases[2].plan.exitMrr)} a month arriving by month 36. Low is deliberately marginal: at a solo-operator budget the three-year return hovers near 1× and breakeven arrives late. That is the argument for the middle case — arithmetic, not pressure.</div>`;
    })()}

    <div class="sign-grid" style="margin-top:24px">
      <div class="sign-box"><div class="who">${VLR.fmt.esc(d.displayName)} — plan agreed</div><div class="line"></div>
        <div class="f">${VLR.fmt.esc(p.signatoryName || '—')}<br>Date: ______________</div></div>
      <div class="sign-box"><div class="who">Valura — plan signed off</div><div class="line"></div>
        <div class="f">${VLR.fmt.esc(C.team.BD.name)} · ${VLR.fmt.esc(C.team.FINANCE.name)}<br>Date: ______________</div></div>
    </div>
    ${VLR.Doc.foot(p, d.ent.legalName, 'Business plan · illustrative model, not an offer or advice')}
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
