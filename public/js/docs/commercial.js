/* ============================================================================
   Term sheet · partner economics one-pager · fact sheet · referral disclosure
   All four read the same illustrator. Change a share percentage once and all
   four move together.
   ==========================================================================*/

window.VLR = window.VLR || {};
VLR.Doc = VLR.Doc || {};

/* -- 01 · TERM SHEET — one page, initialled not signed -------------------- */
VLR.Doc.termSheet = function (p) {
  const d = VLR.derive(p);
  const C = VLR.CONFIG, cs = C.clientSchedule;
  const at = p.aumTargetUsd || d.t.aumTargetY1Usd;
  const r = VLR.Econ.recurring({ aum: at, tierKey: p.tier, rotation: p.rotation,
    giftCityShare: p.giftCityShare, platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct });

  return `
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: 'Term sheet · initial, do not sign', cobrand: true,
      title: `The economics, on <em>one page</em>.`,
      stand: `Initial this and the agreement is generated from it. Schedule A is locked to these numbers — the contract stage becomes a signature, not a second negotiation.`,
      meta: [['Partner', d.displayName], ['Tier proposed', d.t.label], ['Segment', d.seg.label], ['Target go-live', p.effectiveDate ? VLR.fmt.date(VLR.Cal.build(p).events.find(e => e.k === 'funded').date) : 'D+30 from signature']] })}

    <div class="split" style="gap:30px">
      <div>
        ${VLR.Doc.eyebrow('What you earn')}
        <div class="kv k2" style="grid-template-columns:1fr 1fr">
          <div><div class="k">Platform fee share</div><div class="v">${VLR.fmt.pct(d.platformSharePct, 0)}</div></div>
          <div><div class="k">Brokerage share</div><div class="v">${VLR.fmt.pct(d.brokerageSharePct, 0)}</div></div>
          <div><div class="k">Placement share</div><div class="v">${VLR.fmt.pct(d.placementSharePct, 0)}</div></div>
          <div><div class="k">Override</div><div class="v">${d.overridePct ? VLR.fmt.pct(d.overridePct, 0) : '—'}</div></div>
          <div><div class="k">Tail on termination</div><div class="v sm">${d.tailLabel}</div></div>
          <div><div class="k">Incentive grid</div><div class="v sm">${C.incentiveGrid.ref}</div></div>
        </div>
      </div>
      <div>
        ${VLR.Doc.eyebrow('The mechanism')}
        <p class="lede">You are paid a defined share of what Valura actually collects from the clients you introduce — ${VLR.fmt.pct(d.platformSharePct, 0)} of the ${VLR.fmt.pct(cs.platformFeePct)} annual platform fee on their chargeable assets, and ${VLR.fmt.pct(d.brokerageSharePct, 0)} of the brokerage Valura retains after exchange and clearing costs.</p>
        <p>Because the entitlement is a percentage rather than a fixed rate, a change in Valura's published pricing cannot leave either side underwater. GIFT City-domiciled and external funds are exempt from the platform fee, so no platform-fee share arises on them — that is stated here rather than discovered later.</p>
      </div>
    </div>

    <h2 class="sec"><span class="no">01</span>Indicative recurring income</h2>
    ${VLR.Doc.ladderTable(p, { inr: true })}

    <h2 class="sec"><span class="no">02</span>Placement income</h2>
    ${VLR.Doc.placementTable(p)}

    <h2 class="sec"><span class="no">03</span>At your stated target</h2>
    <div class="kv">
      <div><div class="k">Year-1 AUM target</div><div class="v">${VLR.fmt.usdShort(at)}</div></div>
      <div><div class="k">Annual recurring at target</div><div class="v">${VLR.fmt.usd(r.partnerTotal)}</div></div>
      <div><div class="k">In INR</div><div class="v">${VLR.fmt.inr(r.partnerTotal * C.ops.fxUsdInr)}</div></div>
      <div><div class="k">Effective yield on AUM</div><div class="v">${VLR.fmt.pct(r.partnerYieldOnAum)}</div></div>
    </div>

    <h2 class="sec"><span class="no">04</span>What Valura funds</h2>
    <table class="dt">
      <tbody>
        <tr><td>Marketing co-funding</td><td class="num">${VLR.fmt.pct(d.t.coFundingPct, 0)} of approved spend</td>
            <td>Indicative partner spend band ${d.t.spendBandInr}</td></tr>
        <tr><td>Identity and kit</td><td colspan="2">${d.t.kit}</td></tr>
        <tr><td>Coverage</td><td colspan="2">${d.t.coverage} · ${d.t.cadence}</td></tr>
        <tr><td>Portal seats</td><td class="num">${d.portalSeats}</td><td>Co-branded email identities created by Valura for each named person</td></tr>
        <tr><td>Go-live</td><td class="num">${C.ops.goLiveDays} days</td><td>From signature to first funded ticket</td></tr>
      </tbody>
    </table>

    <div class="callout">Initialling this term sheet confirms the economics only. It is not a contract, creates no obligation to proceed, and is superseded in full by the executed Partner Agreement.</div>

    <div class="sign-grid" style="margin-top:20px">
      <div class="sign-box"><div class="who">Valura — initialled</div><div class="line"></div>
        <div class="f">${VLR.fmt.esc(d.ent.signatory.name)} · ${VLR.fmt.esc(d.ent.signatory.title)}<br>Date: ______________</div></div>
      <div class="sign-box"><div class="who">${VLR.fmt.esc(d.displayName)} — initialled</div><div class="line"></div>
        <div class="f">${VLR.fmt.esc(p.signatoryName || '—')} · ${VLR.fmt.esc(p.signatoryTitle || '—')}<br>Date: ______________</div></div>
    </div>
    ${VLR.Doc.foot(p, d.ent.legalName + ' · ' + d.ent.licence, 'Term sheet · indicative · not a contract')}
  </section>`;
};

