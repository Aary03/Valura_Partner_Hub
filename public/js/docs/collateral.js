/* ============================================================================
   THE COLLATERAL PACK
   ----------------------------------------------------------------------------
   Generated per partner from the brand kit. No manual design work per partner.
   The partner's colours occupy the partner slot of the lockup only — they
   never replace Valura's page background, ink or accent (Schedule D.2.3).
   ==========================================================================*/

window.VLR = window.VLR || {};
VLR.Doc = VLR.Doc || {};

/* -- Visiting cards, front and back, one pair per named person ------------ */
VLR.Doc.visitingCards = function (p) {
  const d = VLR.derive(p);
  const people = (p.people || []).filter(x => x.wantsCard && x.name);
  if (!people.length) {
    return `<div class="banner warn"><div><b>No cards requested yet.</b> Add people in the intake form and tick “needs a visiting card”. Each card carries variable data — name, title, mobile — against a fixed co-branded layout, so a hundred cards for ten people is one print file.</div></div>`;
  }
  return people.map(x => `
    <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:24px;align-items:flex-start">
      <div class="vcard front">
        <div style="position:relative;z-index:1">${VLR.Doc.lockup(p, { onInk: true, size: 16 })}</div>
        <div>
          <div class="nm" style="color:#fff">${VLR.fmt.esc(x.name)}</div>
          <div class="ttl" style="color:var(--brand-mid)">${VLR.fmt.esc(x.title || '')}</div>
        </div>
      </div>
      <div class="vcard back">
        <div class="ct">
          ${x.wantsEmailId ? VLR.fmt.esc(VLR.Doc.emailFor(p, x)) + '<br>' : (x.email ? VLR.fmt.esc(x.email) + '<br>' : '')}
          ${x.mobile ? VLR.fmt.esc(x.mobile) + '<br>' : ''}
          ${VLR.fmt.esc(d.micrositeUrl)}
        </div>
        <div>
          <div style="height:2px;width:28px;background:${VLR.fmt.esc(p.secondaryHex || '#02A24B')};margin-bottom:9px"></div>
          <div class="code" style="color:var(--text-muted)">Introducing partner · ${VLR.fmt.esc(p.partnerCode || 'code pending')}</div>
          <div class="code" style="color:var(--text-faint);margin-top:3px">${VLR.fmt.esc(d.ent.short)} · ${VLR.fmt.esc(d.ent.licence.replace('Broker Dealer · ', ''))}</div>
        </div>
      </div>
      <div style="flex:1;min-width:180px">
        <div class="lbl">Print spec</div>
        <table class="t" style="margin-top:8px;font-size:12px">
          <tbody>
            <tr><td>Quantity</td><td class="num">${x.cardQty || 100}</td></tr>
            <tr><td>Size</td><td class="num">89 × 54 mm</td></tr>
            <tr><td>Bleed</td><td class="num">3 mm</td></tr>
            <tr><td>Stock</td><td class="num">350 gsm soft-touch</td></tr>
            <tr><td>Finish</td><td class="num">Spot UV on mark</td></tr>
          </tbody>
        </table>
      </div>
    </div>`).join('');
};

/* -- Email signature block ------------------------------------------------ */
VLR.Doc.signatures = function (p) {
  const d = VLR.derive(p);
  const people = (p.people || []).filter(x => x.name);
  const list = people.length ? people : [{ name: p.signatoryName || 'Name', title: p.signatoryTitle || 'Title', mobile: p.signatoryMobile }];
  return list.map(x => `
    <div style="margin-bottom:22px">
      <div class="sig">
        <div style="margin-bottom:12px">${VLR.Doc.lockup(p, { onInk: false, size: 17 })}</div>
        <div class="nm">${VLR.fmt.esc(x.name)}</div>
        <div class="ttl">${VLR.fmt.esc(x.title || '')} · ${VLR.fmt.esc(d.displayName)}</div>
        <div class="ct">
          ${VLR.fmt.esc(x.wantsEmailId ? VLR.Doc.emailFor(p, x) : (x.email || ''))}<br>
          ${x.mobile ? VLR.fmt.esc(x.mobile) + '<br>' : ''}
          ${VLR.fmt.esc(d.micrositeUrl)}
        </div>
        <div class="disc">
          ${VLR.fmt.esc(d.displayName)} is an introducing partner of ${VLR.fmt.esc(d.ent.legalName)},
          ${VLR.fmt.esc(d.ent.licence)}. Partner code ${VLR.fmt.esc(p.partnerCode || 'pending')}.
          Introductions only — no investment advice is given and no client funds are handled.
          Remuneration for introductions is disclosed to each client at account opening.
        </div>
      </div>
      <button class="btn sm ghost no-print" style="margin-top:8px" data-copy-sig="${VLR.fmt.esc(x.name)}">Copy HTML</button>
    </div>`).join('');
};

