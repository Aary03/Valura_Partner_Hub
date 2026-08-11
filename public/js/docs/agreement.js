/* ============================================================================
   PARTNER AGREEMENT v2.0 — generated from the variable set only.
   ----------------------------------------------------------------------------
   What changed from the executed v1.0 paper, and why:

   [FIX 1] Platform-fee share. v1.0 paid a FIXED 0.35% p.a. out of a platform
           fee the client Schedule of Charges v3.0 sets at 0.30% p.a. — a 5bp
           loss on every rupee, and a total loss on GIFT City fund AUM, which
           is exempt. v2.0 pays a PERCENTAGE OF WHAT IS ACTUALLY COLLECTED.
           The margin cannot go negative, and the clause survives repricing.

   [FIX 2] Tail. v1.0 gave every partner a perpetual, uncapped annuity after
           termination. v2.0 sets the tail by tier — 24 / 36 months, perpetual
           for Anchor only.

   [FIX 3] Incentives. v1.0 §5.1.1 promised an addendum "to be mutually agreed"
           and preserved a right to negotiate one forever. v2.0 replaces it
           with Schedule C, a published grid. Nothing is left open.

   [FIX 4] Currency. Anchor thresholds were in INR crore while every payment
           obligation was in USD. v2.0 states one currency throughout.

   [NEW 5] Schedule D — trademark and co-branding licence. Did not exist.
   [NEW 6] §16 — data protection and the client-data addendum hook.
   [NEW 7] §8.7 — the partner's referral-disclosure obligation, which is what
           makes clause 18(a) of the global access framework work in practice.
   ==========================================================================*/

window.VLR = window.VLR || {};
VLR.Doc = VLR.Doc || {};

/* ---------------------------------------------------------------------------
   E-signature field geometry — the single source of truth.

   The execution sheet draws its placeholder boxes from this, and the Zoho Sign
   payload places its fields from the same numbers, converted from CSS pixels
   (A4 at 96dpi) to PDF points (72dpi) by × 0.75. Move a box here and the
   drawn page and the signature field move together; there is no second set of
   coordinates to keep in step.

   The sheet is always the last page of the e-sign PDF, so page_no resolves to
   pageCount − 1 regardless of how long the agreement runs.
   ------------------------------------------------------------------------ */
VLR.ESIGN = {
  page: { w: 794, h: 1123 },
  blocks: [
    { role: 'valura',  top: 476, heading: 'For and on behalf of Valura' },
    { role: 'partner', top: 726, heading: 'For and on behalf of the Partner' }
  ],
  fields: [
    { role: 'valura',  type: 'Signature', name: 'ValuraSignature',  label: 'Signature', x: 96, y: 526, w: 250, h: 58 },
    { role: 'valura',  type: 'Date',      name: 'ValuraDate',       label: 'Date',      x: 430, y: 526, w: 170, h: 28 },
    { role: 'partner', type: 'Signature', name: 'PartnerSignature', label: 'Signature', x: 96, y: 776, w: 250, h: 58 },
    { role: 'partner', type: 'Date',      name: 'PartnerDate',      label: 'Date',      x: 430, y: 776, w: 170, h: 28 }
  ]
};

/* The dedicated execution sheet. Fixed height, nothing above it that can
   reflow, so the boxes below sit exactly where VLR.ESIGN says they do.      */
VLR.Doc.executionSheet = function (p) {
  const d = VLR.derive(p);
  const C = VLR.CONFIG;
  const isAnchor = d.isAnchor;
  const E = VLR.ESIGN;

  const box = f => {
    const isSig = f.type === 'Signature';
    return `<div style="position:absolute;left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px;
      border:1px dashed var(--rule-strong);border-radius:var(--r-sm);
      display:flex;align-items:flex-end;justify-content:flex-start;padding:0 0 4px 6px;
      font-family:var(--font-mono);font-size:7px;letter-spacing:.12em;text-transform:uppercase;
      color:var(--text-faint);background:${isSig ? 'var(--paper-2)' : 'transparent'}">${f.label}</div>`;
  };

  const who = role => role === 'valura'
    ? { entity: d.ent.legalName, name: d.ent.signatory.name, title: d.ent.signatory.title }
    : { entity: p.legalName || d.displayName, name: p.signatoryName || '—', title: p.signatoryTitle || '—' };

  return `
  <section class="pg a4" style="height:${E.page.h}px;min-height:${E.page.h}px;position:relative;overflow:hidden">
    ${VLR.Doc.band(p, {
      label: 'Execution', cobrand: false,
      title: `Signed, and <em>one instrument</em>.`,
      stand: `This page is executed as part of, and forms one instrument with, the ${C.ops.templateVersion} dated ${VLR.fmt.date(p.effectiveDate)} between ${VLR.fmt.esc(d.ent.legalName)} and ${VLR.fmt.esc(p.legalName || d.displayName)}, together with Schedule A${isAnchor ? ', Schedule B' : ''}, Schedule C and Schedule D, each of which forms part of that Agreement.`,
      meta: [
        ['Effective date', VLR.fmt.date(p.effectiveDate)],
        ['Tier', d.t.label],
        ['Entity', d.ent.short],
        ['Grid', C.incentiveGrid.ref]
      ]
    })}

    <p class="lede" style="margin-top:4px">IN WITNESS WHEREOF, the Parties have executed this Agreement on the Effective Date. Each Party confirms that the person signing below is duly authorised to bind it.</p>

    ${E.blocks.map(b => {
      const w = who(b.role);
      return `<div style="position:absolute;left:54px;right:54px;top:${b.top}px">
        <div class="lbl">${VLR.fmt.esc(b.heading)}</div>
        <div class="eyebrow-rule"></div>
        <div style="font-size:12px;font-weight:700;margin-top:9px;letter-spacing:var(--tracking-snug)">${VLR.fmt.esc(w.entity)}</div>
      </div>
      <div style="position:absolute;left:96px;top:${b.top + 118}px;width:250px;border-top:1px solid var(--rule-strong);padding-top:7px">
        <div class="fine" style="line-height:1.7">Name: ${VLR.fmt.esc(w.name)}<br>Title: ${VLR.fmt.esc(w.title)}</div>
      </div>`;
    }).join('')}

    ${E.fields.map(box).join('')}

    <div style="position:absolute;left:54px;right:54px;top:1006px">
      <div class="callout" style="margin:0">Executed electronically through Zoho Sign. The audit trail issued with the executed copy — signer identity, timestamps and IP — forms part of the record and is retained against the partner record in the Hub. Counterparts and electronic signature are permitted under Clause 17.6.</div>
    </div>
    ${VLR.Doc.foot(p, d.ent.legalName + ' · ' + d.ent.licence, 'Execution page · ' + C.ops.templateVersion)}
  </section>`;
};