/* -- 02 · PARTNER ONE-PAGER (economics) — A4 landscape, co-branded -------- */
VLR.Doc.onePager = function (p) {
  const d = VLR.derive(p);
  const C = VLR.CONFIG, cs = C.clientSchedule;
  const lad = VLR.Econ.ladder({ tierKey: p.tier, rotation: p.rotation, giftCityShare: p.giftCityShare,
    platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct });
  const max = Math.max(...lad.map(l => l.annual));

  return `
  <section class="pg a4l">
    ${VLR.Doc.band(p, { label: `Partner economics · ${d.t.label} tier`, cobrand: true,
      title: `A second revenue line on <em>the book you already have</em>.`,
      stand: `${VLR.fmt.esc(d.displayName)} introduces clients to Valura. Valura custodies, executes and services them. You are paid a defined share of every fee Valura collects on those clients, for as long as they stay.`,
      meta: [['Partner code', p.partnerCode || 'Pending'], ['Tier', d.t.label], ['Platform share', VLR.fmt.pct(d.platformSharePct, 0)], ['Brokerage share', VLR.fmt.pct(d.brokerageSharePct, 0)]] })}

    <div style="display:grid;grid-template-columns:1fr 2.2fr;gap:34px;align-items:start">
      <div>
        ${VLR.Doc.eyebrow('How the money moves')}
        <p style="font-size:10px;line-height:1.6">The client pays Valura's published charges — nothing more, and nothing extra for having been introduced. Valura pays you out of what it collects.</p>
        <table class="dt" style="margin-top:8px">
          <tbody>
            <tr><td>Client pays platform fee</td><td class="num">${VLR.fmt.pct(cs.platformFeePct)} p.a.</td></tr>
            <tr><td>Client pays brokerage</td><td class="num">${VLR.fmt.pct(cs.grossBrokeragePct)}</td></tr>
            <tr><td>Valura retains, net of pass-through</td><td class="num">${VLR.fmt.pct(cs.netBrokerageRetainedPct)}</td></tr>
            <tr class="hl"><td>Your share of the platform fee</td><td class="num">${VLR.fmt.pct(d.platformSharePct, 0)}</td></tr>
            <tr class="hl"><td>Your share of net brokerage</td><td class="num">${VLR.fmt.pct(d.brokerageSharePct, 0)}</td></tr>
            <tr class="tot"><td>Effective on chargeable AUM</td><td class="num">${VLR.fmt.pct(d.platformSharePct * cs.platformFeePct)} p.a.</td></tr>
          </tbody>
        </table>
        <p class="fine">GIFT City-domiciled and external funds are exempt from the platform fee. No share arises on them.</p>
      </div>

      <div>
        ${VLR.Doc.eyebrow('Indicative annual recurring income')}
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:12px 0 12px">
          ${lad.map(l => `
            <div style="border-top:1px solid var(--rule);padding-top:9px">
              <div class="k" style="font-family:var(--font-mono);font-size:7.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--text-faint)">${VLR.fmt.usdShort(l.aum)} AUM</div>
              <div style="font-family:var(--font-mono);font-size:18px;font-variant-numeric:tabular-nums;margin-top:6px;color:var(--brand-deep)">${VLR.fmt.usd(l.annual)}</div>
              <div style="font-size:8.5px;color:var(--text-muted);margin-top:3px">${VLR.fmt.inr(l.annual * C.ops.fxUsdInr)} · ${VLR.fmt.pct(l.yield)} yield</div>
              <div style="height:3px;background:var(--brand-tint);margin-top:8px;border-radius:2px;overflow:hidden">
                <div style="height:100%;width:${(l.annual / max * 100).toFixed(1)}%;background:var(--brand)"></div>
              </div>
            </div>`).join('')}
        </div>
        <p class="fine">Assumes ${VLR.fmt.pct(p.rotation, 0)} portfolio rotation and ${VLR.fmt.pct(p.giftCityShare, 0)} of assets in fee-exempt funds. Pre-tax, pre-FX. Placement income is additional. Projections, not a guarantee.</p>

        ${VLR.Doc.eyebrow('Plus one-time placement income')}
        ${VLR.Doc.placementTable(p, { noNote: true })}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:10px;border-top:1px solid var(--rule);padding-top:10px">
      <div><div class="k" style="font-family:var(--font-mono);font-size:7.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--text-faint)">Settlement</div>
        <div style="font-size:9.5px;margin-top:4px;color:var(--text-body)">Quarterly in arrears, in USD, within ${C.ops.statementDueBusinessDays} business days of quarter end.</div></div>
      <div><div class="k" style="font-family:var(--font-mono);font-size:7.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--text-faint)">Tail</div>
        <div style="font-size:9.5px;margin-top:4px;color:var(--text-body)">${d.tailLabel}.</div></div>
      <div><div class="k" style="font-family:var(--font-mono);font-size:7.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--text-faint)">You never</div>
        <div style="font-size:9.5px;margin-top:4px;color:var(--text-body)">Hold client funds, advise, or represent yourself as licensed. Introductions only.</div></div>
      <div><div class="k" style="font-family:var(--font-mono);font-size:7.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--text-faint)">Your client sees</div>
        <div style="font-size:9.5px;margin-top:4px;color:var(--text-body)">Your remuneration, as a real figure, at onboarding. Required by clause 18(a).</div></div>
    </div>

    ${VLR.Doc.foot(p, d.ent.legalName + ' · ' + d.ent.licence, 'Indicative · not an offer · figures are projections')}
  </section>`;
};