/* -- Social kit ----------------------------------------------------------- */
VLR.Doc.socialKit = function (p) {
  const d = VLR.derive(p);
  const C = VLR.CONFIG;
  return `
  <div class="lbl" style="margin-bottom:10px">LinkedIn banner · 1584 × 396</div>
  <div class="tile banner ink" style="margin-bottom:26px">
    <div class="inner">
      ${VLR.Doc.lockup(p, { onInk: true, size: 17 })}
      <div>
        <h3>Global markets, through ${VLR.fmt.esc(d.displayName)}.</h3>
        <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:rgba(233,241,236,.55);margin-top:9px">
          Introducing partner · ${VLR.fmt.esc(p.partnerCode || 'code pending')} · ${VLR.fmt.esc(d.ent.licence.replace('Broker Dealer · ', ''))}
        </div>
      </div>
    </div>
  </div>

  <div style="display:flex;gap:24px;flex-wrap:wrap">
    <div>
      <div class="lbl" style="margin-bottom:10px">Launch tile · 1080 × 1080</div>
      <div class="tile sq ink">
        <div class="inner">
          ${VLR.Doc.lockup(p, { onInk: true, size: 18 })}
          <div>
            <div style="font-family:var(--font-mono);font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--brand-mid);margin-bottom:12px">Now live</div>
            <h3>One account for<br><em style="font-style:italic">global markets</em>.</h3>
            <div style="height:2px;width:28px;background:var(--brand);margin:16px 0 12px"></div>
            <div style="font-size:11px;color:rgba(233,241,236,.72);line-height:1.55">
              Equities, ETFs, UCITS, structured products and private markets — opened through ${VLR.fmt.esc(d.displayName)}, custodied and executed by Valura.
            </div>
          </div>
          <div style="font-family:var(--font-mono);font-size:7.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(233,241,236,.45)">
            ${VLR.fmt.esc(d.micrositeUrl)}
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="lbl" style="margin-bottom:10px">Story frame · 1080 × 1920</div>
      <div class="tile story ink">
        <div class="inner">
          ${VLR.Doc.lockup(p, { onInk: true, size: 15 })}
          <div>
            <h3>What you pay,<br><em style="font-style:italic">in full</em>.</h3>
            <div style="height:2px;width:24px;background:var(--brand);margin:14px 0 14px"></div>
            <table style="width:100%;border-collapse:collapse;font-family:var(--font-mono);font-size:9px;color:rgba(233,241,236,.8)">
              <tr><td style="padding:5px 0;border-bottom:1px solid rgba(255,255,255,.1)">Account opening</td><td style="text-align:right;color:var(--brand-mid)">$0</td></tr>
              <tr><td style="padding:5px 0;border-bottom:1px solid rgba(255,255,255,.1)">Annual maintenance</td><td style="text-align:right;color:var(--brand-mid)">$0</td></tr>
              <tr><td style="padding:5px 0;border-bottom:1px solid rgba(255,255,255,.1)">Market data</td><td style="text-align:right;color:var(--brand-mid)">$0</td></tr>
              <tr><td style="padding:5px 0;border-bottom:1px solid rgba(255,255,255,.1)">Platform fee</td><td style="text-align:right">${VLR.fmt.pct(C.clientSchedule.platformFeePct)} p.a.</td></tr>
              <tr><td style="padding:5px 0">Brokerage</td><td style="text-align:right">${VLR.fmt.pct(C.clientSchedule.grossBrokeragePct)}</td></tr>
            </table>
          </div>
          <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.1em;text-transform:uppercase;color:rgba(233,241,236,.4);line-height:1.5">
            GIFT City funds exempt from platform fee.<br>${VLR.fmt.esc(d.micrositeUrl)}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="callout warn" style="max-width:700px;margin-top:22px"><b>Before posting.</b> Approved artwork only, unaltered. No competitor named with figures unless the comparison is accurate, current and substantiable under the IFSCA advertisement code. No guaranteed return, capital protection or past-performance claim. Do not describe the pricing as "indicative" — that contradicts the clause 38(j) undertaking in the client fee schedule.</div>`;
};