VLR.Doc.agreement = function (p, opts) {
  const o = opts || {};
  const d = VLR.derive(p);
  const C = VLR.CONFIG;
  const ops = C.ops;
  const cs = C.clientSchedule;
  const aq = C.anchorQualification;

  /* Variable fields are wrapped so the Hub can highlight them. Everything
     outside a v() call is immutable template text.                        */
  const v = (val, name) => `<span class="vf${o.showVars ? ' vf-on' : ''}" data-f="${name}">${VLR.fmt.esc(val == null || val === '' ? '—' : val)}</span>`;

  const isAnchor = d.isAnchor;
  const isSub = d.isSubPartner;
  const variant = isAnchor ? 'Anchor Partner' : (isSub ? 'Sub-Partner' : 'Partner');

  const tailClause = d.tailMonths == null
    ? `for so long as each such Referred Customer maintains an active account on the Valura platform, without time limitation (the Anchor Partner tail)`
    : `for a period of ${v(d.tailMonths, 'tail_months')} months from the date of termination, and no longer`;

  const nonStd = (p.nonStandardTerms || []).filter(n => n.text);

  /* ------------------------------------------------------------------ */
  const pages = [];

  /* -- COVER --------------------------------------------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.band(p, {
      label: `${C.ops.templateVersion} · ${variant}`,
      cobrand: true,
      title: `A pricing manifesto, in the form of <em>a partnership</em>.`,
      stand: `The terms on which we share what we earn — with the people who help us grow. ` +
             `Partner compensation under this Agreement is a defined share of revenue Valura actually ` +
             `collects from the client, not a fixed rate quoted against a price that can change.`,
      meta: [
        ['Dated', VLR.fmt.date(p.effectiveDate)],
        ['Between', d.ent.short],
        ['And', d.displayName],
        ['Tier', d.t.label]
      ]
    })}

    <div class="kv k2" style="margin-top:26px">
      <div><div class="k">Two paths to partnership</div>
        <div class="v sm"><b>01 Partner</b> — a defined share of every fee Valura collects on the clients you bring. Schedule A.</div></div>
      <div><div class="k">&nbsp;</div>
        <div class="v sm"><b>02 Anchor Partner</b> — your own clients, plus a ${VLR.fmt.pct(C.tiers.ANCHOR.overridePct, 0)} override on your sub-partners' Schedule A entitlement, paid out of Valura's share. Schedule B.</div></div>
    </div>

    <h2 class="sec"><span class="no">§0</span>What this document contains</h2>
    <table class="dt">
      <thead><tr><th>Part</th><th>Subject</th><th>Editable</th></tr></thead>
      <tbody>
        <tr><td>§1 – §4</td><td>Parties, recitals, definitions, scope of engagement</td><td>Fixed</td></tr>
        <tr><td>§5</td><td>Compensation, calculation, reporting and payment</td><td>Rates only, via Schedule A</td></tr>
        <tr><td>§6</td><td>Illustrative earnings — generated, never typed</td><td>Fixed</td></tr>
        <tr><td>§7</td><td>Anchor Partner qualification</td><td>Fixed</td></tr>
        <tr><td>§8 – §14</td><td>Obligations, term, confidentiality, non-solicit, indemnity, law</td><td>Fixed</td></tr>
        <tr><td>§15 – §16</td><td>Trademark licence, data protection</td><td>Fixed</td></tr>
        <tr><td>Schedule A</td><td>Compensation sheet</td><td>Variable fields only</td></tr>
        <tr><td>Schedule B</td><td>Anchor override structure${isAnchor ? '' : ' — not applicable to this tier'}</td><td>Fixed</td></tr>
        <tr><td>Schedule C</td><td>Published incentive grid, ref ${v(C.incentiveGrid.ref, 'incentive_grid_ref')}</td><td>Published, not negotiated</td></tr>
        <tr><td>Schedule D</td><td>Trademark and co-branding licence</td><td>Fixed</td></tr>
      </tbody>
    </table>

    ${nonStd.length ? `<div class="callout stop"><b>${nonStd.length} non-standard term${nonStd.length > 1 ? 's' : ''} attached.</b>
      Each requires two recorded approvals before this document may be issued for signature. See the schedule of deviations at the end.</div>`
      : `<div class="callout"><b>No non-standard terms.</b> This Agreement is the unmodified ${C.ops.templateVersion} template with variable fields populated. Zero deviations is the target for Starter and Growth tiers.</div>`}

    ${VLR.Doc.foot(p, d.ent.legalName, `Cover · ${C.ops.templateVersion}`)}
  </section>`);

  /* -- PARTIES / DEFINITIONS / SCOPE --------------------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.eyebrow('Parties · recitals · definitions · scope')}

    <h2 class="sec"><span class="no">§1</span>The parties</h2>
    <p>This Partner Agreement (the "Agreement") is entered into on ${v(VLR.fmt.date(p.effectiveDate), 'effective_date')} (the "Effective Date")</p>
    <p><b>BY AND BETWEEN:</b></p>
    <p>${v(d.ent.legalName, 'contracting_entity')}, a company holding ${d.ent.licence}, registered with the ${d.ent.regulator}, with its registered office at ${d.ent.address} (hereinafter "Valura", which expression shall, unless repugnant to the context, include its successors and permitted assigns) of the FIRST PART;</p>
    <p><b>AND</b></p>
    <p>${v(p.legalName, 'partner_legal_name')}${p.cin ? `, ${v('CIN ' + p.cin, 'partner_cin')}` : ''}, having its registered office at ${v(p.registeredAddress, 'partner_registered_address')} (hereinafter the "Partner", which expression shall, unless repugnant to the context, include its successors and permitted assigns) of the SECOND PART.</p>
    ${isSub ? `<p>The Partner is sponsored by, and its Referred Customers are tracked under the network of, the Anchor Partner bearing partner code ${v(p.anchorPartnerCode, 'anchor_partner_code')}, in accordance with Schedule B.3. This Agreement is executed directly between Valura and the Partner; the Anchor Partner is not a party to it.</p>` : ''}

    <h2 class="sec"><span class="no">§2</span>Recitals</h2>
    <p>WHEREAS Valura operates a regulated investment platform offering its customers access to global equities, exchange-traded funds, UCITS and mutual funds, structured products, pre-IPO opportunities, private funds and related services;</p>
    <p>WHEREAS the Partner has the relationships, reach and intent to introduce qualified prospective customers to Valura, and Valura is willing to compensate the Partner for such introductions on the terms set out herein;</p>
    <p>WHEREAS the Parties wish to record the commercial and operational terms of their relationship in writing.</p>
    <p>NOW, THEREFORE, in consideration of the mutual covenants set forth herein, the Parties agree as follows:</p>

    <h2 class="sec"><span class="no">§3</span>Definitions</h2>
    <div class="defn"><b>"AUM"</b> means the aggregate assets under management held by Referred Customers on the Valura platform, calculated daily on a market-value basis and averaged over the relevant period.</div>
    <div class="defn"><b>"Chargeable AUM"</b> means that portion of AUM on which Valura actually charges and collects the Platform Fee. For the avoidance of doubt, GIFT City-domiciled funds and external funds are exempt from the Platform Fee under the Client Fee Schedule and are therefore excluded from Chargeable AUM, and no Recurring Fee arises on them.</div>
    <div class="defn"><b>"Client Fee Schedule"</b> means Valura's published Schedule of Fees &amp; Charges applicable to its customers, as amended from time to time, currently version ${cs.version} effective ${cs.effective}.</div>
    <div class="defn"><b>"Collected Platform Fee"</b> means the Platform Fee actually charged to and collected from Referred Customers on Chargeable AUM in the relevant period.</div>
    <div class="defn"><b>"Net Retained Brokerage"</b> means the brokerage charged to Referred Customers less all exchange, clearing, settlement, regulatory and executing-broker charges passed through to third parties — that is, the brokerage Valura actually retains.</div>
    <div class="defn"><b>"Net Placement Income"</b> means the placement, structuring or distribution fee actually received and retained by Valura from an issuer, product sponsor or fund manager in respect of a primary placement, net of any amount passed through to a third party.</div>
    <div class="defn"><b>"Partner Code"</b> means the unique alphanumeric identifier issued by Valura to the Partner${p.partnerCode ? `, being ${v(p.partnerCode, 'partner_code')}` : ''}, used to attribute Referred Customers and, in the case of an Anchor Partner, Sub-Partners to the Partner's network.</div>
    <div class="defn"><b>"Placement Fee"</b> means the one-time fee payable to the Partner on each successful subscription by a Referred Customer to a structured product, pre-IPO offering, private fund or similar primary placement, calculated as a share of Net Placement Income under Schedule A.2.</div>
    <div class="defn"><b>"Platform Fee"</b> means the annual fee charged by Valura to its customers on assets held with Valura under the Client Fee Schedule, currently ${VLR.fmt.pct(cs.platformFeePct)} per annum on Chargeable AUM.</div>
    <div class="defn"><b>"Referred Customer"</b> means any individual or entity who (i) opens an account on the Valura platform using the Partner Code or a tracked partner link, and (ii) is accepted as a customer by Valura following its onboarding and compliance checks.</div>
    <div class="defn"><b>"Recurring Fee"</b> means the compensation payable to the Partner under Clause 5.1(a), being a defined share of Collected Platform Fee and of Net Retained Brokerage.</div>
    <div class="defn"><b>"Sub-Partner"</b> means a partner recruited and sponsored by an Anchor Partner under Schedule B, who executes this Agreement directly with Valura and whose Referred Customers are tracked under the Anchor Partner's network for Override Fee calculation.</div>
    <div class="defn"><b>"Tail Period"</b> means the period after termination during which the Partner continues to receive Recurring Fees under Clause 10.4, as set out in Schedule A.3.</div>

    <h2 class="sec"><span class="no">§4</span>Scope of engagement</h2>
    <ol>
      <li>The Partner is appointed as a non-exclusive partner of Valura for the purpose of introducing qualified prospective customers to the Valura platform.</li>
      <li>The Partner shall use commercially reasonable efforts to identify, refer and assist Referred Customers in the onboarding process, in accordance with applicable law and Valura's published guidelines.</li>
      <li>Nothing in this Agreement constitutes the Partner as an employee, agent, distributor, partner in the legal sense, or joint venturer of Valura. The Partner shall not hold itself out as having authority to bind Valura.</li>
      <li>The Partner shall not provide investment advice, manage client funds, or conduct any regulated activity on behalf of Valura. The Partner's role is strictly limited to introductions.</li>
      <li>Valura retains sole and absolute discretion over the acceptance, rejection, suspension or termination of any customer, and over the products and services offered on its platform.</li>
    </ol>
    ${VLR.Doc.foot(p, d.ent.legalName, `§1–§4 · Parties, definitions, scope`)}
  </section>`);

  /* -- COMPENSATION --------------------------------------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.eyebrow('Compensation')}

    <h2 class="sec"><span class="no">§5</span>Compensation</h2>
    <h3 class="sub">5.1 Base compensation</h3>
    <p>In consideration of the Partner's services, Valura shall pay the Partner:</p>
    <ol type="a">
      <li><b>A Recurring Fee</b>, comprising (i) ${v(VLR.fmt.pct(d.platformSharePct, 0), 'platform_fee_share')} of the Collected Platform Fee on the Partner's Referred Customers, and (ii) ${v(VLR.fmt.pct(d.brokerageSharePct, 0), 'brokerage_share')} of Net Retained Brokerage on their executed trades, in each case at the rates set out in Schedule A.1, calculated daily and settled quarterly in arrears.</li>
      <li><b>A Placement Fee</b> on each primary placement subscribed to by a Referred Customer, being ${v(VLR.fmt.pct(d.placementSharePct, 0), 'placement_share_table')} of Valura's Net Placement Income on that deal, subject to the ceilings in Schedule A.2, paid within thirty (30) days of placement settlement.</li>
      <li><b>Published incentives</b> as set out in Schedule C, reference ${v(C.incentiveGrid.ref, 'incentive_grid_ref')}.</li>
    </ol>

    <div class="callout"><b>Compensation is a share of what Valura collects, not a fixed rate.</b>
      The Partner's entitlement is expressed as a percentage of Collected Platform Fee, Net Retained Brokerage and Net Placement Income. If Valura changes its published pricing, the Partner's percentage is unaffected and the rupee amount moves with the revenue. No amount is payable in respect of AUM on which Valura collects nothing — including GIFT City-domiciled and external funds, which are exempt from the Platform Fee under the Client Fee Schedule.</div>

    <h3 class="sub">5.1.1 Performance incentives</h3>
    <p>Performance incentives are those published in <b>Schedule C</b>, which forms part of this Agreement. Schedule C is a standard published grid applying uniformly to all partners at the relevant tier. Valura may amend Schedule C prospectively on thirty (30) days' written notice; amounts already accrued are unaffected. <b>No separate incentive addendum is contemplated, offered or required, and neither Party is under any obligation to negotiate one.</b></p>

    ${isAnchor ? `<h3 class="sub">5.2 Anchor Partner override</h3>
    <p>The Partner, having been designated an Anchor Partner under Clause 7, shall in addition to the Base Compensation in Clause 5.1 (which continues to apply to the Anchor Partner's own directly Referred Customers) be entitled to:</p>
    <ol type="a">
      <li>an <b>Override Fee</b> equal to ${v(VLR.fmt.pct(d.overridePct, 0), 'override_pct')} of the amounts payable to each sponsored Sub-Partner under Schedule A in respect of that Sub-Partner's Referred-Customer AUM and brokerage activity, calculated daily and paid quarterly in arrears;</li>
      <li>a <b>Placement Override</b> equal to ${v(VLR.fmt.pct(d.overridePct, 0), 'override_pct')} of the Placement Fee payable to each sponsored Sub-Partner, paid within thirty (30) days of placement settlement.</li>
    </ol>
    <p class="fine">For the avoidance of doubt, every amount under this Clause 5.2 is paid out of Valura's own share of the customer fees. It does not reduce, and is not deducted from, any compensation payable to any Sub-Partner under Schedule A. Sub-Partners receive their full entitlement regardless of whether they are sponsored.</p>`
    : `<h3 class="sub">5.2 Anchor Partner override</h3>
    <p>Not applicable at the ${d.t.label} tier. A Partner who satisfies the criteria in Clause 7 may be elevated to Anchor Partner status, at which point Schedule B applies.</p>`}

    <h3 class="sub">5.3 Calculation, reporting and payment</h3>
    <ol>
      <li>All amounts are calculated and paid in United States Dollars (USD) by electronic transfer to a USD-denominated bank account nominated by the Partner in writing. Where the Partner cannot receive USD directly, amounts may be converted at the prevailing telegraphic-transfer rate on the date of payment, with conversion costs and FX spread borne by the Partner.</li>
      <li>Valura shall provide the Partner with a quarterly statement <b>within ${ops.statementDueBusinessDays} business days of each calendar quarter-end</b>, setting out Chargeable AUM, brokerage, placements, the calculation of each component and the amount payable.</li>
      <li>All amounts are exclusive of Goods and Services Tax and other applicable indirect taxes, which are added at the applicable rate. The Partner shall raise a valid tax invoice before payment.</li>
      <li>Valura shall withhold tax at source at the applicable rate in accordance with prevailing law.</li>
      <li>Any dispute over the calculation of an amount shall be notified in writing within ${ops.disputeWindowDays} days of receipt of the relevant statement, failing which the statement is deemed accepted.</li>
      <li>Compensation in respect of any Referred Customer continues for so long as that customer remains active on the Valura platform, subject to Clause 10 and the Tail Period in Schedule A.3.</li>
    </ol>
    ${VLR.Doc.foot(p, d.ent.legalName, `§5 · Compensation`)}
  </section>`);

  /* -- ILLUSTRATIONS + ANCHOR QUALIFICATION ---------------------------- */
  const lad = VLR.Econ.ladder({ tierKey: p.tier, rotation: p.rotation, giftCityShare: p.giftCityShare,
    platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct });

  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.eyebrow('Illustrative earnings · anchor qualification')}

    <h2 class="sec"><span class="no">§6</span>Earnings — illustrative scenarios</h2>
    <p>The illustrations below show indicative annual recurring income at the ${d.t.label} tier, in United States Dollars. Actual earnings vary with portfolio mix, trading rotation, the proportion of assets held in fee-exempt funds, deal-specific placement economics under Schedule A.2, and applicable taxes. <b>These figures are projections, not a guarantee of compensation.</b></p>

    <h3 class="sub">6.1 Standalone recurring earnings</h3>
    ${VLR.Doc.ladderTable(p, { inr: true })}

    ${isAnchor ? `<h3 class="sub">6.2 Override on the sub-partner network</h3>
    <table class="dt">
      <thead><tr><th>Sub-partner network AUM</th><th class="num">Sub-partner earns</th><th class="num">Anchor override</th><th>Source</th></tr></thead>
      <tbody>${VLR.Econ.overrideLadder({ rotation: p.rotation, giftCityShare: p.giftCityShare, overridePct: d.overridePct })
        .map(r => `<tr>
          <td class="num" style="text-align:left">${VLR.fmt.usd(r.networkAum)}</td>
          <td class="num">${VLR.fmt.usd(r.detail.subPartnerEarns)}</td>
          <td class="num"><b>${VLR.fmt.usd(r.annual)}</b></td>
          <td>Paid out of Valura's share</td></tr>`).join('')}
      </tbody>
    </table>

    <h3 class="sub">6.3 Compounding — combined earnings</h3>
    <p>An Anchor Partner personally managing ${VLR.fmt.usd(10000000)} of Referred-Customer AUM, who also sponsors a network with combined AUM of ${VLR.fmt.usd(100000000)}, would earn approximately <b>${VLR.fmt.usd(VLR.Econ.recurring({ aum: 10000000, tierKey: 'ANCHOR', rotation: p.rotation, giftCityShare: p.giftCityShare, platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct }).partnerTotal)}</b> per annum on their own activity, plus <b>${VLR.fmt.usd(VLR.Econ.override({ networkAum: 100000000, rotation: p.rotation, giftCityShare: p.giftCityShare, overridePct: d.overridePct }).overrideTotal)}</b> per annum in override on the network — combined indicative recurring earnings of approximately <b>${VLR.fmt.usd(VLR.Econ.recurring({ aum: 10000000, tierKey: 'ANCHOR', rotation: p.rotation, giftCityShare: p.giftCityShare, platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct }).partnerTotal + VLR.Econ.override({ networkAum: 100000000, rotation: p.rotation, giftCityShare: p.giftCityShare, overridePct: d.overridePct }).overrideTotal)}</b> before placement income.</p>` : ''}

    <div class="callout"><b>These figures are generated, not typed.</b> Clause 6, the term sheet, the partner one-pager, the business plan and the quarterly statement are all produced by one calculation. They cannot disagree with one another.</div>

    <h2 class="sec"><span class="no">§7</span>Anchor Partner — qualification</h2>
    <p>A Partner may be elevated to Anchor Partner status on satisfying any one of the following, subject to written approval by Valura. All thresholds are stated in United States Dollars, consistent with the currency of every payment obligation under this Agreement.</p>
    <table class="dt">
      <thead><tr><th>Track</th><th>Threshold</th><th class="num">Sustained for</th></tr></thead>
      <tbody>
        <tr><td>A — Personal AUM</td><td>${VLR.fmt.usd(aq.personalAumUsd)} or more of directly attributable Referred-Customer AUM</td><td class="num">${aq.sustainedMonths} months</td></tr>
        <tr><td>B — Network</td><td>${aq.networkSubPartners} or more active Sub-Partners with combined Referred-Customer AUM of ${VLR.fmt.usd(aq.networkAumUsd)} or more</td><td class="num">${aq.sustainedMonths} months</td></tr>
        <tr><td>C — Strategic</td><td>By written designation of Valura, in recognition of strategic distribution capability or institutional reach</td><td class="num">—</td></tr>
      </tbody>
    </table>
    <p class="fine">${aq.fxNote} Valura monitors Tracks A and B continuously and will notify the Partner when a threshold has been sustained; the Partner is not required to apply.</p>

    <h3 class="sub">7.1 Anchor Partner obligations</h3>
    <ol>
      <li>The Anchor Partner acts as first point of contact, mentor and quality controller for their Sub-Partners.</li>
      <li>The Anchor Partner shall use reasonable efforts to assist Sub-Partners in understanding and adhering to this Agreement, applicable law and Valura's published guidelines.</li>
      <li>For the avoidance of doubt, the Anchor Partner bears no legal or financial liability, joint, several or otherwise, for the acts, omissions or conduct violations of any Sub-Partner. Valura's recourse for any such matter lies solely against the offending Sub-Partner.</li>
    </ol>
    ${VLR.Doc.foot(p, d.ent.legalName, `§6–§7 · Illustrations and Anchor qualification`)}
  </section>`);

  /* -- OBLIGATIONS / TERM / CONFIDENTIALITY ---------------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.eyebrow('Obligations · term · confidentiality')}

    <h2 class="sec"><span class="no">§8</span>Partner obligations</h2>
    <p>The Partner shall:</p>
    <ol>
      <li>Not represent itself as a registered investment adviser, distributor, broker or agent of Valura unless duly licensed, and shall restrict its activities to introductions only.</li>
      <li>Use only marketing materials and product information approved by Valura in writing, unaltered, and make no representation as to past performance, guaranteed returns or capital protection that is not expressly authorised.</li>
      <li>Maintain the confidentiality of all proprietary information, customer data and commercial terms in accordance with Clause 11.</li>
      <li>Disclose to prospective Referred Customers the existence and nature of the Partner's commercial relationship with Valura.</li>
      <li>Cooperate fully with Valura's compliance, audit and KYC processes.</li>
      <li>Not engage in any activity that is, or could reasonably be perceived as, fraudulent, manipulative, mis-selling, or otherwise contrary to the interests of Valura, its customers or the financial system.</li>
      <li><b>Referral disclosure.</b> The Partner shall introduce customers only through a tracked link or Partner Code issued by Valura, so that the remuneration payable to the Partner is disclosed to the customer at onboarding as required by clause 18(a) of the IFSCA <i>Regulatory Framework for Global Access in the IFSC</i>. The Partner shall not solicit or accept an account opening that circumvents this disclosure, and shall not make any statement to a customer about the Partner's remuneration that is inconsistent with the disclosure rendered by Valura.</li>
      <li>Ensure that every individual acting for the Partner in relation to Valura customers has completed Valura's certification programme and holds a current certificate.</li>
    </ol>

    <h2 class="sec"><span class="no">§9</span>Valura's obligations</h2>
    <ol>
      <li>Issue the Partner a unique Partner Code and provide marketing materials, product information and training as reasonably required.</li>
      <li>Onboard Referred Customers in a timely manner, subject to satisfactory KYC, AML and suitability checks.</li>
      <li>Calculate, report and pay the Partner's compensation accurately and on time under Clause 5.</li>
      <li>Provide the Partner with access to a partner dashboard giving visibility on Referred Customers, AUM and earnings.</li>
      <li>Maintain at all times such regulatory permissions, licences and registrations as are required to operate the Valura platform.</li>
      <li>Render the referral disclosure required by clause 18(a) of the global access framework accurately from the Partner's commercial terms, and notify the Partner before any change to it.</li>
    </ol>

    <h2 class="sec"><span class="no">§10</span>Term and termination</h2>
    <ol>
      <li>This Agreement takes effect on the Effective Date and continues until terminated under this Clause.</li>
      <li>Either Party may terminate for convenience on not less than ${ops.noticeDays} days' prior written notice.</li>
      <li>Either Party may terminate immediately by written notice if the other (i) commits a material breach not cured within ${ops.cureDays} days of written notice; (ii) becomes insolvent, enters liquidation or has a receiver appointed; or (iii) is convicted of, or admits to, fraud, misrepresentation or financial misconduct.</li>
      <li>On termination: (i) the Partner shall immediately cease using the Valura name, marks, marketing materials and Partner Code, and the licence in Schedule D terminates automatically; (ii) confidentiality obligations survive; (iii) Valura shall pay compensation accrued up to the date of termination; and (iv) the Partner shall continue to receive Recurring Fees on Referred Customers who remain active on the platform ${tailClause}. This entitlement ceases immediately on termination for cause under sub-clause 3(iii), and ends in respect of any customer on that customer's voluntary account closure.</li>
    </ol>
    <div class="callout"><b>Tail Period — ${d.tailLabel}.</b> The tail is set by tier under Schedule A.3: ${C.tiers.STARTER.tailMonths} months at Starter, ${C.tiers.GROWTH.tailMonths} months at Growth, perpetual at Anchor only. A perpetual tail granted to every partner would be an uncapped annuity on the book, including for partners who churn in month two.</div>

    <h2 class="sec"><span class="no">§11</span>Confidentiality</h2>
    <ol>
      <li>Each Party shall keep confidential all non-public information of the other, including business plans, customer information, commercial terms, technology and product roadmaps.</li>
      <li>Confidential information shall not be disclosed to any third party except (i) to professional advisers under a duty of confidence, (ii) as required by law or a regulator, or (iii) with the prior written consent of the disclosing Party.</li>
      <li>Client and customer data shared by the Partner with Valura may not be used by Valura, following termination, for direct marketing, cross-selling or independent relationship development targeting those clients. Valura's operational and contractual relationship with customers on its platform continues unaffected. This restriction survives in perpetuity.</li>
      <li>The restriction in sub-clause 3 does not apply to: KYC verification and ongoing due diligence; AML, counter-terrorist-financing and sanctions screening; statutory or regulatory reporting; responses to lawful regulatory, judicial or law-enforcement requests; operational and contractual obligations owed to the customer; detection and prevention of fraud, security incidents or market abuse; and any other use required or expressly permitted by applicable law.</li>
      <li>This obligation survives termination for ${ops.confidentialitySurvivalYears} years, save for sub-clause 3, which survives in perpetuity.</li>
    </ol>
    ${VLR.Doc.foot(p, d.ent.legalName, `§8–§11 · Obligations, term, confidentiality`)}
  </section>`);

  /* -- NON-SOLICIT / INDEMNITY / LAW / TM / DATA / MISC ---------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.eyebrow('Non-solicitation · indemnity · licence · data · law')}

    <h2 class="sec"><span class="no">§12</span>Non-exclusivity and non-solicitation</h2>
    <ol>
      <li>This Agreement is non-exclusive. Either Party may enter into similar agreements with third parties. Clause 12.1 governs the freedom of both Parties to work with other platforms and partners generally; Clause 12.2 governs conduct only in respect of clients already referred under this Agreement. The two operate independently.</li>
      <li>During the term and for ${ops.nonSolicitMonths} months thereafter, the Partner shall not directly or indirectly solicit any Referred Customer to transfer assets away from the Valura platform to a service that is directly and identically competitive with Valura's core offering and in which the Partner holds an equity stake or profit-sharing interest. Receipt of customary advisory or distribution fees from third parties does not, on its own, constitute such an interest. <b>Pre-Existing Clients</b> — persons or entities with whom the Partner had an advisory or business relationship before their introduction to Valura, as declared at intake — are carved out of this restriction entirely and may be freely advised, serviced and recommended any product at any time. As a mutual obligation, Valura shall not solicit any Referred Customer for the purpose of displacing the Partner's advisory relationship.</li>
    </ol>
    <p class="fine">The Pre-Existing Clients declaration is captured at intake and attached to this Agreement. After a dispute begins it is unprovable, which is why it is collected before one can arise.</p>

    <h2 class="sec"><span class="no">§13</span>Indemnity</h2>
    <ol>
      <li>The Partner shall indemnify Valura, its directors, officers, employees and affiliates against any claim, loss, liability, damage or expense arising out of the Partner's own wilful misconduct or fraud. This indemnity does not extend to any claim arising from the Valura platform, Valura's products, investment outcomes, market movements, or any act or omission of Valura, its affiliates or third parties.</li>
      <li>Valura shall indemnify the Partner on identical terms for Valura's own wilful misconduct, regulatory failures or fraudulent representations.</li>
      <li>Each Party's maximum aggregate liability shall not exceed the total compensation paid to the Partner under this Agreement in the ${ops.liabilityCapMonths} months preceding the event giving rise to the claim. This cap applies reciprocally.</li>
    </ol>

    <h2 class="sec"><span class="no">§14</span>Governing law and dispute resolution</h2>
    <ol>
      <li>This Agreement is governed by and construed in accordance with the laws of ${d.ent.governingLaw}.</li>
      <li>Any dispute shall be referred to and finally resolved by arbitration under ${d.ent.arbitration}. Each Party shall nominate one candidate and the two nominees shall agree the sole arbitrator; failing agreement within ${ops.cureDays} days, the appointment shall be made by the institution named above. The seat and venue shall be ${d.ent.seat} and the language English.</li>
      <li>Subject to the above, the courts at ${d.ent.seat} shall have exclusive jurisdiction.</li>
    </ol>

    <h2 class="sec"><span class="no">§15</span>Trademark and co-branding licence</h2>
    <ol>
      <li>Valura grants the Partner a limited, non-exclusive, non-transferable, revocable licence to use the Valura name and marks solely for the purpose of performing under this Agreement, on the terms set out in <b>Schedule D</b>.</li>
      <li>The Partner grants Valura a reciprocal limited, non-exclusive, revocable licence to use the Partner's name, mark and brand assets solely to produce co-branded collateral, the co-branded microsite and client-facing onboarding documents for the Partner.</li>
      <li>All artwork bearing either Party's mark shall be approved in writing by the mark owner before use. Neither Party may alter, recolour, distort or re-typeset the other's mark.</li>
      <li>Neither licence may be sub-licensed. An Anchor Partner may not extend the Valura licence to a Sub-Partner; each Sub-Partner receives its own licence directly from Valura on execution of its own agreement.</li>
      <li>Both licences terminate automatically on termination of this Agreement. The Partner shall within ten (10) business days cease all use of the Valura marks, take down co-branded materials under its control, and confirm in writing that it has done so.</li>
    </ol>

    <h2 class="sec"><span class="no">§16</span>Data protection</h2>
    <ol>
      <li>Each Party shall comply with all applicable data-protection law in respect of personal data processed under this Agreement, including the Digital Personal Data Protection Act, 2023 where applicable.</li>
      <li>The Parties shall execute Valura's standard <b>Client Data Addendum</b>, which sets out the roles of the Parties, the categories of data, the purposes and duration of processing, security measures, breach notification timelines, sub-processing, and the treatment of data on termination. The Addendum forms part of this Agreement.</li>
      <li>The Partner shall not transmit client personal data to Valura by any channel other than those Valura designates, and shall not include client personal data in any URL, query string or unsecured message.</li>
      <li>Each Party shall notify the other without undue delay, and in any event within seventy-two (72) hours, of becoming aware of a personal-data breach affecting data processed under this Agreement.</li>
    </ol>

    <h2 class="sec"><span class="no">§17</span>Miscellaneous</h2>
    <ol>
      <li><b>Entire agreement</b> — this Agreement together with its Schedules constitutes the entire agreement between the Parties and supersedes all prior agreements, representations and understandings.</li>
      <li><b>Amendment</b> — no amendment is effective unless in writing and signed by both Parties, save that Valura may amend its published guidelines, dashboards, operational processes and Schedule C on ${ops.noticeDays} days' written notice.</li>
      <li><b>Assignment</b> — the Partner shall not assign without Valura's prior written consent; Valura may assign to an affiliate or in connection with a corporate restructuring.</li>
      <li><b>Notices</b> — all notices shall be in writing, sent by email and registered post, to ${v(p.signatoryEmail || p.businessEmail, 'notice_email')} for the Partner and ${d.ent.notice} for Valura.</li>
      <li><b>Severability</b> — if any provision is held unenforceable the remainder continues in full force.</li>
      <li><b>Counterparts</b> — this Agreement may be executed in counterparts, including by electronic signature, each of which is deemed an original.</li>
    </ol>
    ${VLR.Doc.foot(p, d.ent.legalName, `§12–§17 · Non-solicit, licence, data, law`)}
  </section>`);

  /* -- EXECUTION ------------------------------------------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.eyebrow('Execution')}
    <h2 class="sec"><span class="no">§18</span>Execution</h2>
    ${o.esign ? `
    <p>IN WITNESS WHEREOF, the Parties have executed this Agreement on the Effective Date, by electronic signature on the execution page at the end of this document, which forms one instrument with it.</p>
    <div class="callout">This copy is issued for electronic signature. The signature blocks appear once, on the final page, after Schedule${isAnchor ? 's A–D' : 's A, C and D'} — so that what is signed is the complete instrument including its schedules.</div>`
    : `
    <p>IN WITNESS WHEREOF, the Parties have executed this Agreement on the Effective Date.</p>
    <div class="sign-grid">
      <div class="sign-box">
        <div class="who">For and on behalf of<br>${VLR.fmt.esc(d.ent.legalName)}</div>
        <div class="line"></div>
        <div class="f">Authorised signatory<br>
          Name: ${VLR.fmt.esc(d.ent.signatory.name)}<br>
          Title: ${VLR.fmt.esc(d.ent.signatory.title)}<br>
          Date: ______________________</div>
      </div>
      <div class="sign-box">
        <div class="who">For and on behalf of<br>${v(p.legalName, 'partner_legal_name')}</div>
        <div class="line"></div>
        <div class="f">Authorised signatory<br>
          Name: ${v(p.signatoryName, 'signatory_name')}<br>
          Title: ${v(p.signatoryTitle, 'signatory_title')}<br>
          Date: ______________________</div>
      </div>
    </div>`}

    <h2 class="sec" style="margin-top:40px"><span class="no">§19</span>Schedule of deviations from the standard template</h2>
    ${nonStd.length ? `<table class="dt">
      <thead><tr><th>Clause</th><th>Deviation</th><th class="num">Approvals</th></tr></thead>
      <tbody>${nonStd.map(n => `<tr>
        <td>${VLR.fmt.esc(n.clause)}</td><td>${VLR.fmt.esc(n.text)}</td>
        <td class="num">${(n.approvals || []).length} of 2</td></tr>`).join('')}</tbody>
    </table>
    <div class="callout stop"><b>This Agreement may not be issued for signature</b> until every deviation above carries two recorded approvals in the Hub.</div>`
    : `<p>None. This Agreement is the unmodified ${C.ops.templateVersion} template with only the defined variable fields populated:</p>
    <p class="fine mono">partner_legal_name · partner_registered_address · partner_cin · signatory_name · signatory_title · effective_date · tier · platform_fee_share · brokerage_share · placement_share_table · override_pct · tail_months · incentive_grid_ref · contracting_entity · notice_email · partner_code · anchor_partner_code</p>`}

    <div class="callout" style="margin-top:22px"><b>Attached and forming part of this Agreement:</b>
      Schedule A — Compensation sheet · ${isAnchor ? 'Schedule B — Anchor override structure · ' : ''}Schedule C — Published incentive grid (${C.incentiveGrid.ref}) · Schedule D — Trademark and co-branding licence · Client Data Addendum · Pre-Existing Clients declaration.</div>
    ${VLR.Doc.foot(p, d.ent.legalName, `§18–§19 · Execution and deviations`)}
  </section>`);

  /* -- SCHEDULE A ------------------------------------------------------ */
  const r1 = VLR.Econ.recurring({ aum: 1000000, tierKey: p.tier, rotation: p.rotation,
    giftCityShare: p.giftCityShare, platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct });

  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.band(p, {
      label: 'Schedule A', cobrand: false,
      title: `Compensation sheet — <em>${d.t.label}</em>`,
      stand: `Every rate below is a share of revenue Valura actually collects. All amounts are gross of GST and withholding tax. Compensation is paid quarterly in arrears by electronic transfer in USD.`,
      meta: [['Tier', d.t.label], ['Effective', VLR.fmt.date(p.effectiveDate)], ['Partner code', p.partnerCode || 'On KYB approval']]
    })}

    <h2 class="sec"><span class="no">A.1</span>Recurring fee</h2>
    <table class="dt">
      <thead><tr><th>Component</th><th class="num">Partner share</th><th class="num">Client pays</th><th class="num">Effective to partner</th><th>Basis</th></tr></thead>
      <tbody>
        <tr><td>Share of Collected Platform Fee on Chargeable AUM</td>
            <td class="num">${VLR.fmt.pct(d.platformSharePct, 0)}</td>
            <td class="num">${VLR.fmt.pct(cs.platformFeePct)} p.a.</td>
            <td class="num"><b>${VLR.fmt.pct(d.platformSharePct * cs.platformFeePct)} p.a.</b></td>
            <td>Daily-averaged, quarterly settlement</td></tr>
        <tr><td>Share of Net Retained Brokerage on executed trades</td>
            <td class="num">${VLR.fmt.pct(d.brokerageSharePct, 0)}</td>
            <td class="num">${VLR.fmt.pct(cs.grossBrokeragePct)} gross</td>
            <td class="num"><b>${VLR.fmt.pct(d.brokerageSharePct * cs.netBrokerageRetainedPct)} of traded value</b></td>
            <td>Per executed trade, quarterly settlement</td></tr>
      </tbody>
    </table>
    <p class="fine">Net Retained Brokerage is the brokerage Valura keeps after exchange, clearing and executing-broker pass-through — typically ${VLR.fmt.pct(cs.netBrokerageRetainedPct)} of traded value out of ${VLR.fmt.pct(cs.grossBrokeragePct)} gross. Both components apply uniformly across equities, ETFs, bonds, mutual funds, structured products and alternatives.</p>

    <div class="callout"><b>Fee-exempt assets.</b> GIFT City-domiciled funds and external funds are exempt from the Platform Fee under the Client Fee Schedule ${cs.version}. They are excluded from Chargeable AUM and no platform-fee share arises on them. Brokerage-linked compensation is unaffected where a trade is executed and brokerage is retained.</div>

    <h3 class="sub">Worked example — ${VLR.fmt.usd(1000000)} of Referred-Customer AUM</h3>
    <table class="dt">
      <tbody>
        <tr><td>Referred-Customer AUM</td><td class="num">${VLR.fmt.usd(r1.inputs.aum)}</td></tr>
        <tr><td>Less fee-exempt assets at ${VLR.fmt.pct(p.giftCityShare, 0)}</td><td class="num">− ${VLR.fmt.usd(r1.exemptAum)}</td></tr>
        <tr><td>Chargeable AUM</td><td class="num">${VLR.fmt.usd(r1.chargeableAum)}</td></tr>
        <tr><td>Platform fee collected at ${VLR.fmt.pct(cs.platformFeePct)}</td><td class="num">${VLR.fmt.usd(r1.platformFeeCollected)}</td></tr>
        <tr class="hl"><td>Partner share at ${VLR.fmt.pct(d.platformSharePct, 0)}</td><td class="num">${VLR.fmt.usd(r1.platformToPartner)}</td></tr>
        <tr><td>Traded value at ${VLR.fmt.pct(p.rotation, 0)} rotation</td><td class="num">${VLR.fmt.usd(r1.tradedValue)}</td></tr>
        <tr><td>Net brokerage retained at ${VLR.fmt.pct(cs.netBrokerageRetainedPct)}</td><td class="num">${VLR.fmt.usd(r1.netRetained)}</td></tr>
        <tr class="hl"><td>Partner share at ${VLR.fmt.pct(d.brokerageSharePct, 0)}</td><td class="num">${VLR.fmt.usd(r1.brokerageToPartner)}</td></tr>
        <tr class="tot"><td>Partner annual recurring</td><td class="num">${VLR.fmt.usd(r1.partnerTotal)} · ${VLR.fmt.inr(r1.partnerTotal * ops.fxUsdInr)}</td></tr>
        <tr class="tot"><td>Valura retains</td><td class="num">${VLR.fmt.usd(r1.valuraTotal)} — margin ${VLR.fmt.pct(r1.valuraMarginPct, 0)}</td></tr>
      </tbody>
    </table>

    <h2 class="sec"><span class="no">A.2</span>Placement fee on primary subscriptions</h2>
    ${VLR.Doc.placementTable(p)}

    <h2 class="sec"><span class="no">A.3</span>Settlement and tail</h2>
    <ol>
      <li>Recurring Fees are paid by the ${ops.statementDueBusinessDays}th business day following each calendar quarter-end, against the statement issued under Clause 5.3.2.</li>
      <li>Placement Fees are paid within thirty (30) days of placement settlement.</li>
      <li><b>Tail Period — ${d.tailLabel}.</b> On termination other than for cause, the Partner continues to receive Recurring Fees on Referred Customers who remain active${d.tailMonths == null ? ', without time limitation, until each such customer voluntarily closes their account' : ` for ${d.tailMonths} months from the date of termination, or until each such customer voluntarily closes their account if earlier`}. The tail by tier is: Starter ${C.tiers.STARTER.tailMonths} months · Growth ${C.tiers.GROWTH.tailMonths} months · Anchor perpetual.</li>
      <li>All payments are subject to withholding tax, and the Partner shall raise a valid GST invoice before payment where applicable.</li>
    </ol>
    ${VLR.Doc.foot(p, d.ent.legalName, `Schedule A · ${C.ops.templateVersion}`)}
  </section>`);

  /* -- SCHEDULE B (Anchor only) ---------------------------------------- */
  if (isAnchor) {
    pages.push(`
    <section class="pg a4">
      ${VLR.Doc.band(p, { label: 'Schedule B', cobrand: false,
        title: `Anchor Partner — <em>override structure</em>`,
        stand: `Additional compensation payable to a Partner designated as an Anchor Partner under Clause 7. Every amount in this Schedule is paid out of Valura's own share of the customer fees.`,
        meta: [['Override', VLR.fmt.pct(d.overridePct, 0)], ['Tail', 'Perpetual'], ['Seats', String(d.portalSeats)]] })}

      <h2 class="sec"><span class="no">B.1</span>Qualification criteria</h2>
      <table class="dt">
        <thead><tr><th>Track</th><th>Threshold</th><th class="num">Sustained</th></tr></thead>
        <tbody>
          <tr><td>A — Personal AUM</td><td>≥ ${VLR.fmt.usd(aq.personalAumUsd)} directly attributable AUM</td><td class="num">${aq.sustainedMonths} months</td></tr>
          <tr><td>B — Network</td><td>≥ ${aq.networkSubPartners} active Sub-Partners with combined ≥ ${VLR.fmt.usd(aq.networkAumUsd)} AUM</td><td class="num">${aq.sustainedMonths} months</td></tr>
          <tr><td>C — Strategic</td><td>By written designation of Valura</td><td class="num">—</td></tr>
        </tbody>
      </table>
      <p class="fine">${aq.fxNote} The Hub monitors Tracks A and B daily and raises an upgrade flag automatically once a threshold has been sustained for the full period. The Partner is not required to ask.</p>

      <h2 class="sec"><span class="no">B.2</span>Override compensation</h2>
      <table class="dt">
        <thead><tr><th>Component</th><th class="num">Rate</th><th>Basis</th><th>Paid from</th></tr></thead>
        <tbody>
          <tr><td>Recurring override on Sub-Partner AUM and brokerage</td><td class="num">${VLR.fmt.pct(d.overridePct, 0)} of Schedule A</td><td>Daily-averaged, quarterly</td><td>Valura's share</td></tr>
          <tr><td>Placement override on Sub-Partner placements</td><td class="num">${VLR.fmt.pct(d.overridePct, 0)} of Schedule A</td><td>One-time, at settlement</td><td>Valura's share</td></tr>
        </tbody>
      </table>
      <div class="callout"><b>The override never touches the Sub-Partner.</b> It is calculated as ${VLR.fmt.pct(d.overridePct, 0)} of the amounts payable to the Sub-Partner under Schedule A and paid by Valura out of its own share. Sub-Partners receive their full compensation whether or not they are sponsored.</div>

      <h3 class="sub">Margin check at network scale</h3>
      <table class="dt">
        <thead><tr><th>Network AUM</th><th class="num">Sub-partner earns</th><th class="num">Anchor override</th><th class="num">Valura retains</th></tr></thead>
        <tbody>${VLR.Econ.overrideLadder({ rotation: p.rotation, giftCityShare: p.giftCityShare, overridePct: d.overridePct })
          .map(r => `<tr><td class="num" style="text-align:left">${VLR.fmt.usd(r.networkAum)}</td>
            <td class="num">${VLR.fmt.usd(r.detail.subPartnerEarns)}</td>
            <td class="num">${VLR.fmt.usd(r.annual)}</td>
            <td class="num ${r.detail.erodesValuraMargin ? 'down' : ''}"><b>${VLR.fmt.usd(r.detail.valuraRetainsAfterOverride)}</b></td></tr>`).join('')}
        </tbody>
      </table>
      <p class="fine">Valura's retained amount stays positive at every level because the override is a share of the Sub-Partner's entitlement, which is itself a share of collected revenue.</p>

      <h2 class="sec"><span class="no">B.3</span>Sub-Partner recruitment and sponsorship</h2>
      <ol>
        <li>The Anchor Partner may propose new Sub-Partners to Valura for onboarding. Each proposed Sub-Partner must execute the standard Partner Agreement directly with Valura.</li>
        <li>Valura retains sole discretion over the acceptance of any proposed Sub-Partner.</li>
        <li>Once accepted, the Sub-Partner is tracked under the Anchor Partner's network through Partner Code linkage. The linkage is recorded in the Hub, not encoded in the code string.</li>
        <li>A Sub-Partner who satisfies Clause 7 in their own right may be elevated to Anchor Partner status. The original Anchor Partner's override on that former Sub-Partner continues at the full agreed rate, without reduction or tail limitation, in recognition of the original sponsorship.</li>
        <li>The Anchor Partner may not sub-licence the Valura marks to a Sub-Partner. Each Sub-Partner receives its own licence under Schedule D of its own agreement.</li>
      </ol>
      ${VLR.Doc.foot(p, d.ent.legalName, `Schedule B · ${C.ops.templateVersion}`)}
    </section>`);
  }

  /* -- SCHEDULE C + D --------------------------------------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: 'Schedules C and D', cobrand: false,
      title: `Published incentives, and <em>the licence to co-brand</em>`,
      stand: `Schedule C is a published grid, applied uniformly. There is no separate incentive negotiation. Schedule D is the trademark licence that makes co-branded collateral lawful — it is licensed, not gifted.`,
      meta: [['Grid ref', C.incentiveGrid.ref], ['Grid effective', C.incentiveGrid.effective], ['Licence', 'Limited · revocable']] })}

    <h2 class="sec"><span class="no">C.1</span>Incentive grid</h2>
    <table class="dt">
      <thead><tr><th>Milestone</th><th class="num">Bonus</th><th>Qualifying window</th></tr></thead>
      <tbody>${C.incentiveGrid.rows.map(r => `<tr>
        <td>${VLR.fmt.esc(r.milestone)}</td>
        <td class="num">${VLR.fmt.usd(r.bonusUsd)}</td>
        <td>${VLR.fmt.esc(r.window)}</td></tr>`).join('')}
      </tbody>
    </table>
    <p class="fine">Bonuses are paid with the quarterly settlement following the quarter in which the milestone is certified, are gross of withholding tax and GST, and are not payable where the Agreement has been terminated for cause. Milestones are measured on net new AUM sustained for the stated window, not on peak AUM. Valura may amend this grid prospectively on ${ops.noticeDays} days' written notice; accrued entitlements are unaffected.</p>
    <div class="callout"><b>Published, not negotiated.</b> This replaces the open-ended incentive addendum in earlier versions of the template. A partner either meets a published threshold or does not; there is no separate negotiation, and no obligation on either Party to open one.</div>

    <h2 class="sec"><span class="no">D.1</span>Grant of licence</h2>
    <ol>
      <li>Valura grants the Partner a limited, non-exclusive, non-transferable, revocable, royalty-free licence to use the Valura word mark and logo solely to identify itself as an introducing partner of Valura and to use approved co-branded materials.</li>
      <li>The Partner grants Valura a reciprocal licence to use the Partner's name, logo and brand assets solely to produce co-branded collateral, the co-branded microsite at <span class="mono">${d.micrositeUrl}</span>, co-branded client onboarding documents and the co-branded email identity for the Partner's named personnel.</li>
    </ol>

    <h2 class="sec"><span class="no">D.2</span>Conditions of use</h2>
    <ol>
      <li>All artwork bearing either mark shall be approved in writing by the owner of that mark before publication or printing.</li>
      <li>Neither Party may alter, recolour, distort, animate, re-typeset or add effects to the other's mark, or use it in a manner that implies endorsement of a third party, a joint venture, agency, or a guarantee of investment outcomes.</li>
      <li>The Partner's colours occupy the partner slot of the approved lockup only. They do not replace Valura's page background, typography or accent colour in any co-branded material.</li>
      <li>The Partner shall not register, or attempt to register, any mark, domain or handle incorporating "Valura" or a confusingly similar term.</li>
      <li>Neither licence may be sub-licensed, including by an Anchor Partner to a Sub-Partner.</li>
      <li>All goodwill arising from use of a mark accrues to its owner.</li>
    </ol>

    <h2 class="sec"><span class="no">D.3</span>Term and take-down</h2>
    <ol>
      <li>Each licence runs with this Agreement and terminates automatically on its termination or expiry, and may be revoked earlier by the mark owner on written notice for breach of D.2.</li>
      <li>On termination the Partner shall, within ten (10) business days: cease all use of the Valura marks; remove them from its website, social profiles, signage, email signatures and printed materials under its control; cease using the co-branded email identity and the microsite; and confirm compliance in writing.</li>
      <li>Valura shall within the same period unpublish the co-branded microsite, deactivate co-branded email identities, and cease using the Partner's mark in its own materials, save for records it is required to retain.</li>
      <li>The Partner Code is deactivated on termination. Referred Customers introduced before termination remain attributed to the Partner for the purpose of the Tail Period in Schedule A.3.</li>
    </ol>
    ${VLR.Doc.foot(p, d.ent.legalName, `Schedules C–D · ${C.ops.templateVersion}`)}
  </section>`);

  /* The e-sign copy carries its signature blocks once, on a fixed-geometry
     final page. Being last is what lets the Zoho field placement resolve to
     pageCount − 1 no matter how long the body runs.                         */
  if (o.esign) pages.push(VLR.Doc.executionSheet(p));

  return pages.join('');
};