/* -- 03 · PARTNER FACT SHEET — the internal record ------------------------ */
VLR.Doc.factSheet = function (p) {
  const d = VLR.derive(p);
  const rd = VLR.readiness(p);
  const row = (k, v) => `<tr><td style="width:34%">${k}</td><td>${v || '—'}</td></tr>`;
  return `
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: 'Internal · partner fact sheet', cobrand: false,
      title: `${VLR.fmt.esc(d.displayName)}`,
      stand: `The one-page internal record. Generated from the partner record; never maintained by hand.`,
      meta: [['Code', p.partnerCode || 'Pending'], ['Stage', (VLR.CONFIG.stages.find(s => s.key === p.stage) || {}).label || '—'],
             ['Tier', d.t.label], ['Entity', d.ent.short]] })}

    <h2 class="sec"><span class="no">01</span>Entity</h2>
    <table class="dt"><tbody>
      ${row('Legal name', VLR.fmt.esc(p.legalName))}
      ${row('Trading name', VLR.fmt.esc(p.tradingName))}
      ${row('Segment', d.seg.label + ' — ' + d.seg.hook)}
      ${row('Registered address', VLR.fmt.esc(p.registeredAddress))}
      ${row('CIN · PAN · GST', [p.cin, p.pan, p.gst].filter(Boolean).map(VLR.fmt.esc).join(' · '))}
      ${row('Incorporated', VLR.fmt.date(p.incorporationDate))}
      ${row('Website', VLR.fmt.esc(p.website))}
      ${row('Regulatory registrations', VLR.fmt.esc(p.regRegistrations))}
      ${row('Cities', VLR.fmt.esc(p.cities))}
    </tbody></table>

    <h2 class="sec"><span class="no">02</span>People</h2>
    <table class="dt"><thead><tr><th>Role</th><th>Name</th><th>Email</th><th>Mobile</th></tr></thead><tbody>
      <tr><td>Authorised signatory</td><td>${VLR.fmt.esc(p.signatoryName)}</td><td>${VLR.fmt.esc(p.signatoryEmail)}</td><td>${VLR.fmt.esc(p.signatoryMobile)}</td></tr>
      <tr><td>Business</td><td>${VLR.fmt.esc(p.businessContact)}</td><td>${VLR.fmt.esc(p.businessEmail)}</td><td>${VLR.fmt.esc(p.businessMobile)}</td></tr>
      <tr><td>Marketing</td><td>${VLR.fmt.esc(p.marketingContact)}</td><td>${VLR.fmt.esc(p.marketingEmail)}</td><td>—</td></tr>
      <tr><td>Operations</td><td>${VLR.fmt.esc(p.opsContact)}</td><td>${VLR.fmt.esc(p.opsEmail)}</td><td>—</td></tr>
      <tr><td>Compliance</td><td>${VLR.fmt.esc(p.complianceContact)}</td><td>${VLR.fmt.esc(p.complianceEmail)}</td><td>—</td></tr>
    </tbody></table>

    <h2 class="sec"><span class="no">03</span>Commercial terms in force</h2>
    <div class="kv">
      <div><div class="k">Platform share</div><div class="v">${VLR.fmt.pct(d.platformSharePct, 0)}</div></div>
      <div><div class="k">Brokerage share</div><div class="v">${VLR.fmt.pct(d.brokerageSharePct, 0)}</div></div>
      <div><div class="k">Placement share</div><div class="v">${VLR.fmt.pct(d.placementSharePct, 0)}</div></div>
      <div><div class="k">Override</div><div class="v">${d.overridePct ? VLR.fmt.pct(d.overridePct, 0) : '—'}</div></div>
      <div><div class="k">Tail</div><div class="v sm">${d.tailLabel}</div></div>
      <div><div class="k">Effective from</div><div class="v sm">${VLR.fmt.date(p.effectiveDate)}</div></div>
      <div><div class="k">Portal seats</div><div class="v">${d.portalSeats}</div></div>
      <div><div class="k">Co-funding</div><div class="v">${VLR.fmt.pct(d.t.coFundingPct, 0)}</div></div>
    </div>

    <h2 class="sec"><span class="no">04</span>Go-live gates</h2>
    <table class="dt"><tbody>
      ${rd.checks.map(c => `<tr><td style="width:44%">${c.label}</td>
        <td class="num" style="width:14%;color:${c.ok ? 'var(--brand)' : 'var(--down)'}">${c.ok ? 'GREEN' : 'BLOCKED'}</td>
        <td>${VLR.fmt.esc(c.why)}</td></tr>`).join('')}
    </tbody></table>
    ${rd.ready ? `<div class="callout"><b>All gates green.</b> This partner code may go live.</div>`
      : `<div class="callout stop"><b>Not cleared for go-live.</b> ${rd.checks.filter(c => !c.ok).length} gate(s) outstanding. A partner code that goes live without a resolving, compliance-approved referral disclosure is a regulatory breach, not a bug.</div>`}

    <h2 class="sec"><span class="no">05</span>Compliance declarations</h2>
    <table class="dt"><tbody>
      ${row('Pre-Existing Clients (Clause 12.2 carve-out)', VLR.fmt.esc(p.preExistingClients))}
      ${row('Other platforms distributed for', VLR.fmt.esc(p.otherPlatforms))}
      ${row('Regulatory action, last 5 years', VLR.fmt.esc(p.regulatoryAction))}
    </tbody></table>
    ${VLR.Doc.foot(p, 'Internal · not for circulation to the partner', 'Partner fact sheet')}
  </section>`;
};