/* -- Certificate of accreditation ----------------------------------------- */
VLR.Doc.certificate = function (p) {
  const d = VLR.derive(p);
  return `
  <div class="cert">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;position:relative;z-index:1">
      ${VLR.Doc.lockup(p, { onInk: false, size: 24 })}
      <div style="text-align:right">
        <div class="lbl">Certificate no.</div>
        <div style="font-family:var(--font-mono);font-size:12px;margin-top:5px">${VLR.fmt.esc(p.partnerCode || 'PENDING')}-CERT</div>
      </div>
    </div>

    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:1;max-width:74%">
      <div class="lbl">Certificate of accreditation</div>
      <div class="eyebrow-rule"></div>
      <div style="font-family:var(--font-display);font-size:58px;line-height:1.03;letter-spacing:-.02em;margin:22px 0 0">
        ${VLR.fmt.esc(d.displayName)}
      </div>
      <p style="font-size:13px;line-height:1.65;color:var(--text-body);margin:20px 0 0;max-width:60ch">
        is accredited as an <b>introducing partner</b> of ${VLR.fmt.esc(d.ent.legalName)},
        ${VLR.fmt.esc(d.ent.licence)}, at the <b>${VLR.fmt.esc(d.t.label)}</b> tier, having completed
        Valura's certification programme and satisfied its know-your-business requirements.
      </p>
      <p style="font-size:11px;color:var(--text-muted);margin:14px 0 0;max-width:64ch">
        This accreditation confirms training and onboarding only. It does not constitute a licence,
        registration or authority to advise, to handle client funds, or to act as agent of Valura.
      </p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:26px;position:relative;z-index:1;border-top:1px solid var(--rule);padding-top:16px">
      <div><div class="lbl">Partner code</div><div style="font-family:var(--font-mono);font-size:13px;margin-top:5px">${VLR.fmt.esc(p.partnerCode || '—')}</div></div>
      <div><div class="lbl">Certified</div><div style="font-family:var(--font-mono);font-size:13px;margin-top:5px">${p.certifiedAt ? VLR.fmt.date(p.certifiedAt) : '—'}</div></div>
      <div><div class="lbl">Exam score</div><div style="font-family:var(--font-mono);font-size:13px;margin-top:5px">${p.examScore != null ? p.examScore + '%' : '—'}</div></div>
      <div><div class="lbl">Valid until</div><div style="font-family:var(--font-mono);font-size:13px;margin-top:5px">${p.certifiedAt ? VLR.fmt.date(new Date(new Date(p.certifiedAt).setFullYear(new Date(p.certifiedAt).getFullYear() + 1))) : '—'}</div></div>
    </div>
    <div style="margin-top:20px;display:flex;justify-content:space-between;align-items:flex-end;position:relative;z-index:1">
      <div style="border-top:1px solid var(--rule-strong);padding-top:8px;width:240px">
        <div style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);line-height:1.8">
          ${VLR.fmt.esc(d.ent.signatory.name)}<br>${VLR.fmt.esc(d.ent.signatory.title)}, ${VLR.fmt.esc(d.ent.short)}</div>
      </div>
      <div class="lbl" style="font-size:8px">Recertification required annually</div>
    </div>
  </div>`;
};

/* -- Marketing guardrails card, two pages --------------------------------- */
VLR.Doc.guardrails = function (p) {
  const d = VLR.derive(p);
  return `
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: 'Marketing guardrails · keep this card', cobrand: true,
      title: `What you may say, and <em>what you may not</em>.`,
      stand: `Two pages. Re-tested at recertification. These are not Valura preferences — most of them are in the IFSCA advertisement code and in Clauses 4.4, 8.1 and 8.2 of your agreement.`,
      meta: [['Partner', d.displayName], ['Code', p.partnerCode || 'Pending'], ['Version', VLR.CONFIG.ops.templateVersion]] })}

    <div class="guard-col">
      <div>
        <div class="lbl">You may</div><div class="eyebrow-rule" style="margin-bottom:10px"></div>
        <ul class="may">
          <li>Introduce prospective clients to Valura through your tracked link or partner code.</li>
          <li>Use approved collateral, unchanged, on your own channels.</li>
          <li>Run approved campaigns on your own channels after the four-step approval loop.</li>
          <li>State the published fee schedule exactly as published.</li>
          <li>Describe products factually, from the approved fact sheets.</li>
          <li>Disclose your own remuneration — and you should, because your client sees it anyway at KYC.</li>
          <li>Say that Valura is registered with the IFSCA as a broker-dealer, quoting the registration number.</li>
        </ul>
      </div>
      <div>
        <div class="lbl">You may not</div><div class="eyebrow-rule" style="margin-bottom:10px;background:var(--down)"></div>
        <ul class="maynot">
          <li>Give investment advice or make recommendations. Valura India IFSC is execution-only (Clause 4.4).</li>
          <li>Handle, hold or route client funds.</li>
          <li>Represent yourself as registered, licensed, or as Valura's agent (Clause 8.1).</li>
          <li>State or imply guaranteed returns, capital protection, or use past performance as a promise (Clause 8.2).</li>
          <li>Alter approved artwork, re-typeset it, or write your own client-facing copy.</li>
          <li>Name a competitor with figures unless the comparison is accurate, current and substantiable.</li>
          <li>Describe the pricing as "indicative" — it contradicts the clause 38(j) undertaking.</li>
          <li>Use the Valura marks after termination (Clause 10.4(i) and Schedule D.3).</li>
          <li>Open an account for a client outside your tracked link, which would bypass the required disclosure.</li>
        </ul>
      </div>
    </div>

    <h2 class="sec"><span class="no">01</span>The approval loop — four steps, no shortcuts</h2>
    <table class="dt">
      <thead><tr><th class="num">Step</th><th>What happens</th><th>Owner</th></tr></thead>
      <tbody>
        <tr><td class="num">01</td><td>Valura creates the asset from the approved template</td><td>Valura design</td></tr>
        <tr><td class="num">02</td><td>You review and mark up — on the PDF, not verbally</td><td>${VLR.fmt.esc(p.marketingContact || 'Partner marketing')}</td></tr>
        <tr><td class="num">03</td><td>Confirmed on the weekly call, and the confirmation written into the Hub</td><td>Both</td></tr>
        <tr><td class="num">04</td><td>It goes out</td><td>Whoever owns the channel</td></tr>
      </tbody>
    </table>
    <div class="callout"><b>One accountable owner each side.</b> Nothing ships unapproved. The WhatsApp group is for speed; the Hub is the record. If a decision only exists in the group, it does not exist.</div>
    ${VLR.Doc.foot(p, d.ent.legalName, 'Guardrails · page 1 of 2')}
  </section>

  <section class="pg a4">
    ${VLR.Doc.eyebrow('The five sentences that cause trouble')}
    <table class="dt">
      <thead><tr><th style="width:44%">If you find yourself saying</th><th>Say this instead</th></tr></thead>
      <tbody>
        <tr><td>"You'll get around 12% on this."</td><td>"Here is what the product does and what it has done. Returns are not guaranteed and past performance is not a promise."</td></tr>
        <tr><td>"Your capital is protected."</td><td>"This is a structured product with a defined payoff. Here is the payoff, and here is what happens in each scenario, including the downside."</td></tr>
        <tr><td>"We're licensed by IFSCA."</td><td>"Valura is registered with IFSCA as a broker-dealer, registration number ${VLR.fmt.esc(VLR.CONFIG.entities.VALURA_INDIA_IFSC.licence.replace('Broker Dealer · Reg. No. ', ''))}. We introduce clients to Valura; we are not ourselves registered."</td></tr>
        <tr><td>"Their charges are lower than [competitor]'s 0.5%."</td><td>Either drop the comparison, or use a current, cited, substantiable figure. An out-of-date comparison breaches the advertisement code.</td></tr>
        <tr><td>"Pricing is indicative."</td><td>"These are the published charges. Valura undertakes not to collect anything not disclosed in the schedule."</td></tr>
      </tbody>
    </table>

    <h2 class="sec"><span class="no">02</span>What your client is told about you</h2>
    <p>Every client who onboards under your code sees your remuneration as a figure, at KYC time. Clause 18(a) of the IFSCA global access framework requires it. This is what it says:</p>
    <div style="border:1px solid var(--rule-strong);border-radius:var(--r-md);padding:16px 18px;background:var(--paper-2);font-size:10px;line-height:1.7">
      ${VLR.fmt.esc(VLR.Econ.disclosure({ ...p, platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct, placementSharePct: d.placementSharePct }).text)}
    </div>
    <p class="fine">Because the client sees this anyway, the strongest position is to say it first. A partner who volunteers their remuneration before being asked has a much easier conversation than one whose client discovers it at the KYC screen.</p>

    <h2 class="sec"><span class="no">03</span>Escalation</h2>
    <table class="dt">
      <tbody>
        <tr><td>Anything a client asks that you are unsure about</td><td>Your named partner manager, same day</td></tr>
        <tr><td>A complaint, in any form, from anyone</td><td>${VLR.fmt.esc(VLR.CONFIG.ops.complianceEmail)} within 24 hours — do not answer it yourself</td></tr>
        <tr><td>A regulator, a journalist or a bank contacting you about Valura</td><td>${VLR.fmt.esc(VLR.CONFIG.ops.complianceEmail)} before you reply</td></tr>
        <tr><td>Something you have already sent that you now think was wrong</td><td>Tell us immediately. A self-reported error is an operational issue; a discovered one is a conduct issue.</td></tr>
      </tbody>
    </table>
    ${VLR.Doc.foot(p, d.ent.legalName, 'Guardrails · page 2 of 2')}
  </section>`;
};