/* -- 04 · REFERRAL DISCLOSURE — the regulatory artefact -------------------- */
VLR.Doc.disclosureDoc = function (p) {
  const d = VLR.derive(p);
  const disc = VLR.Econ.disclosure({ ...p, tier: p.tier,
    platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct, placementSharePct: d.placementSharePct });
  const cs = VLR.CONFIG.clientSchedule;

  return `
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: 'Regulatory · clause 18(a) referral disclosure', cobrand: false,
      title: `What the client is <em>actually told</em>.`,
      stand: `Clause 18(a) of the IFSCA Regulatory Framework for Global Access in the IFSC requires the remuneration payable to a client's introducing firm to be disclosed to that client. A generic statement that referral fees "may" be paid does not satisfy it. This is the string clause 10.2 of the Schedule of Fees & Charges renders for this partner code.`,
      meta: [['Partner code', p.partnerCode || 'PENDING'], ['Version', disc.version],
             ['Resolves', disc.resolves ? 'Yes' : 'No'], ['Compliance approval', p.disclosureApproved ? 'Approved' : 'Pending']] })}

    <h2 class="sec"><span class="no">10.2</span>Disclosure — as rendered to the client</h2>
    <div style="border:1px solid var(--rule-strong);border-radius:var(--r-md);padding:20px 22px;background:var(--paper-2);font-size:11px;line-height:1.7;color:var(--text)">
      ${VLR.fmt.esc(disc.text)}
    </div>

    <h2 class="sec"><span class="no">01</span>How the figures are derived</h2>
    <table class="dt">
      <thead><tr><th>Input</th><th>Source</th><th class="num">Value</th></tr></thead>
      <tbody>
        <tr><td>Platform fee charged to the client</td><td>Client Fee Schedule ${cs.version}, section 4</td><td class="num">${VLR.fmt.pct(cs.platformFeePct)} p.a.</td></tr>
        <tr><td>Partner's share of it</td><td>Schedule A.1 of the Partner Agreement</td><td class="num">${VLR.fmt.pct(d.platformSharePct, 0)}</td></tr>
        <tr class="hl"><td>Disclosed to the client as</td><td>Rendered figure</td><td class="num">${VLR.fmt.pct(disc.figures.platformEff)} p.a.</td></tr>
        <tr><td>Per ${VLR.fmt.usd(100000)} of chargeable assets</td><td>Derived</td><td class="num">${VLR.fmt.usd(disc.figures.per100k)} a year</td></tr>
        <tr><td>Net brokerage Valura retains</td><td>Client Fee Schedule ${cs.version}, section 2, net of section 7</td><td class="num">${VLR.fmt.pct(cs.netBrokerageRetainedPct)}</td></tr>
        <tr><td>Partner's share of it</td><td>Schedule A.1</td><td class="num">${VLR.fmt.pct(d.brokerageSharePct, 0)}</td></tr>
        <tr class="hl"><td>Disclosed to the client as</td><td>Rendered figure</td><td class="num">${VLR.fmt.pct(disc.figures.brokerageEff)} of traded value</td></tr>
      </tbody>
    </table>

    <h2 class="sec"><span class="no">02</span>Controls</h2>
    <ol>
      <li>The string is generated from the partner's commercial terms, never typed. If a term changes, the string is re-rendered and re-versioned.</li>
      <li>The version identifier <span class="mono">${disc.version}</span> is stamped on every document and every client-onboarding journey that renders it, so any disclosure shown to any client can be traced to the terms in force on that day.</li>
      <li>The client onboarding journey calls the resolver at KYC time. If the resolver does not return an approved string for the partner code, onboarding under that code stops.</li>
      <li>A partner code cannot be marked live until the string resolves <b>and</b> a compliance user has approved it. This is enforced as a hard gate, not a checklist item.</li>
    </ol>

    ${p.disclosureApproved
      ? `<div class="callout"><b>Approved by ${VLR.fmt.esc(p.disclosureApprovedBy || 'Compliance')}</b> on ${VLR.fmt.date(p.disclosureApprovedAt)}. Version ${disc.version} is live for partner code ${VLR.fmt.esc(p.partnerCode)}.</div>`
      : `<div class="callout stop"><b>Not approved.</b> No client may be onboarded under this partner code until a compliance user approves this string in the Hub. Onboarding under an unapproved code is a breach of clause 18(a), not an operational slip.</div>`}
    ${VLR.Doc.foot(p, 'Rendered into Schedule of Fees & Charges clause 10.2', disc.version)}
  </section>`;
};