/* -- Co-branded microsite preview ----------------------------------------- */
VLR.Doc.microsite = function (p) {
  const d = VLR.derive(p);
  const C = VLR.CONFIG;
  const disc = VLR.Econ.disclosure({ ...p, platformSharePct: d.platformSharePct,
    brokerageSharePct: d.brokerageSharePct, placementSharePct: d.placementSharePct });
  return `
  ${!p.trademarkLicenceSigned ? `<div class="banner stop"><div><b>Cannot publish.</b> The Schedule D trademark and co-branding licence is not marked as signed on this partner record. Co-branded output using either party's mark requires it. Mark it signed in Setup once the executed agreement is on file.</div></div>` : ''}
  <div class="site">
    <div class="site-chrome">
      <div class="dots"><i></i><i></i><i></i></div>
      <div class="url">https://${VLR.fmt.esc(d.micrositeUrl)}</div>
    </div>
    <div class="site-hero">
      <div style="position:relative;z-index:1">
        ${VLR.Doc.lockup(p, { onInk: true, size: 20 })}
        <h1 style="font-family:var(--font-display);font-weight:400;font-size:44px;line-height:1.04;letter-spacing:-.02em;color:#fff;margin:28px 0 0;max-width:19ch">
          Global markets, opened through <em style="font-style:italic">${VLR.fmt.esc(d.displayName)}</em>.
        </h1>
        <p style="max-width:56ch;margin:16px 0 0;font-size:13px;line-height:1.65;color:rgba(233,241,236,.78)">
          Equities, ETFs, UCITS and mutual funds, structured products and private markets — in one account,
          custodied and executed by ${VLR.fmt.esc(d.ent.legalName)}, ${VLR.fmt.esc(d.ent.licence)}.
        </p>
        <div style="margin-top:24px;display:flex;gap:10px;align-items:center">
          <span style="display:inline-block;background:var(--brand);color:#fff;padding:11px 22px;border-radius:999px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase">Open an account</span>
          <span style="font-family:var(--font-mono);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:rgba(233,241,236,.5)">Partner code ${VLR.fmt.esc(p.partnerCode || 'pending')} — applied automatically</span>
        </div>
      </div>
    </div>
    <div style="padding:34px 52px 30px">
      <div style="display:grid;grid-template-columns:1fr 2.2fr;gap:34px">
        <div>
          <div class="lbl">What you pay</div><div class="eyebrow-rule"></div>
          <p style="font-size:12px;color:var(--text-body);margin-top:12px;line-height:1.6">
            The published schedule, in full. Valura undertakes to collect nothing that is not disclosed in it.
          </p>
        </div>
        <div>
          <table class="dt" style="margin:0">
            <tbody>
              <tr><td>Account opening, deposits, annual maintenance</td><td class="num" style="color:var(--brand)">$0</td></tr>
              <tr><td>Live market data, tax statements, reports</td><td class="num" style="color:var(--brand)">$0</td></tr>
              <tr><td>Platform fee on assets held</td><td class="num">${VLR.fmt.pct(C.clientSchedule.platformFeePct)} p.a.</td></tr>
              <tr><td>GIFT City-domiciled and external funds</td><td class="num" style="color:var(--brand)">Exempt</td></tr>
              <tr><td>Brokerage, equities and ETFs</td><td class="num">${VLR.fmt.pct(C.clientSchedule.grossBrokeragePct)} · min $${C.clientSchedule.brokerageMinUsd}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div style="margin-top:26px;border-top:1px solid var(--rule);padding-top:16px">
        <div class="lbl">Referral disclosure — shown again at account opening</div>
        <p style="font-size:10px;color:var(--text-muted);margin-top:9px;line-height:1.65;max-width:100ch">${VLR.fmt.esc(disc.text)}</p>
      </div>
      <div style="margin-top:18px;border-top:1px solid var(--rule);padding-top:14px;font-size:9px;color:var(--text-faint);line-height:1.6">
        ${VLR.fmt.esc(d.ent.legalName)} · ${VLR.fmt.esc(d.ent.licence)} · ${VLR.fmt.esc(d.ent.address)}.
        ${VLR.fmt.esc(d.displayName)} is an introducing partner and is not registered, licensed, or an agent of Valura.
        Investments are subject to market risk. This page is not investment advice and no suitability assessment is made.
      </div>
    </div>
  </div>`;
};

/* -- Launch invite + welcome-kit insert ----------------------------------- */
VLR.Doc.invite = function (p) {
  const d = VLR.derive(p);
  const cal = p.effectiveDate ? VLR.Cal.build(p) : { events: [] };
  const rt = cal.events.find(e => e.k === 'roundtable');
  return `
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: 'Launch roundtable · invitation', cobrand: true,
      title: `An evening on <em>investing outside India</em>.`,
      stand: `Twenty seats, no presentation deck for most of it. ${VLR.fmt.esc(d.displayName)} and Valura, in conversation with people who are already doing this.`,
      meta: [['Date', rt ? VLR.fmt.date(rt.date) : 'D+17'], ['Time', '6:30 pm'], ['Seats', '20'], ['Hosted by', d.displayName]] })}

    <div class="split" style="gap:30px">
      <div>
        ${VLR.Doc.eyebrow('The evening')}
        <table class="dt" style="margin-top:4px">
          <tbody>
            <tr><td class="num" style="width:60px">18:30</td><td>Arrival</td></tr>
            <tr><td class="num">19:00</td><td>Where your money and your assets actually sit — 20 minutes, Valura</td></tr>
            <tr><td class="num">19:25</td><td>What is on the menu beyond listed equities</td></tr>
            <tr><td class="num">19:45</td><td>Open questions — the part worth staying for</td></tr>
            <tr><td class="num">20:15</td><td>Dinner</td></tr>
          </tbody>
        </table>
      </div>
      <div>
        ${VLR.Doc.eyebrow('Why now')}
        <p class="lede">Access to global markets from India has changed. GIFT City makes it possible to hold global equities, funds and private-market allocations in one regulated account, with reporting that an Indian tax return can actually use.</p>
        <p>We will cover what that structure is, what it costs, and — candidly — what it is not suitable for. Valura is execution-only, so nobody in the room will be recommending anything to you.</p>
        <p class="fine">${VLR.fmt.esc(d.displayName)} is an introducing partner of ${VLR.fmt.esc(d.ent.legalName)}, ${VLR.fmt.esc(d.ent.licence)}, and is remunerated for introductions. The amount is disclosed to every client at account opening and does not increase what you pay. Nothing at this event is investment advice.</p>
      </div>
    </div>
    ${VLR.Doc.foot(p, d.displayName + ' · in association with Valura', 'Invitation · RSVP required')}
  </section>`;
};

VLR.Doc.kitInsert = function (p) {
  const d = VLR.derive(p);
  const cal = p.effectiveDate ? VLR.Cal.build(p) : { events: [] };
  const pick = k => { const e = cal.events.find(x => x.k === k); return e ? VLR.fmt.dateShort(e.date) : '—'; };
  return `
  <section class="pg auto" style="min-height:560px">
    ${VLR.Doc.band(p, { label: 'Welcome kit · insert card', cobrand: true,
      title: `Everything in this box, and <em>what it is for</em>.`,
      stand: `Your kit, your codes and your next four dates — on one card, so it does not live in an email thread.`,
      meta: [['Partner code', p.partnerCode || 'Pending'], ['Tier', d.t.label], ['Your owner', VLR.CONFIG.team.BD.name]] })}
    <div class="split" style="gap:28px">
      <div>
        ${VLR.Doc.eyebrow('In the box')}
        <ul style="font-size:10px;line-height:1.7;padding-left:16px">
          <li>Certificate of accreditation</li>
          <li>Marketing guardrails card — read this one</li>
          <li>Visiting cards</li>
          <li>Brochure and segment one-pager</li>
          <li>Diary, calendar and pen</li>
        </ul>
      </div>
      <div>
        ${VLR.Doc.eyebrow('Your next four dates')}
        <table class="dt" style="margin-top:4px">
          <tbody>
            <tr><td>Training opens</td><td class="num">${pick('training')}</td></tr>
            <tr><td>Certification and business plan</td><td class="num">${pick('exam')}</td></tr>
            <tr><td>Launch campaign begins</td><td class="num">${pick('launch_ann')}</td></tr>
            <tr><td>First funded ticket · 30-day review</td><td class="num">${pick('funded')}</td></tr>
          </tbody>
        </table>
        <p class="fine">The full calendar is a live feed in your portal. If a date moves, the feed moves with it.</p>
      </div>
    </div>
  </section>`;
};

/* -- Co-branded client onboarding wrapper --------------------------------- */
VLR.Doc.onboardingWrapper = function (p) {
  const d = VLR.derive(p);
  const disc = VLR.Econ.disclosure({ ...p, platformSharePct: d.platformSharePct,
    brokerageSharePct: d.brokerageSharePct, placementSharePct: d.placementSharePct });
  return `
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: 'Client onboarding pack · cover', cobrand: true,
      title: `Your account with Valura, <em>opened through ${VLR.fmt.esc(d.displayName)}</em>.`,
      stand: `This pack contains the agreements that govern your account. The cover and footer are co-branded; every word of the body is regulated text and is identical for every Valura client.`,
      meta: [['Introduced by', d.displayName], ['Partner code', p.partnerCode || 'Pending'], ['Fee schedule', VLR.CONFIG.clientSchedule.version]] })}

    <h2 class="sec"><span class="no">01</span>What is in this pack</h2>
    <table class="dt">
      <tbody>
        <tr><td>Client Account Agreement</td><td>The terms of your account with ${VLR.fmt.esc(d.ent.legalName)}</td></tr>
        <tr><td>Schedule of Fees &amp; Charges ${VLR.CONFIG.clientSchedule.version}</td><td>Every charge, including the referral disclosure at clause 10.2</td></tr>
        <tr><td>Global Access Disclosure &amp; Risk Disclosure Document</td><td>What the structure is and what can go wrong</td></tr>
        <tr><td>Order Handling &amp; Execution Policy</td><td>How your orders are routed and priced</td></tr>
        <tr><td>Complaint Handling &amp; Grievance Redressal Policy</td><td>Lodging a complaint is free</td></tr>
      </tbody>
    </table>

    <h2 class="sec"><span class="no">02</span>About your introduction</h2>
    <div style="border:1px solid var(--rule-strong);border-radius:var(--r-md);padding:16px 18px;background:var(--brand-tint);font-size:10px;line-height:1.7;color:var(--brand-deep)">
      ${VLR.fmt.esc(disc.text)}
    </div>
    <p class="fine">This disclosure is given under clause 18(a) of the IFSCA <i>Regulatory Framework for Global Access in the IFSC</i>. Disclosure version ${VLR.fmt.esc(disc.version)}.</p>

    <h2 class="sec"><span class="no">03</span>What your introducing firm does and does not do</h2>
    <table class="dt">
      <thead><tr><th>${VLR.fmt.esc(d.displayName)} does</th><th>${VLR.fmt.esc(d.displayName)} does not</th></tr></thead>
      <tbody><tr>
        <td>Introduce you to Valura, help you through onboarding, and remain your point of contact.</td>
        <td>Hold your money or assets, execute your trades, give investment advice on Valura's behalf, or act as Valura's agent.</td>
      </tr></tbody>
    </table>
    <p class="fine">Your money and assets are held by ${VLR.fmt.esc(d.ent.legalName)} and its custodian partners. Any fee your introducing firm charges you for its own separate services is a matter between you and that firm and is not collected by Valura unless you have separately authorised it.</p>
    ${VLR.Doc.foot(p, d.ent.legalName + ' · ' + d.ent.licence, 'Cover and footer co-branded · body text is regulated and unaltered')}
  </section>`;
};

/* -- Letterhead ------------------------------------------------------------ */
VLR.Doc.letterhead = function (p) {
  const d = VLR.derive(p);
  return `
  <section class="pg a4">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:1px solid var(--rule)">
      ${VLR.Doc.lockup(p, { onInk: false, size: 22 })}
      <div style="text-align:right">
        <div class="lbl">Partner code</div>
        <div style="font-family:var(--font-mono);font-size:11px;margin-top:4px">${VLR.fmt.esc(p.partnerCode || 'Pending')}</div>
      </div>
    </div>
    <div style="height:2px;width:28px;background:var(--brand);margin-top:-1px"></div>
    <div style="margin-top:44px;color:var(--text-faint);font-size:10px;line-height:2.2">
      ${'&nbsp;'}<br>${'&nbsp;'}<br>${'&nbsp;'}<br>${'&nbsp;'}<br>${'&nbsp;'}<br>${'&nbsp;'}<br>${'&nbsp;'}<br>${'&nbsp;'}<br>${'&nbsp;'}<br>${'&nbsp;'}<br>${'&nbsp;'}<br>${'&nbsp;'}<br>${'&nbsp;'}<br>${'&nbsp;'}<br>${'&nbsp;'}
    </div>
    <div style="position:absolute;left:54px;right:54px;bottom:34px;border-top:1px solid var(--rule);padding-top:10px;font-size:8px;color:var(--text-faint);line-height:1.6">
      ${VLR.fmt.esc(d.displayName)}${p.registeredAddress ? ' · ' + VLR.fmt.esc(p.registeredAddress) : ''}${p.cin ? ' · CIN ' + VLR.fmt.esc(p.cin) : ''}<br>
      Introducing partner of ${VLR.fmt.esc(d.ent.legalName)} · ${VLR.fmt.esc(d.ent.licence)} · Partner code ${VLR.fmt.esc(p.partnerCode || 'pending')}.
      Introductions only — no investment advice is given and no client funds are handled.
    </div>
  </section>`;
};

/* -- Segment pitch one-pager ---------------------------------------------- */
VLR.Doc.segmentPage = function (p) {
  const d = VLR.derive(p);
  const s = d.seg;
  const at = p.aumTargetUsd || d.t.aumTargetY1Usd;
  const r = VLR.Econ.recurring({ aum: at, tierKey: p.tier, rotation: p.rotation,
    giftCityShare: p.giftCityShare, platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct });
  const bySeg = {
    RIA: ['Fee transparency your clients can audit line by line.', 'No custody to build, no broker relationships to negotiate.', 'Execution-only by design, which keeps your fiduciary position clean.'],
    IFA: ['A second revenue line on the book you already have.', 'Onboarding is digital and takes days, not months.', 'Nothing to build, nothing to licence, nothing to hold.'],
    MERCHANT_BANKER: ['Pre-IPO and private placement access, with allocation confirmed in writing before subscription.', 'Placement economics that move with the deal rather than a flat rate.', 'A deal menu refreshed weekly.'],
    FAMILY_OFFICE: ['Structured products and direct global access under one account.', 'Senior coverage and bespoke terms where the size justifies them.', 'Confidentiality provisions that survive termination in perpetuity.'],
    DISTRIBUTOR: [`A ${VLR.fmt.pct(VLR.CONFIG.tiers.ANCHOR.overridePct, 0)} override on your network's entitlement, paid out of Valura's share.`, 'Your sub-partners keep their full compensation — the override never reduces them.', 'Recruitment, onboarding and certification run by Valura, not by you.']
  };
  return `
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: `Segment brief · ${s.label}`, cobrand: true,
      title: s.hook.replace(/^(\w+)/, '<em>$1</em>'),
      stand: `${VLR.fmt.esc(s.label)}s want ${VLR.fmt.esc(s.wants.toLowerCase())}. This page is the version of the Valura proposition written for that, rather than a general deck with a different cover.`,
      meta: [['Segment', s.label], ['Tier', d.t.label], ['Override', d.overridePct ? VLR.fmt.pct(d.overridePct, 0) : '—']] })}

    <h2 class="sec"><span class="no">01</span>Why this works for you specifically</h2>
    <ul style="font-size:10.5px;line-height:1.7">${(bySeg[p.segment] || bySeg.IFA).map(x => `<li>${x}</li>`).join('')}</ul>

    <h2 class="sec"><span class="no">02</span>The economics at your scale</h2>
    ${VLR.Doc.ladderTable(p, { inr: true })}

    <h2 class="sec"><span class="no">03</span>What it takes from you</h2>
    <table class="dt">
      <tbody>
        <tr><td>Certification</td><td>Nine modules and an exam at ${VLR.CONFIG.examPassMark}%, per person who will speak to clients. Roughly half a day.</td></tr>
        <tr><td>KYB</td><td>${VLR.CONFIG.kybPack.filter(k => k.required).length} documents, once. Partner code within ${VLR.CONFIG.ops.kybTatHours} hours of completeness.</td></tr>
        <tr><td>Marketing</td><td>Approved collateral, generated for you. Your marketing spend band at this tier is ${VLR.fmt.esc(d.t.spendBandInr)}, and Valura co-funds ${VLR.fmt.pct(d.t.coFundingPct, 0)} of approved spend.</td></tr>
        <tr><td>Time to first ticket</td><td>${VLR.CONFIG.ops.goLiveDays} days from signature, on the published programme.</td></tr>
      </tbody>
    </table>

    <div class="callout">At a year-one target of ${VLR.fmt.usdShort(at)} in referred AUM, indicative recurring income is <b>${VLR.fmt.usd(r.partnerTotal)}</b> (${VLR.fmt.inr(r.partnerTotal * VLR.CONFIG.ops.fxUsdInr)}) before placement income. Projection, not a guarantee.</div>
    ${VLR.Doc.foot(p, d.ent.legalName + ' · ' + d.ent.licence, `Segment brief · ${s.label}`)}
  </section>`;
};
