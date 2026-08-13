/* ============================================================================
   Valura Partner Activation Hub — application
   ==========================================================================*/

window.VLR = window.VLR || {};

VLR.App = (function () {
  let view = 'pipeline';
  let docTab = {};      // view → active sub-tab
  let showVars = false;

  const $ = s => document.querySelector(s);
  const el = id => document.getElementById(id);

  const VIEWS = [
    { group: 'Pipeline', items: [
      { k: 'pipeline', no: '—', label: 'Board' },
      { k: 'setup',    no: '01', label: 'Partner details' },
      { k: 'calendar', no: '02', label: 'Activation calendar' }
    ]},
    { group: 'Commercial', items: [
      { k: 'pricing',   no: '03', label: 'Pricing & revenue share' },
      { k: 'economics', no: '04', label: 'Earnings illustrator' },
      { k: 'commercial', no: '05', label: 'Term sheet & briefs' },
      { k: 'agreement', no: '06', label: 'Agreement & signing' }
    ]},
    { group: 'Activation', items: [
      { k: 'compliance', no: '06', label: 'KYB & disclosure' },
      { k: 'collateral', no: '07', label: 'Collateral pack' },
      { k: 'emails',     no: '08', label: 'Email sequence' },
      { k: 'plan',       no: '09', label: 'Plan & statement' }
    ]},
    { group: 'Handover', items: [
      { k: 'pack',      no: '10', label: 'The partner pack' },
      { k: 'programme', no: '11', label: 'Programme & decisions' }
    ]}
  ];

  /* ---------------------------------------------------------------- init */
  function init() {
    VLR.Store.load();
    if (!VLR.Store.all().length) seed();
    render();
    document.addEventListener('click', onClick);
    document.addEventListener('change', onChange);
    document.addEventListener('input', onInput);
  }

  function toast(msg) {
    const t = el('toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 1900);
  }

  /* ------------------------------------------------------------- seeding */
  function seed() {
    const iso = n => { const d = new Date(); d.setDate(d.getDate() + n); return VLR.fmt.iso(d); };

    const a = Object.assign(VLR.blankPartner(), {
      legalName: 'Neoma Capital Private Limited', tradingName: 'Neoma Capital', slug: 'neoma',
      segment: 'MERCHANT_BANKER', tier: 'GROWTH', contractingEntity: 'VALURA_INDIA_IFSC',
      registeredAddress: '2/16 FFRS, Nehru Enclave, Kalkaji, New Delhi 110019',
      cin: 'U65999DL2019PTC348821', pan: 'AAECN4471K', gst: '07AAECN4471K1ZP',
      incorporationDate: '2019-04-12', website: 'neomacapital.in', cities: 'Delhi NCR, Mumbai',
      regRegistrations: 'SEBI Merchant Banker — MB/INM000012345, valid to 2028',
      signatoryName: 'Harsh Agarwal', signatoryTitle: 'Chief Executive Officer and Founder',
      signatoryEmail: 'harsh@neomacapital.in', signatoryMobile: '+91 98110 22114',
      businessContact: 'Ritika Sharma', businessEmail: 'ritika@neomacapital.in', businessMobile: '+91 98730 55129',
      marketingContact: 'Ananya Bose', marketingEmail: 'ananya@neomacapital.in',
      opsContact: 'Vikram Nair', opsEmail: 'ops@neomacapital.in',
      complianceContact: 'Sanjay Rao', complianceEmail: 'compliance@neomacapital.in',
      people: [
        { name: 'Harsh Agarwal', title: 'CEO and Founder', mobile: '+91 98110 22114', wantsEmailId: true, wantsCard: true, cardQty: 250 },
        { name: 'Ritika Sharma', title: 'Head of Distribution', mobile: '+91 98730 55129', wantsEmailId: true, wantsCard: true, cardQty: 150 },
        { name: 'Ananya Bose', title: 'Marketing Lead', mobile: '+91 99100 77340', wantsEmailId: true, wantsCard: false, cardQty: 0 }
      ],
      primaryHex: '#12314F', secondaryHex: '#C9A227', tagline: 'Private markets, properly done',
      effectiveDate: iso(-6), partnerCode: 'VLR-MB0101', stage: '04_identity_kit',
      aumTargetUsd: 6000000, clientTarget: 40, avgTicketUsd: 150000,
      placementsPerYearUsd: 2500000, placementMix: 'PREIPO',
      marketingBudgetInr: 800000, monthlyCostUsd: 2000,
      clientSegments: 'HNI founders, promoter families, senior corporate executives',
      languages: 'English, Hindi',
      shippingAddress: '2/16 FFRS, Nehru Enclave, Kalkaji, New Delhi 110019',
      preExistingClients: '38 clients under an existing advisory relationship — schedule attached',
      otherPlatforms: 'None', regulatoryAction: 'None in the last five years',
      trademarkLicenceSigned: true, disclosureApproved: true,
      disclosureApprovedBy: 'Parthiban', disclosureApprovedAt: iso(-3),
      bankName: 'HDFC Bank — GIFT City IBU', bankAccount: 'USD 5701 2288 4410', swift: 'HDFCINBBGFT',
      gstEntity: 'Neoma Capital Private Limited'
    });
    VLR.CONFIG.kybPack.forEach(k => { a.kyb[k.code] = { status: 'APPROVED', note: '', at: iso(-4) }; });

    const b = Object.assign(VLR.blankPartner(), {
      legalName: 'Sagara Wealth Advisors LLP', tradingName: 'Sagara Wealth', slug: 'sagara',
      segment: 'IFA', tier: 'STARTER', contractingEntity: 'VALURA_INDIA_IFSC',
      registeredAddress: '4th Floor, Prestige Atrium, Vittal Mallya Road, Bengaluru 560001',
      cin: 'AAF-2291', pan: 'AAGFS9021M', incorporationDate: '2021-08-02',
      cities: 'Bengaluru, Kochi',
      signatoryName: 'Meera Krishnan', signatoryTitle: 'Managing Partner',
      signatoryEmail: 'meera@sagarawealth.in', signatoryMobile: '+91 98450 31192',
      businessContact: 'Meera Krishnan', businessEmail: 'meera@sagarawealth.in',
      people: [{ name: 'Meera Krishnan', title: 'Managing Partner', mobile: '+91 98450 31192', wantsEmailId: true, wantsCard: true, cardQty: 100 }],
      primaryHex: '#1E5C4F', secondaryHex: '#7FB2A5',
      effectiveDate: iso(-1), stage: '03_onboard_kyb',
      aumTargetUsd: 1500000, clientTarget: 18, avgTicketUsd: 85000,
      languages: 'English, Kannada, Malayalam',
      preExistingClients: '52 clients under an existing advisory relationship',
      regulatoryAction: 'None in the last five years'
    });
    ['COI', 'PAN', 'BOARD', 'SIGID'].forEach(k => { b.kyb[k] = { status: 'APPROVED', note: '', at: iso(0) }; });
    b.kyb.GST = { status: 'QUERIED', note: 'Certificate is for the LLP’s old address — please send the amended one.', at: iso(0) };

    const c = Object.assign(VLR.blankPartner(), {
      legalName: 'Aurum Distribution Network Private Limited', tradingName: 'Aurum Network', slug: 'aurum',
      segment: 'DISTRIBUTOR', tier: 'ANCHOR', contractingEntity: 'VALURA_INDIA_IFSC',
      registeredAddress: 'Level 9, Platina, BKC, Mumbai 400051',
      cin: 'U67190MH2016PTC287744', incorporationDate: '2016-02-19',
      cities: 'Mumbai, Pune, Ahmedabad, Surat',
      signatoryName: 'Devendra Shah', signatoryTitle: 'Managing Director',
      signatoryEmail: 'd.shah@aurumnetwork.in', signatoryMobile: '+91 98200 41123',
      businessContact: 'Prisha Mehta', businessEmail: 'prisha@aurumnetwork.in',
      people: [
        { name: 'Devendra Shah', title: 'Managing Director', mobile: '+91 98200 41123', wantsEmailId: true, wantsCard: true, cardQty: 500 },
        { name: 'Prisha Mehta', title: 'Network Head', mobile: '+91 99300 88120', wantsEmailId: true, wantsCard: true, cardQty: 300 }
      ],
      primaryHex: '#3A2A1F', secondaryHex: '#B98B3C',
      stage: '01_pitch_price',
      aumTargetUsd: 20000000, clientTarget: 130, avgTicketUsd: 155000,
      placementsPerYearUsd: 6000000, placementMix: 'STRUCTURED',
      marketingBudgetInr: 1600000, monthlyCostUsd: 4000,
      languages: 'English, Hindi, Gujarati, Marathi',
      regulatoryAction: 'None in the last five years'
    });

    VLR.Store.add(c); VLR.Store.add(b); VLR.Store.add(a);
    VLR.Store.setActive(a.id);
  }

  /* --------------------------------------------------------------- render */
  function render() {
    const p = VLR.Store.active();
    renderRail(p);
    renderTop(p);
    const body = el('body-view');
    if (!p) { body.innerHTML = emptyState(); return; }
    body.innerHTML = ({
      pipeline: vPipeline, setup: vSetup, calendar: vCalendar, economics: vEconomics,
      pricing: vPricing,
      commercial: vCommercial, agreement: vAgreement, compliance: vCompliance,
      collateral: vCollateral, emails: vEmails, plan: vPlan, pack: vPack, programme: vProgramme
    }[view] || vPipeline)(p);
    body.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function renderRail(p) {
    const rd = p ? VLR.readiness(p) : null;
    el('rail-nav').innerHTML = VIEWS.map(g => `
      <div class="nav-group">
        <div class="lbl">${g.group}</div>
        ${g.items.map(i => `<button class="nav-item ${view === i.k ? 'on' : ''}" data-view="${i.k}">
          <span class="nav-no">${i.no}</span><span>${i.label}</span>
          ${i.k === 'compliance' && rd ? `<span class="nav-badge ${rd.ready ? 'go' : 'stop'}">${rd.checks.filter(c => c.ok).length}/${rd.checks.length}</span>` : ''}
        </button>`).join('')}
      </div>`).join('');

    el('rail-foot').innerHTML = `
      <div class="lbl">Partners</div>
      <div style="margin-top:8px;display:flex;flex-direction:column;gap:4px">
        ${VLR.Store.all().map(x => {
          const dx = VLR.derive(x);
          return `<button class="nav-item ${p && x.id === p.id ? 'on' : ''}" data-partner="${x.id}" style="padding:6px 8px">
            <span style="width:6px;height:6px;border-radius:50%;background:${VLR.fmt.esc(x.secondaryHex || '#02A24B')};flex:none"></span>
            <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px">${VLR.fmt.esc(dx.displayName)}</span>
            <span class="nav-no">${VLR.fmt.esc((VLR.CONFIG.stages.find(s => s.key === x.stage) || {}).no || '')}</span>
          </button>`;
        }).join('')}
      </div>
      <button class="btn sm ghost" data-act="new" style="width:100%;margin-top:10px;justify-content:center;border-color:rgba(255,255,255,.16);color:rgba(233,241,236,.8);background:transparent">+ New partner</button>`;
  }

  function renderTop(p) {
    if (!p) { el('topbar').innerHTML = `<div class="who"><h1>Valura Partner Activation Hub</h1></div>`; return; }
    const d = VLR.derive(p);
    const rd = VLR.readiness(p);
    const st = VLR.CONFIG.stages.find(s => s.key === p.stage) || VLR.CONFIG.stages[0];
    el('topbar').innerHTML = `
      <div class="who">
        <h1>${VLR.fmt.esc(d.displayName)}</h1>
        <span class="chip">${st.no} · ${VLR.fmt.esc(st.label)}</span>
        <span class="chip">${VLR.fmt.esc(d.t.label)}</span>
        ${p.partnerCode ? `<span class="chip ink mono">${VLR.fmt.esc(p.partnerCode)}</span>` : '<span class="chip warn">code pending</span>'}
      </div>
      <div class="spacer"></div>
      <span class="chip ${rd.ready ? 'go' : 'stop'} dot">${rd.ready ? 'Cleared for go-live' : rd.checks.filter(c => !c.ok).length + ' gates open'}</span>
      <button class="btn sm" data-act="print">Print / PDF</button>`;
  }

  function emptyState() {
    return `<div class="sheet"><div class="empty">
      <div class="lbl">No partner selected</div>
      <h3>Add a partner, and the pack builds itself.</h3>
      <p>Paste the entity details, drop in a logo, set the tier. The agreement, term sheet, calendar, collateral and email sequence generate from that.</p>
      <button class="btn p" data-act="new">Create the first partner</button>
    </div></div>`;
  }

  /* ============================================================ VIEWS ==== */

  function head(eyebrow, title, stand) {
    return `<div class="page-head">
      <div class="lbl">${eyebrow}</div><div class="eyebrow-rule"></div>
      <h2 class="serif">${title}</h2>
      ${stand ? `<p class="stand">${stand}</p>` : ''}
    </div>`;
  }

  function tabs(viewKey, list) {
    const cur = docTab[viewKey] || list[0].k;
    return `<div class="docbar">
      <div class="doc-tabs">${list.map(t =>
        `<button class="doc-tab ${cur === t.k ? 'on' : ''}" data-tab="${viewKey}:${t.k}">${t.label}</button>`).join('')}</div>
      <div class="spacer"></div>
      ${viewKey === 'agreement' ? `<button class="btn sm ghost" data-act="vars">${showVars ? 'Hide' : 'Show'} variable fields</button>` : ''}
      <button class="btn sm" data-act="print">Print / PDF</button>
    </div>`;
  }
  const tabOf = (v, list) => docTab[v] || list[0].k;

  /* -- Pipeline board ---------------------------------------------------- */
  function vPipeline(p) {
    const all = VLR.Store.all();
    return `<div class="sheet wide">
      ${head('Pipeline', 'Seven stages. <em>One gate each.</em>',
        'A stage cannot open until the previous gate is green. Gates can be overridden by an admin with a written reason, which is logged on the partner record permanently.')}
      <div class="board">
        ${VLR.CONFIG.stages.map(s => `
          <div class="col ${all.some(x => x.stage === s.key) ? 'on' : ''}">
            <div class="lbl">${s.no} · ${VLR.fmt.esc(s.window)}</div>
            <h4>${VLR.fmt.esc(s.label)}</h4>
            <div class="gate">${VLR.fmt.esc(s.gate)}</div>
            ${all.filter(x => x.stage === s.key).map(x => {
              const dx = VLR.derive(x); const rx = VLR.readiness(x);
              return `<div class="pcard ${p.id === x.id ? 'on' : ''}" data-partner="${x.id}">
                <div class="n">${VLR.fmt.esc(dx.displayName)}</div>
                <div class="m">
                  <span class="chip">${VLR.fmt.esc(dx.t.label)}</span>
                  <span class="chip ${rx.ready ? 'go' : 'stop'}">${rx.checks.filter(c => c.ok).length}/${rx.checks.length}</span>
                </div>
              </div>`;
            }).join('')}
          </div>`).join('')}
      </div>

      <div class="grid g4" style="margin-top:26px">
        ${(() => {
          const live = all.filter(x => VLR.readiness(x).ready).length;
          const coded = all.filter(x => x.partnerCode).length;
          const blocked = all.filter(x => x.partnerCode && !x.disclosureApproved).length;
          const aum = all.reduce((s, x) => s + (x.aumTargetUsd || VLR.tier(x.tier).aumTargetY1Usd), 0);
          return `
          <div class="stat"><div class="lbl">Partners in flight</div><div class="v">${all.length}</div><div class="n">Across seven stages</div></div>
          <div class="stat"><div class="lbl">Codes issued</div><div class="v">${coded}</div><div class="n">Target: ${VLR.CONFIG.ops.kybTatHours}h from document completeness</div></div>
          <div class="stat ${blocked ? '' : 'hl'}"><div class="lbl">Disclosure approved</div><div class="v">${coded - blocked}<span style="font-size:14px;color:var(--text-faint)"> / ${coded}</span></div><div class="n">${blocked ? blocked + ' code(s) cannot go live' : 'Every issued code renders a real figure'}</div></div>
          <div class="stat"><div class="lbl">Year-1 AUM targeted</div><div class="v">${VLR.fmt.usdShort(aum)}</div><div class="n">Combined across the book</div></div>`;
        })()}
      </div>

      <div class="split" style="margin-top:30px">
        <div>
          <div class="lbl">The rule</div><div class="eyebrow-rule"></div>
          <p class="muted" style="margin-top:12px;font-size:13px">No stage is "mostly done". Every gate records who approved it, when, and against what evidence.</p>
        </div>
        <div class="card">
          <div class="lbl">Gate status — ${VLR.fmt.esc(VLR.derive(p).displayName)}</div>
          <div style="margin-top:10px">
            ${VLR.readiness(p).checks.map(c => `
              <div class="gate-row">
                <div class="gate-dot ${c.ok ? 'ok' : 'no'}">${c.ok ? '✓' : '!'}</div>
                <div><div class="t">${VLR.fmt.esc(c.label)}</div><div class="w">${VLR.fmt.esc(c.why)}</div></div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  }

  /* -- Setup — the drop-in form ------------------------------------------ */
  function vSetup(p) {
    const d = VLR.derive(p);
    const f = (label, key, type, hint, attrs) => {
      /* Percentage fields are stored as fractions and edited as percentages. */
      const isPct = /data-pct/.test(attrs || '');
      const raw = p[key];
      const shown = raw == null || raw === '' ? ''
        : (isPct ? Math.round(raw * 1000) / 10 : raw);
      return `
      <div class="field">
        <label class="lbl">${label}</label>
        <input type="${type || 'text'}" data-k="${key}" value="${VLR.fmt.esc(shown)}" ${attrs || ''}>
        ${hint ? `<div class="hint">${hint}</div>` : ''}
      </div>`;
    };
    const sel = (label, key, opts, hint) => `
      <div class="field">
        <label class="lbl">${label}</label>
        <select data-k="${key}">${opts.map(o => `<option value="${o[0]}" ${p[key] === o[0] ? 'selected' : ''}>${VLR.fmt.esc(o[1])}</option>`).join('')}</select>
        ${hint ? `<div class="hint">${hint}</div>` : ''}
      </div>`;
    const ta = (label, key, hint) => `
      <div class="field"><label class="lbl">${label}</label>
        <textarea data-k="${key}">${VLR.fmt.esc(p[key] || '')}</textarea>
        ${hint ? `<div class="hint">${hint}</div>` : ''}</div>`;

    return `<div class="sheet">
      ${head('Partner details', 'Paste it once. <em>Everything else generates.</em>',
        'This is the only place partner data is entered. The agreement, term sheet, calendar, microsite, cards, collateral, emails and the client-facing referral disclosure are all derived from what is on this page.')}

      <fieldset>
        <div class="fs-head"><div class="lbl">01 · Entity</div><div class="eyebrow-rule"></div>
          <h3>Who you are contracting with</h3>
          <p>As it appears on the certificate of incorporation. The legal name goes straight into §1 of the agreement.</p></div>
        <div class="grid g2">
          <div>${f('Legal name', 'legalName', 'text', 'Exactly as registered.')}</div>
          <div>${f('Trading name', 'tradingName', 'text', 'Used on collateral and the microsite.')}</div>
        </div>
        ${ta('Registered address', 'registeredAddress')}
        <div class="grid g4">
          <div>${f('CIN', 'cin')}</div><div>${f('PAN', 'pan')}</div>
          <div>${f('GST', 'gst')}</div><div>${f('Incorporated', 'incorporationDate', 'date')}</div>
        </div>
        <div class="grid g3">
          <div>${sel('Segment', 'segment', Object.entries(VLR.CONFIG.segments).map(([k, v]) => [k, v.label]))}</div>
          <div>${sel('Contracting entity', 'contractingEntity', Object.entries(VLR.CONFIG.entities).map(([k, v]) => [k, v.legalName]), 'Decides governing law, arbitration seat and the licence line on every document.')}</div>
          <div>${f('Slug', 'slug', 'text', `Microsite: ${VLR.fmt.esc(d.micrositeUrl)}`)}</div>
        </div>
        <div class="grid g2">
          <div>${f('Website', 'website')}</div>
          <div>${f('Cities', 'cities')}</div>
        </div>
        ${ta('Regulatory registrations held', 'regRegistrations', 'Type, number and validity. Feeds the KYB risk rating.')}
      </fieldset>

      <fieldset>
        <div class="fs-head"><div class="lbl">02 · Signature and contacts</div><div class="eyebrow-rule"></div>
          <h3>Who signs, and who we chase</h3>
          <p>The signatory must match the board resolution. The notice email in §17.4 is taken from the signatory.</p></div>
        <div class="grid g4">
          <div>${f('Signatory name', 'signatoryName')}</div><div>${f('Signatory title', 'signatoryTitle')}</div>
          <div>${f('Signatory email', 'signatoryEmail', 'email')}</div><div>${f('Signatory mobile', 'signatoryMobile', 'tel')}</div>
        </div>
        <div class="grid g4">
          <div>${f('Business contact', 'businessContact')}</div><div>${f('Business email', 'businessEmail', 'email')}</div>
          <div>${f('Marketing contact', 'marketingContact')}</div><div>${f('Marketing email', 'marketingEmail', 'email')}</div>
        </div>
        <div class="grid g4">
          <div>${f('Ops contact', 'opsContact')}</div><div>${f('Ops email', 'opsEmail', 'email')}</div>
          <div>${f('Compliance contact', 'complianceContact')}</div><div>${f('Compliance email', 'complianceEmail', 'email')}</div>
        </div>
      </fieldset>

      <fieldset>
        <div class="fs-head"><div class="lbl">03 · Email IDs and visiting cards</div><div class="eyebrow-rule"></div>
          <h3>Who needs a Valura mailbox and a card</h3>
          <p>This is the list we ask for on the kickoff call at D+1 and hand over at D+5 — both are dated items in the calendar. We create the mailboxes; the partner configures nothing.</p></div>
        <div class="grid g2" style="margin-bottom:14px">
          <div>${f('Address format', 'emailFormat', 'text', `Renders as <span class="mono">${VLR.fmt.esc(VLR.Doc.emailFor(p, { name: 'Firstname Lastname' }))}</span>`)}</div>
          <div>${f('Portal seats', 'portalSeats', 'number', `Tier default is ${d.t.portalSeats}. Leave blank to inherit.`)}</div>
        </div>
        <div id="people">
          ${(p.people || []).map((x, i) => `
            <div class="person">
              <div class="row">
                <div><label class="lbl">Name</label><input type="text" data-pk="${i}:name" value="${VLR.fmt.esc(x.name || '')}"></div>
                <div><label class="lbl">Title</label><input type="text" data-pk="${i}:title" value="${VLR.fmt.esc(x.title || '')}"></div>
                <div><label class="lbl">Mobile</label><input type="text" data-pk="${i}:mobile" value="${VLR.fmt.esc(x.mobile || '')}"></div>
                <div><button class="btn sm ghost" data-act="rm-person" data-i="${i}">Remove</button></div>
              </div>
              <div class="opts">
                <label class="check"><input type="checkbox" data-pk="${i}:wantsEmailId" ${x.wantsEmailId ? 'checked' : ''}>
                  <span>Needs a mailbox — <span class="mono">${VLR.fmt.esc(VLR.Doc.emailFor(p, x) || '—')}</span></span></label>
                <label class="check"><input type="checkbox" data-pk="${i}:wantsCard" ${x.wantsCard ? 'checked' : ''}><span>Needs visiting cards</span></label>
                <label class="check" style="max-width:150px"><span class="lbl" style="padding-top:4px">Qty</span>
                  <input type="number" data-pk="${i}:cardQty" value="${x.cardQty || 0}" style="width:80px"></label>
              </div>
            </div>`).join('')}
        </div>
        <button class="btn sm" data-act="add-person">+ Add person</button>
      </fieldset>

      <fieldset>
        <div class="fs-head"><div class="lbl">04 · Brand kit</div><div class="eyebrow-rule"></div>
          <h3>Drop the logo in</h3>
          <p>The partner mark occupies the partner slot of the lockup only. It never replaces Valura's page background, ink or accent — that is Schedule D.2.3, not a style preference.</p></div>
        <div class="grid g4">
          <div>
            <label class="lbl">Logo — for light backgrounds</label>
            <div class="drop" data-drop="logoLight" style="margin-top:6px">
              ${p.logoLight ? `<img src="${p.logoLight}" alt="">` : '<div class="lbl">Click or drop · PNG / SVG</div>'}
              ${p.logoLight ? '<span class="lbl">Replace</span>' : ''}
            </div>
          </div>
          <div>
            <label class="lbl">Logo — for the ink band</label>
            <div class="drop dark" data-drop="logoDark" style="margin-top:6px">
              ${p.logoDark ? `<img src="${p.logoDark}" alt="">` : '<div class="lbl" style="color:rgba(233,241,236,.5)">Click or drop · white version</div>'}
              ${p.logoDark ? '<span class="lbl" style="color:rgba(233,241,236,.5)">Replace</span>' : ''}
            </div>
          </div>
          <div>
            <label class="lbl">Primary colour</label>
            <input type="color" class="swatch" data-k="primaryHex" value="${VLR.fmt.esc(p.primaryHex)}" style="margin-top:6px">
            <input type="text" class="mono" data-k="primaryHex" value="${VLR.fmt.esc(p.primaryHex)}" style="margin-top:6px">
          </div>
          <div>
            <label class="lbl">Secondary colour</label>
            <input type="color" class="swatch" data-k="secondaryHex" value="${VLR.fmt.esc(p.secondaryHex)}" style="margin-top:6px">
            <input type="text" class="mono" data-k="secondaryHex" value="${VLR.fmt.esc(p.secondaryHex)}" style="margin-top:6px">
          </div>
        </div>
        <div class="grid g3" style="margin-top:4px">
          <div>${sel('Lockup', 'lockup', [['side', 'Side by side'], ['stacked', 'Stacked']])}</div>
          <div>${f('Tagline', 'tagline')}</div>
          <div>${f('Languages clients read in', 'languages', 'text', 'Decides whether collateral is produced once or four times.')}</div>
        </div>
        <div class="grid g2" style="margin-top:4px">
          <div>${f('Logo URL — light background', 'logoLightUrl', 'url', 'For <b>email only</b>. Mail clients drop embedded images, so a co-branded email needs the mark at a real https address. Without one the email falls back to the partner name in type rather than a broken image.')}</div>
          <div>${f('Logo URL — dark background', 'logoDarkUrl', 'url', 'Used on the ink band at the top of every co-branded email.')}</div>
        </div>
        ${(p.logoLight || p.logoDark) && !(p.logoLightUrl || p.logoDarkUrl)
          ? `<div class="banner warn"><div><b>The uploaded logo will not appear in email.</b> It is embedded in the file, which is fine for the microsite, the cards and every PDF — but Gmail and Outlook strip embedded images. Host the mark somewhere public and paste the URL above, and the co-branded emails will carry it.</div></div>`
          : ''}
      </fieldset>

      <fieldset>
        <div class="fs-head"><div class="lbl">05 · Commercial terms</div><div class="eyebrow-rule"></div>
          <h3>Tier, shares and the signature date</h3>
          <p>Leave a share blank to inherit the tier default. Every share is a percentage of revenue Valura actually collects, so the margin cannot go negative.</p></div>
        <div class="grid g4">
          <div>${sel('Tier', 'tier', Object.entries(VLR.CONFIG.tiers).map(([k, v]) => [k, v.label]))}</div>
          <div>${f('Effective date — Day 0', 'effectiveDate', 'date', 'The whole calendar dates from this.')}</div>
          <div>${f('Partner code', 'partnerCode', 'text', 'Issued on KYB approval.')}
            <button class="btn sm ghost" data-act="issue-code" style="margin-top:-8px">Issue code</button></div>
          <div>${f('Anchor partner code', 'anchorPartnerCode', 'text', 'If this is a sub-partner.')}</div>
        </div>
        <div class="grid g4">
          <div>${f('Platform fee share %', 'platformSharePct', 'number', `Tier default ${VLR.fmt.pct(d.t.platformSharePct, 0)}`, 'step="1" min="0" max="100" data-pct="1"')}</div>
          <div>${f('Brokerage share %', 'brokerageSharePct', 'number', `Tier default ${VLR.fmt.pct(d.t.brokerageSharePct, 0)}`, 'step="1" min="0" max="100" data-pct="1"')}</div>
          <div>${f('Placement share %', 'placementSharePct', 'number', `Tier default ${VLR.fmt.pct(d.t.placementSharePct, 0)}`, 'step="1" min="0" max="100" data-pct="1"')}</div>
          <div>${f('Tail months', 'tailMonths', 'number', d.tailMonths == null ? 'Blank at Anchor = perpetual' : `Tier default ${d.t.tailMonths}`)}</div>
        </div>
        <div class="grid g4">
          <div>${f('Year-1 AUM target USD', 'aumTargetUsd', 'number')}</div>
          <div>${f('Client target', 'clientTarget', 'number')}</div>
          <div>${f('Average ticket USD', 'avgTicketUsd', 'number')}</div>
          <div>${f('Monthly running cost USD', 'monthlyCostUsd', 'number')}</div>
        </div>
        <div class="grid g4">
          <div>${f('Rotation %', 'rotation', 'number', 'Annual portfolio turnover.', 'step="5" min="0" max="300" data-pct="1"')}</div>
          <div>${f('GIFT City / external funds %', 'giftCityShare', 'number', 'Exempt from the platform fee.', 'step="5" min="0" max="100" data-pct="1"')}</div>
          <div>${f('Placements per year USD', 'placementsPerYearUsd', 'number')}</div>
          <div>${sel('Placement mix', 'placementMix', Object.entries(VLR.CONFIG.placementEconomics).map(([k, v]) => [k, v.label]))}</div>
        </div>
        <div class="grid g3">
          <div>${f('USD bank', 'bankName')}</div><div>${f('Account', 'bankAccount')}</div><div>${f('SWIFT', 'swift')}</div>
        </div>
      </fieldset>

      <fieldset>
        <div class="fs-head"><div class="lbl">06 · Compliance and logistics</div><div class="eyebrow-rule"></div>
          <h3>Captured now, because it cannot be captured later</h3>
          <p>The Pre-Existing Clients declaration is the Clause 12.2 carve-out. After a disagreement starts it is unprovable.</p></div>
        ${ta('Pre-Existing Clients declaration', 'preExistingClients', 'Clients under an advisory relationship before their introduction to Valura.')}
        <div class="grid g2">
          <div>${ta('Other platforms distributed for', 'otherPlatforms')}</div>
          <div>${ta('Regulatory action, last five years', 'regulatoryAction')}</div>
        </div>
        ${ta('Shipping address for the kit', 'shippingAddress')}
        <div class="grid g3">
          <div>${f('Client segments served', 'clientSegments')}</div>
          <div>${f('Marketing budget INR', 'marketingBudgetInr', 'number')}</div>
          <div>${f('Welcome kits', 'welcomeKitQty', 'number')}</div>
        </div>
        <div class="grid g2" style="margin-top:10px">
          <label class="check"><input type="checkbox" data-kbool="trademarkLicenceSigned" ${p.trademarkLicenceSigned ? 'checked' : ''}>
            <span><b>Schedule D trademark licence signed</b><br><span class="faint" style="font-size:11.5px">Required before the microsite or any co-branded collateral may publish.</span></span></label>
          <label class="check"><input type="checkbox" data-kbool="disclosureApproved" ${p.disclosureApproved ? 'checked' : ''}>
            <span><b>Referral disclosure approved by Compliance</b><br><span class="faint" style="font-size:11.5px">Hard gate. A code cannot go live without it.</span></span></label>
        </div>
        <div class="grid g2" style="margin-top:12px">
          <div>${f('Certified on', 'certifiedAt', 'date')}</div>
          <div>${f('Exam score %', 'examScore', 'number', `Pass mark ${VLR.CONFIG.examPassMark}%`)}</div>
        </div>
      </fieldset>

      <fieldset>
        <div class="fs-head"><div class="lbl">07 · Connections</div><div class="eyebrow-rule"></div>
          <h3>Zoho Sign and Resend</h3>
          <p>Held on this machine, not in the partner record. The Hub renders and prints everything without them; they are needed only to put an agreement out for signature or to send a drafted message.</p></div>
        <div class="grid g3">
          <div class="field">
            <label class="lbl">Deployment URL</label>
            <input type="text" id="conn-base" value="${VLR.fmt.esc(VLR.Api.get().base || '')}" placeholder="https://valura-partner-hub.vercel.app">
            <div class="hint">Leave blank when the Hub is served from the deployment itself. Set it when you have opened this file from disk.</div>
          </div>
          <div class="field">
            <label class="lbl">Hub API key</label>
            <input type="password" id="conn-key" value="${VLR.fmt.esc(VLR.Api.get().key || '')}" placeholder="HUB_API_KEY">
            <div class="hint">The same value as <span class="mono">HUB_API_KEY</span> in the Vercel project settings.</div>
          </div>
          <div class="field">
            <label class="lbl">Valura signatory email</label>
            <input type="email" id="conn-valura-email" value="${VLR.fmt.esc(VLR.Api.get().valuraEmail || '')}" placeholder="priyesh@valura.ai">
            <div class="hint">Where the counter-signature request goes.</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <button class="btn sm" data-act="conn-save">Save connection</button>
          <button class="btn sm ghost" data-act="conn-test">Test</button>
          <span id="conn-result" class="muted" style="font-size:12px"></span>
        </div>
      </fieldset>

      <div class="docbar no-print">
        <button class="btn ghost" data-act="delete">Delete partner</button>
        <div class="spacer"></div>
        <button class="btn ghost" data-act="export">Export JSON</button>
        <button class="btn p" data-act="goto:pack">See the generated pack</button>
      </div>
    </div>`;
  }

  /* -- Calendar ----------------------------------------------------------- */
  function vCalendar(p) {
    const d = VLR.derive(p);
    if (!p.effectiveDate) {
      return `<div class="sheet">${head('Activation calendar', 'Set a signature date, <em>and the programme dates itself</em>.')}
        <div class="banner warn"><div><b>No effective date.</b> Day 0 is the signature date. Set it in Partner details and the entire 90-day programme, the launch campaign and the contractual statement deadlines all compute from it.</div></div>
        <button class="btn p" data-act="goto:setup">Set the signature date</button></div>`;
    }
    const cal = VLR.Cal.build(p);
    /* The grid covers the activation window itself. Statement deadlines can
       sit a year out; they stay on the timeline rather than adding empty
       month cards.                                                          */
    const months = [...new Set(cal.events.filter(e => e.d <= 95)
      .map(e => e.date.getFullYear() * 12 + e.date.getMonth()))].sort((a, b) => a - b);
    const todayIso = VLR.fmt.iso(new Date());

    return `<div class="sheet wide">
      ${head('Activation calendar', 'Thirty days, <em>every one of them dated</em>.',
        `Generated from the signature date of ${VLR.fmt.date(p.effectiveDate)}. Change that date and everything below moves with it — including the contractual quarterly-statement deadline under Clause 5.3.2.`)}

      <div class="docbar">
        <span class="chip go dot">Green — programme milestone</span>
        <span class="chip ink dot">Ink — hard deadline</span>
        <span class="chip dot">Grey — no event</span>
        <div class="spacer"></div>
        <button class="btn sm" data-act="ics">Download .ics</button>
        <button class="btn sm" data-act="print">Print / PDF</button>
      </div>

      <div class="cal-months">
        ${months.slice(0, 4).map(k => {
          const y = Math.floor(k / 12), m = k % 12;
          const first = new Date(y, m, 1);
          const days = new Date(y, m + 1, 0).getDate();
          const lead = (first.getDay() + 6) % 7;
          const cells = [];
          for (let i = 0; i < lead; i++) cells.push('<div class="cal-d out"></div>');
          for (let dd = 1; dd <= days; dd++) {
            const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
            const evs = cal.events.filter(e => e.iso === iso);
            const hard = evs.some(e => e.hard);
            const d0 = iso === p.effectiveDate;
            cells.push(`<div class="cal-d ${d0 ? 'd0' : (hard ? 'hard' : (evs.length ? 'has' : ''))} ${iso === todayIso ? 'today' : ''}"
              ${evs.length ? `title="${VLR.fmt.esc(evs.map(e => e.title).join(' · '))}"` : ''}>${dd}</div>`);
          }
          return `<div class="cal-m">
            <h4>${first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h4>
            <div class="cal-grid">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(x => `<div class="cal-dow">${x}</div>`).join('')}${cells.join('')}</div>
          </div>`;
        }).join('')}
      </div>

      <div style="margin-top:36px" class="split">
        <div>
          <div class="lbl">What we ask, and when</div><div class="eyebrow-rule"></div>
          <p class="muted" style="font-size:13px;margin-top:12px">Two items on this calendar are asks, not deliverables: the email-ID list at D+1 and the intake pack at D+3. Everything Valura hands back is dated against them.</p>
          <div class="card tint" style="margin-top:16px">
            <div class="lbl">D+1 · we ask</div>
            <h3 style="margin-top:6px">Who needs a Valura email address?</h3>
            <p class="muted" style="font-size:12.5px;margin:8px 0 0">Name, title, mobile, mailbox or card or both. Due back with the intake form at D+3.</p>
            <div class="rule" style="margin:14px 0"></div>
            <div class="lbl">D+5 · we hand over</div>
            <h3 style="margin-top:6px">Mailboxes created, credentials issued</h3>
            <p class="muted" style="font-size:12.5px;margin:8px 0 0">Alongside the partner code and portal logins. Valura manages DNS and MX; the partner configures nothing.</p>
            ${(p.people || []).filter(x => x.wantsEmailId && x.name).length ? `
              <div class="rule" style="margin:14px 0"></div>
              <div class="lbl">On the list so far</div>
              <table class="t" style="margin-top:8px">
                <tbody>${p.people.filter(x => x.wantsEmailId && x.name).map(x =>
                  `<tr><td>${VLR.fmt.esc(x.name)}</td><td class="mono" style="font-size:11px">${VLR.fmt.esc(VLR.Doc.emailFor(p, x))}</td></tr>`).join('')}</tbody>
              </table>` : ''}
          </div>
        </div>

        <div>
          <div class="lbl">The programme</div><div class="eyebrow-rule"></div>
          <div class="tl" style="margin-top:20px">
            ${(() => {
              let lastStage = null;
              return cal.events.map(e => {
                const sep = e.stage !== lastStage ? (() => { lastStage = e.stage;
                  return `<div class="tl-sep"><span class="lbl">${VLR.fmt.esc(e.stageLabel)}</span><hr class="rule"></div>`; })() : '';
                return sep + `<div class="tl-e ${e.hard ? 'hard' : ''} ${e.ask ? 'ask' : ''} ${e.k === 'd0_exec' ? 'd0' : ''}">
                  <div class="day"><b>${VLR.fmt.dateShort(e.date)}</b><span>D${e.d >= 0 ? '+' : ''}${e.d}</span></div>
                  <div class="body">
                    <div class="ttl">${VLR.fmt.esc(e.title)}</div>
                    <div class="det">${VLR.fmt.esc(e.detail)}</div>
                    <div class="meta">
                      <span class="chip">${VLR.fmt.esc(e.ownerLabel)}</span>
                      ${e.at ? `<span class="chip">${VLR.fmt.esc(e.at)} · ${e.hrs}h</span>` : ''}
                      ${e.touch ? `<span class="chip">Touch ${VLR.fmt.esc(e.touch)}</span>` : ''}
                      ${e.hard ? '<span class="chip stop">Hard deadline</span>' : ''}
                      ${e.ask ? '<span class="chip go">We ask the partner</span>' : ''}
                      ${e.statement ? '<span class="chip warn">Contractual · Clause 5.3.2</span>' : ''}
                    </div>
                  </div>
                </div>`;
              }).join('');
            })()}
          </div>
        </div>
      </div>
    </div>`;
  }

  /* -- Pricing & revenue share -------------------------------------------- */
  function vPricing(p) {
    const d = VLR.derive(p);
    const C = VLR.CONFIG, P = C.pricing;
    const pr = VLR.Econ.pricingFor(p);
    const bps = n => Number(n).toFixed(Number(n) % 1 === 0 ? 0 : 1);
    const all = [...pr.brokerage, pr.platform, pr.placement];
    const markup = all.reduce((s, l) => s + l.markupOverBaselineBps, 0);
    const nonStandard = all.filter(l => Math.abs(l.split - P.defaultSplit) > 1e-9);

    const slider = (l, per) => `
      <tr${Math.abs(l.split - P.defaultSplit) > 1e-9 ? ' style="background:var(--brand-tint)"' : ''}>
        <td><b>${VLR.fmt.esc(l.label)}</b></td>
        <td class="num">${bps(l.costBps)}</td>
        <td class="num">${bps(l.valuraKeepsBps)}</td>
        <td style="width:186px">
          <div class="inline" style="gap:8px">
            <input type="range" min="0" max="80" step="5" value="${Math.round(l.split * 100)}"
                   data-split="${l.key}" style="flex:1;accent-color:var(--brand)">
            <input type="number" min="0" max="80" step="1" value="${Math.round(l.split * 100)}"
                   data-split="${l.key}" class="mono" style="width:58px;flex:none;text-align:right">
          </div>
        </td>
        <td class="num" style="color:var(--brand-deep)"><b>${bps(l.partnerEarnsBps)}</b></td>
        <td class="num">${bps(l.shareableBps)}</td>
        <td class="num"><b>${bps(l.clientPaysBps)}</b>${per ? ' <span class="faint">' + per + '</span>' : ''}</td>
        <td class="num" style="color:${l.markupOverBaselineBps > 0.01 ? 'var(--down)' : 'var(--text-faint)'}">
          ${l.markupOverBaselineBps > 0.01 ? '+' + bps(l.markupOverBaselineBps) : '—'}</td>
      </tr>`;

    return `<div class="sheet wide">
      ${head('Pricing & revenue share', 'Set the split. <em>Watch the client price move.</em>',
        `Cost plus a mark-up, not a slice of a fixed fee. Every product carries a hard cost and a fixed amount Valura keeps; the partner's split is applied on top. Raise it and the partner earns more and their client pays more — Valura's retained margin never moves, which is exactly why this can be negotiated in the open.`)}

      <div class="grid g4" style="margin-bottom:22px">
        <div class="stat hl"><div class="lbl">Blended partner rate</div>
          <div class="v">${VLR.fmt.pct(VLR.Econ.blendedFromPricing(p).blended, 3)}</div>
          <div class="n">Per annum on the book, at this asset mix. Drives the P&amp;L.</div></div>
        <div class="stat"><div class="lbl">Equity — client pays</div>
          <div class="v">${bps(pr.brokerage[0].clientPaysBps)}<span style="font-size:13px;color:var(--text-faint)"> bps</span></div>
          <div class="n">Partner earns ${bps(pr.brokerage[0].partnerEarnsBps)} · Valura keeps ${bps(pr.brokerage[0].valuraKeepsBps)}</div></div>
        <div class="stat"><div class="lbl">Platform — client pays</div>
          <div class="v">${bps(pr.platform.clientPaysBps)}<span style="font-size:13px;color:var(--text-faint)"> bps p.a.</span></div>
          <div class="n">Cost ${bps(pr.platform.costBps)} · Valura keeps ${bps(pr.platform.valuraKeepsBps)}</div></div>
        <div class="stat ${markup > 0.01 ? 'hl' : ''}"><div class="lbl">Above the standard split</div>
          <div class="v">${markup > 0.01 ? '+' + bps(markup) : '—'}<span style="font-size:13px;color:var(--text-faint)">${markup > 0.01 ? ' bps' : ''}</span></div>
          <div class="n">${markup > 0.01 ? 'Total extra the clients of this partner pay' : `Every product at the standard ${VLR.fmt.pct(P.defaultSplit, 0)}`}</div></div>
      </div>

      ${nonStandard.length ? `<div class="banner warn"><div><b>${nonStandard.length} product${nonStandard.length > 1 ? 's are' : ' is'} priced away from the standard ${VLR.fmt.pct(P.defaultSplit, 0)}.</b>
        ${VLR.fmt.esc(nonStandard.map(l => l.label + ' at ' + Math.round(l.split * 100) + '%').join(', '))}.
        The clients of this partner pay more than the clients of a standard partner, and the amount this partner earns is disclosed to each of them before their account is opened.</div></div>` : ''}

      <div class="card" style="margin-bottom:20px">
        <div class="lbl">Assign the split — ${VLR.fmt.esc(d.displayName)}</div><div class="eyebrow-rule"></div>
        <table class="t" style="margin-top:14px">
          <thead><tr>
            <th>Product</th><th class="num">Cost</th><th class="num">Valura keeps</th>
            <th>Partner split</th><th class="num">Partner earns</th><th class="num">Shareable</th>
            <th class="num">Client pays</th><th class="num">vs standard</th>
          </tr></thead>
          <tbody>
            <tr><td colspan="8" class="lbl" style="background:var(--paper-2);padding:6px 10px">Brokerage — per trade on the amount transacted</td></tr>
            ${pr.brokerage.map(l => slider(l)).join('')}
            <tr><td colspan="8" class="lbl" style="background:var(--paper-2);padding:6px 10px">Platform fee — per year on assets held</td></tr>
            ${slider(pr.platform, 'p.a.')}
            <tr><td colspan="8" class="lbl" style="background:var(--paper-2);padding:6px 10px">Placement — pre-IPO and private markets</td></tr>
            ${slider(pr.placement, 'per deal')}
          </tbody>
        </table>
        <div class="inline" style="margin-top:14px;justify-content:flex-start">
          <button class="btn sm ghost" data-act="split-reset" style="flex:none">Reset to standard ${VLR.fmt.pct(P.defaultSplit, 0)}</button>
          <button class="btn sm" data-act="split-agree" style="flex:none">Mark as agreed</button>
          <span class="muted" style="flex:none;font-size:12px">${p.splitsAgreedAt
            ? `Agreed ${VLR.fmt.date(p.splitsAgreedAt)} by ${VLR.fmt.esc(p.splitsAgreedBy || '—')}`
            : 'Not yet agreed — Schedule A shows these as proposed.'}</span>
        </div>
      </div>

      <div class="split">
        <div>
          <div class="lbl">The arithmetic</div><div class="eyebrow-rule"></div>
          <p class="muted" style="font-size:13px;margin-top:12px">
            <span class="mono" style="font-size:12px">partner = keeps × split ÷ (1 − split)</span><br><br>
            At ${VLR.fmt.pct(P.defaultSplit, 0)} the partner earns exactly what Valura keeps. At 60% they earn 1.5× it,
            and the extra is added to the client price. Nothing is taken from Valura's margin, and nothing
            is taken from any other party in the chain.</p>
          <p class="muted" style="font-size:13px">${VLR.fmt.esc(P.exempt)}</p>
        </div>
        <div class="card sunken">
          <div class="lbl">What each split does to equity brokerage</div><div class="eyebrow-rule"></div>
          <table class="t" style="margin-top:12px">
            <thead><tr><th class="num">Split</th><th class="num">Partner earns</th><th class="num">Client pays</th><th class="num">Valura keeps</th></tr></thead>
            <tbody>${[0.30, 0.40, 0.50, 0.60, 0.70, 0.75].map(s => {
              const l = VLR.Econ.priceLine(C.pricing.brokerage[0], s);
              const on = Math.abs(s - pr.brokerage[0].split) < 1e-9;
              return `<tr${on ? ' style="background:var(--brand-tint);font-weight:600"' : ''}>
                <td class="num">${VLR.fmt.pct(s, 0)}</td>
                <td class="num">${bps(l.partnerEarnsBps)} bps</td>
                <td class="num">${bps(l.clientPaysBps)} bps</td>
                <td class="num">${bps(l.valuraKeepsBps)} bps</td></tr>`;
            }).join('')}</tbody>
          </table>
          <p class="faint" style="font-size:11.5px;margin-top:10px">Valura's column does not move. That is the structure working.</p>
        </div>
      </div>

      ${tabs('pricing', [{ k: 'sheet', label: 'Pricing sheet — as issued' }])}
      <div class="stage-wrap" id="print-area">${VLR.Doc.pricingSheet(p)}</div>
    </div>`;
  }

  /* -- Economics ---------------------------------------------------------- */
  function vEconomics(p) {
    const d = VLR.derive(p);
    const C = VLR.CONFIG;
    const at = p.aumTargetUsd || d.t.aumTargetY1Usd;
    const r = VLR.Econ.recurring({ aum: at, tierKey: p.tier, rotation: p.rotation, giftCityShare: p.giftCityShare,
      platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct });
    /* What the legacy v1.0 template would have paid on the same book */
    const legacy = at * (1 - 0) * 0.0035 + 0;    // fixed 0.35% p.a., no exemption recognised
    const legacyCollected = at * (1 - p.giftCityShare) * C.clientSchedule.platformFeePct;

    return `<div class="sheet">
      ${head('Earnings illustrator', 'One calculation. <em>Every document.</em>',
        'The term sheet, §6 of the agreement, the one-pager, the business plan, the quarterly statement and the client referral disclosure all call this function. They cannot disagree, because there is nothing to disagree with.')}

      <div class="grid g4">
        <div class="stat hl"><div class="lbl">Annual recurring at target</div><div class="v">${VLR.fmt.usd(r.partnerTotal)}</div><div class="n">${VLR.fmt.inr(r.partnerTotal * C.ops.fxUsdInr)} at ₹${C.ops.fxUsdInr}</div></div>
        <div class="stat"><div class="lbl">Effective yield on AUM</div><div class="v">${VLR.fmt.pct(r.partnerYieldOnAum)}</div><div class="n">On ${VLR.fmt.usdShort(at)} referred</div></div>
        <div class="stat"><div class="lbl">Valura retains</div><div class="v">${VLR.fmt.usd(r.valuraTotal)}</div><div class="n">Margin ${VLR.fmt.pct(r.valuraMarginPct, 0)} — positive by construction</div></div>
        <div class="stat"><div class="lbl">Fee-exempt assets</div><div class="v">${VLR.fmt.usdShort(r.exemptAum)}</div><div class="n">GIFT City and external funds — no platform-fee share arises</div></div>
      </div>

      <div class="banner" style="margin-top:24px"><div>
        <b>Defect #1, fixed.</b> On this same book, the executed v1.0 template would have paid a fixed
        ${VLR.fmt.pct(0.0035)} p.a. — ${VLR.fmt.usd(legacy)} — out of a platform fee that actually collects
        ${VLR.fmt.usd(legacyCollected)}. That is ${VLR.fmt.usd(legacy - legacyCollected)} of negative margin on the platform-fee leg alone,
        before brokerage, and it gets worse as the share of GIFT City fund AUM rises. v2.0 pays
        ${VLR.fmt.pct(d.platformSharePct, 0)} of what is collected instead, so the same arithmetic cannot recur.
      </div></div>

      <div class="split-r" style="margin-top:26px">
        <div class="card">
          <div class="lbl">The ladder</div><div class="eyebrow-rule"></div>
          <table class="t" style="margin-top:14px">
            <thead><tr><th>Referred AUM</th><th class="num">Platform leg</th><th class="num">Brokerage leg</th><th class="num">Annual</th><th class="num">In INR</th><th class="num">Yield</th></tr></thead>
            <tbody>${VLR.Econ.ladder({ tierKey: p.tier, rotation: p.rotation, giftCityShare: p.giftCityShare,
              platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct }).map(l => `
              <tr><td class="num" style="text-align:left">${VLR.fmt.usd(l.aum)}</td>
                <td class="num">${VLR.fmt.usd(l.detail.platformToPartner)}</td>
                <td class="num">${VLR.fmt.usd(l.detail.brokerageToPartner)}</td>
                <td class="num"><b>${VLR.fmt.usd(l.annual)}</b></td>
                <td class="num">${VLR.fmt.inr(l.annual * C.ops.fxUsdInr)}</td>
                <td class="num">${VLR.fmt.pct(l.yield)}</td></tr>`).join('')}
            </tbody>
          </table>

          <div class="lbl" style="margin-top:26px">Placement income</div><div class="eyebrow-rule"></div>
          <table class="t" style="margin-top:14px">
            <thead><tr><th>Asset class</th><th class="num">Valura net, typical</th><th class="num">Partner rate</th><th class="num">Ceiling</th><th class="num">On ${VLR.fmt.usdShort(1000000)}</th></tr></thead>
            <tbody>${VLR.Econ.placement({ tierKey: p.tier, placementSharePct: d.placementSharePct }).map(x => `
              <tr><td>${VLR.fmt.esc(x.label)}</td>
                <td class="num">${VLR.fmt.pct(x.valuraNetTypical)}</td>
                <td class="num"><b>${VLR.fmt.pct(x.partnerRate)}</b>${x.cappedByCeiling ? ' <span class="faint">capped</span>' : ''}</td>
                <td class="num">${VLR.fmt.pct(x.ceiling)}</td>
                <td class="num">${VLR.fmt.usd(1000000 * x.partnerRate)}</td></tr>`).join('')}
            </tbody>
          </table>

          ${d.isAnchor ? `
            <div class="lbl" style="margin-top:26px">Anchor override on the network</div><div class="eyebrow-rule"></div>
            <table class="t" style="margin-top:14px">
              <thead><tr><th>Network AUM</th><th class="num">Sub-partner earns</th><th class="num">Your override</th><th class="num">Valura retains</th></tr></thead>
              <tbody>${VLR.Econ.overrideLadder({ rotation: p.rotation, giftCityShare: p.giftCityShare, overridePct: d.overridePct }).map(o => `
                <tr><td class="num" style="text-align:left">${VLR.fmt.usd(o.networkAum)}</td>
                  <td class="num">${VLR.fmt.usd(o.detail.subPartnerEarns)}</td>
                  <td class="num"><b>${VLR.fmt.usd(o.annual)}</b></td>
                  <td class="num">${VLR.fmt.usd(o.detail.valuraRetainsAfterOverride)}</td></tr>`).join('')}
              </tbody>
            </table>` : ''}
        </div>

        <div>
          <div class="card sunken">
            <div class="lbl">Inputs</div><div class="eyebrow-rule"></div>
            <table class="t" style="margin-top:12px">
              <tbody>
                <tr><td>Client platform fee</td><td class="num">${VLR.fmt.pct(C.clientSchedule.platformFeePct)}</td></tr>
                <tr><td>Client brokerage, gross</td><td class="num">${VLR.fmt.pct(C.clientSchedule.grossBrokeragePct)}</td></tr>
                <tr><td>Valura retains, net</td><td class="num">${VLR.fmt.pct(C.clientSchedule.netBrokerageRetainedPct)}</td></tr>
                <tr><td>Your platform share</td><td class="num">${VLR.fmt.pct(d.platformSharePct, 0)}</td></tr>
                <tr><td>Your brokerage share</td><td class="num">${VLR.fmt.pct(d.brokerageSharePct, 0)}</td></tr>
                <tr><td>Rotation</td><td class="num">${VLR.fmt.pct(p.rotation, 0)}</td></tr>
                <tr><td>Fee-exempt assets</td><td class="num">${VLR.fmt.pct(p.giftCityShare, 0)}</td></tr>
              </tbody>
            </table>
            <button class="btn sm ghost" data-act="goto:setup" style="margin-top:14px;width:100%;justify-content:center">Change inputs</button>
          </div>

          <div class="card" style="margin-top:16px">
            <div class="lbl">Derivation at ${VLR.fmt.usdShort(at)}</div><div class="eyebrow-rule"></div>
            <table class="t" style="margin-top:12px">
              <tbody>
                <tr><td>Chargeable AUM</td><td class="num">${VLR.fmt.usd(r.chargeableAum)}</td></tr>
                <tr><td>Platform fee collected</td><td class="num">${VLR.fmt.usd(r.platformFeeCollected)}</td></tr>
                <tr><td>→ to partner</td><td class="num">${VLR.fmt.usd(r.platformToPartner)}</td></tr>
                <tr><td>Traded value</td><td class="num">${VLR.fmt.usd(r.tradedValue)}</td></tr>
                <tr><td>Net brokerage retained</td><td class="num">${VLR.fmt.usd(r.netRetained)}</td></tr>
                <tr><td>→ to partner</td><td class="num">${VLR.fmt.usd(r.brokerageToPartner)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;
  }

  /* -- Commercial documents ------------------------------------------------ */
  function vCommercial(p) {
    const list = [
      { k: 'term', label: 'Term sheet' }, { k: 'one', label: 'Economics one-pager' },
      { k: 'seg', label: 'Segment brief' }, { k: 'fact', label: 'Internal fact sheet' }
    ];
    const t = tabOf('commercial', list);
    const body = { term: VLR.Doc.termSheet, one: VLR.Doc.onePager, seg: VLR.Doc.segmentPage, fact: VLR.Doc.factSheet }[t](p);
    return `<div class="sheet wide">
      ${head('Term sheet & briefs', 'Initial the numbers, <em>then the contract is a signature</em>.',
        'Schedule A is locked to the term sheet. If the economics are agreed here, the contract stage stops being a second negotiation.')}
      ${tabs('commercial', list)}
      <div class="stage-wrap" id="print-area">${body}</div>
    </div>`;
  }

  /* -- Agreement ----------------------------------------------------------- */
  function vAgreement(p) {
    const d = VLR.derive(p);
    const nonStd = (p.nonStandardTerms || []);
    return `<div class="sheet wide">
      ${head('Agreement & signing', `${VLR.CONFIG.ibTerms.version} — <em>filled from the record, signed through Zoho</em>.`,
        `Every party detail, the partner's mark and the agreed revenue share come from this partner's record. Nothing is typed into the document. What goes out for signature is the Introducing Broker Agreement with Schedule A carrying the split set on the pricing tab.`)}

      <div class="grid g4" style="margin-bottom:22px">
        <div class="stat hl"><div class="lbl">Exclusivity clause</div><div class="v sm">Removed</div><div class="n">§2.6 struck on instruction. §2 now runs 2.1 to 2.5.</div></div>
        <div class="stat"><div class="lbl">Schedule A</div><div class="v sm">${VLR.fmt.pct(VLR.Econ.pricingFor(p).brokerage[0].split, 0)} on equity</div><div class="n">Live from the pricing tab — not typed into the document.</div></div>
        <div class="stat"><div class="lbl">Revenue tail</div><div class="v sm">Perpetual</div><div class="n">§8.1 — continues while the client's assets stay, whether or not the agreement is live.</div></div>
        <div class="stat"><div class="lbl">Governing law</div><div class="v sm">India · IFSCA</div><div class="n">v6 wording. Seat at GIFT City IFSC.</div></div>
      </div>

      <div class="banner warn"><div><b>One change was made to the template you supplied.</b> §2.6 — the clause reading
        &ldquo;This Agreement is non-exclusive&hellip; Valura and its affiliates may compete with the Introducing Broker in any aspect of its business&rdquo; — has been removed in full.
        The words &ldquo;non-exclusive&rdquo; remain in §2.2 and §3.1, which describe the appointment itself. Striking those too would make the appointment
        <b>exclusive</b> and commit Valura to a territory, which is a commercial decision rather than a tidy-up. Say the word if that is what you meant.</div></div>

      ${nonStd.length ? `<div class="banner stop"><div><b>${nonStd.length} non-standard term(s).</b> ${nonStd.filter(n => (n.approvals || []).length < 2).length} still awaiting a second approval. The Hub will not mark this agreement issuable until every deviation carries two.</div></div>` : ''}

      ${esignPanel(p)}

      ${(() => {
        const list = [
          { k: 'ib', label: 'Introducing Broker Agreement v6' },
          { k: 'ibsign', label: 'IB — e-sign copy' },
          { k: 'legacy', label: 'Partner Agreement v2.0 (legacy)' }
        ];
        const t = tabOf('agreement', list);
        const body = t === 'legacy'
          ? VLR.Doc.agreement(p, { showVars, esign: false })
          : VLR.Doc.introducingBroker(p, { showVars, esign: t === 'ibsign' });
        return tabs('agreement', list) + `<div class="stage-wrap" id="print-area">${body}</div>`;
      })()}
    </div>`;
  }

  /* -- Send for signature -------------------------------------------------- */
  function esignPanel(p) {
    const d = VLR.derive(p);
    const e = p.esign;
    const conn = VLR.Api.get();

    /* The same refusals the server applies, shown before the click rather
       than as an error after it.                                            */
    const blockers = [];
    if (!p.legalName) blockers.push('no legal name');
    if (!p.effectiveDate) blockers.push('no effective date');
    if (!p.signatoryName) blockers.push('no partner signatory');
    if (!p.signatoryEmail) blockers.push('no signatory email');
    if (!p.registeredAddress) blockers.push('no registered address');
    const unapproved = (p.nonStandardTerms || []).filter(n => n.text && (n.approvals || []).length < 2);
    if (unapproved.length) blockers.push(`${unapproved.length} unapproved deviation(s)`);

    if (e && e.requestId) {
      const done = e.status === 'completed';
      return `<div class="card ${done ? 'tint' : ''}" style="margin-bottom:22px">
        <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
          <div style="flex:1;min-width:280px">
            <div class="lbl">Zoho Sign</div><div class="eyebrow-rule"></div>
            <h3 style="margin-top:9px">${done ? 'Executed' : 'Out for signature'}</h3>
            <p class="muted" style="font-size:12.5px;margin:6px 0 0">
              Sent ${VLR.fmt.date(e.sentAt)} · request <span class="mono">${VLR.fmt.esc(e.requestId)}</span>
              ${e.status ? ` · status <b>${VLR.fmt.esc(e.status)}</b>` : ''}
            </p>
            ${(() => {
              const rows = e.actions || e.recipients || [];
              if (!rows.length) return '';
              /* Zoho's own words are opaque at a glance — NOACTION reads like a
                 failure when it means the opposite. Say what is true instead. */
              const plain = s => ({
                SIGNED:    ['go',   'Signed'],
                VIEWED:    ['warn', 'Opened, not yet signed'],
                UNOPENED:  ['warn', 'Emailed — not opened yet'],
                NOACTION:  ['',     'Not emailed yet — waiting their turn'],
                DECLINED:  ['stop', 'Declined'],
                RECALLED:  ['stop', 'Recalled']
              }[s] || ['', s || 'Sent']);
              const waiting = rows.find(a => a.status === 'UNOPENED' || a.status === 'VIEWED');
              const notYet = rows.filter(a => a.status === 'NOACTION');
              return `
              <table class="t" style="margin-top:12px">
                <thead><tr><th>Order</th><th>Recipient</th><th>Email</th><th>Where it is</th></tr></thead>
                <tbody>${rows.map(a => {
                  const [cls, label] = plain(a.status);
                  return `<tr>
                    <td class="num">${a.order != null ? a.order + 1 : '—'}</td>
                    <td>${VLR.fmt.esc(a.name || a.role || '')}</td>
                    <td class="mono" style="font-size:11.5px">${VLR.fmt.esc(a.email || '')}</td>
                    <td><span class="chip ${cls}">${VLR.fmt.esc(label)}</span></td></tr>`;
                }).join('')}</tbody>
              </table>
              ${waiting && notYet.length ? `<div class="banner warn" style="margin:14px 0 0"><div>
                <b>Signing is sequential, so only one person has been emailed.</b>
                It is with <b>${VLR.fmt.esc(waiting.email)}</b> now.
                ${VLR.fmt.esc(notYet.map(a => a.email).join(' and '))}
                ${notYet.length > 1 ? 'have' : 'has'} not been emailed at all yet and will not be until that signature lands —
                so there is nothing missing from ${notYet.length > 1 ? 'those inboxes' : 'that inbox'}.
                Zoho sends from a <span class="mono">@zohosign.com</span> address, not from valura.ai, so check spam.</div></div>` : ''}`;
            })()}
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;min-width:190px">
            <button class="btn sm" data-act="esign-refresh">Refresh status</button>
            ${done ? `<button class="btn sm p" data-act="esign-download">Download executed</button>`
                   : `<button class="btn sm" data-act="esign-remind">Resend the email</button>`}
            <button class="btn sm ghost" data-act="esign-clear">Detach from this record</button>
          </div>
        </div>
      </div>`;
    }

    return `<div class="card sunken" style="margin-bottom:22px">
      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:24px;align-items:start">
        <div>
          <div class="lbl">Send for signature</div><div class="eyebrow-rule"></div>
          <h3 style="margin-top:9px">Zoho Sign, counter-signed first</h3>
          <p class="muted" style="font-size:12.5px;margin:7px 0 0;max-width:62ch">
            The e-sign copy carries its signature blocks once, on a fixed final page after the schedules —
            so what is signed is the whole instrument. Valura counter-signs, then it goes to
            ${VLR.fmt.esc(p.signatoryName || 'the partner signatory')}.
          </p>
          <div class="grid g2" style="margin-top:14px">
            <div class="field">
              <label class="lbl">Valura signatory email</label>
              <input type="email" id="esign-valura-email" value="${VLR.fmt.esc(conn.valuraEmail || '')}" placeholder="priyesh@valura.ai">
              <div class="hint">Zoho sends the counter-signature request here. Signs as ${VLR.fmt.esc(d.ent.signatory.name)}.</div>
            </div>
            <div class="field">
              <label class="lbl">Expires after</label>
              <input type="number" id="esign-expiry" value="15" min="1" max="90">
              <div class="hint">Days. Zoho recalls it automatically after this.</div>
            </div>
          </div>
        </div>
        <div>
          <div class="lbl">Goes to</div>
          <table class="t" style="margin-top:10px">
            <tbody>
              <tr><td>1 · Valura</td><td class="muted">${VLR.fmt.esc(d.ent.signatory.name)}</td></tr>
              <tr><td>2 · Partner</td><td class="muted">${VLR.fmt.esc(p.signatoryName || '—')}<br><span class="mono faint" style="font-size:11px">${VLR.fmt.esc(p.signatoryEmail || 'no email')}</span></td></tr>
            </tbody>
          </table>
          ${blockers.length
            ? `<div class="banner stop" style="margin:14px 0 0"><div><b>Not ready.</b> ${VLR.fmt.esc(blockers.join(', '))}.</div></div>`
            : ''}
          ${!VLR.Api.configured()
            ? `<div class="banner warn" style="margin:14px 0 0"><div><b>No API key.</b> Set it under Partner details → Connections.</div></div>`
            : ''}
          <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
            <button class="btn sm ghost" data-act="esign-dry" ${blockers.length ? 'disabled' : ''}>Preview PDF</button>
            <button class="btn sm p" data-act="esign-send" ${blockers.length || !VLR.Api.configured() ? 'disabled' : ''}>Send for signature</button>
          </div>
          <div class="hint" style="margin-top:8px">Preview renders and downloads the exact file Zoho would receive, without sending anything.</div>
        </div>
      </div>
    </div>`;
  }

  /* -- Compliance ---------------------------------------------------------- */
  function vCompliance(p) {
    const d = VLR.derive(p);
    const rd = VLR.readiness(p);
    const list = [{ k: 'disc', label: 'Referral disclosure' }, { k: 'kyb', label: 'KYB record' }, { k: 'intake', label: 'Intake form' }];
    const t = tabOf('compliance', list);
    const body = { disc: VLR.Doc.disclosureDoc, kyb: VLR.Doc.kybChecklist, intake: VLR.Doc.intakeForm }[t](p);

    return `<div class="sheet wide">
      ${head('KYB & disclosure', 'The gate that is <em>not a checklist item</em>.',
        'A partner code that goes live without a resolving, compliance-approved referral disclosure is a regulatory breach under clause 18(a) of the global access framework, not an operational slip.')}

      <div class="split" style="margin-bottom:26px">
        <div class="card ${rd.ready ? 'tint' : ''}">
          <div class="lbl">Go-live gates</div><div class="eyebrow-rule"></div>
          <div style="margin-top:10px">
            ${rd.checks.map(c => `<div class="gate-row">
              <div class="gate-dot ${c.ok ? 'ok' : 'no'}">${c.ok ? '✓' : '!'}</div>
              <div><div class="t">${VLR.fmt.esc(c.label)}</div><div class="w">${VLR.fmt.esc(c.why)}</div></div>
            </div>`).join('')}
          </div>
        </div>
        <div>
          <div class="lbl">KYB pack — approve, query or reject</div><div class="eyebrow-rule"></div>
          <table class="t" style="margin-top:14px">
            <thead><tr><th>Document</th><th>Required</th><th style="width:230px">Status</th></tr></thead>
            <tbody>${VLR.CONFIG.kybPack.map(k => {
              const st = (p.kyb[k.code] || {}).status || 'PENDING';
              return `<tr>
                <td>${VLR.fmt.esc(k.label)}</td>
                <td>${k.required ? 'Yes' : 'If held'}</td>
                <td><select data-kyb="${k.code}">
                  ${['PENDING', 'SUBMITTED', 'QUERIED', 'APPROVED', 'REJECTED'].map(s =>
                    `<option ${st === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select></td></tr>`;
            }).join('')}</tbody>
          </table>
          <div class="inline" style="margin-top:12px">
            <button class="btn sm" data-act="kyb-all">Approve all</button>
            <button class="btn sm ghost" data-act="kyb-clear">Reset to pending</button>
            <button class="btn sm p" data-act="issue-code">Issue partner code</button>
          </div>
        </div>
      </div>

      ${tabs('compliance', list)}
      <div class="stage-wrap" id="print-area">${body}</div>
    </div>`;
  }

  /* -- Collateral ---------------------------------------------------------- */
  function vCollateral(p) {
    const list = [
      { k: 'site', label: 'Microsite' }, { k: 'cards', label: 'Visiting cards' },
      { k: 'sig', label: 'Email signature' }, { k: 'social', label: 'Social kit' },
      { k: 'cert', label: 'Certificate' }, { k: 'guard', label: 'Guardrails card' },
      { k: 'invite', label: 'Launch invite' }, { k: 'wrap', label: 'Client onboarding wrapper' },
      { k: 'kit', label: 'Kit insert' }, { k: 'letter', label: 'Letterhead' }
    ];
    const t = tabOf('collateral', list);
    const fn = { site: VLR.Doc.microsite, cards: VLR.Doc.visitingCards, sig: VLR.Doc.signatures,
      social: VLR.Doc.socialKit, cert: VLR.Doc.certificate, guard: VLR.Doc.guardrails,
      invite: VLR.Doc.invite, wrap: VLR.Doc.onboardingWrapper, kit: VLR.Doc.kitInsert, letter: VLR.Doc.letterhead }[t];
    return `<div class="sheet wide">
      ${head('Collateral pack', 'Generated per partner. <em>No manual design work.</em>',
        'Everything here comes from the brand kit on the partner record. The partner mark occupies the partner slot of the lockup and nothing else — their colours never replace Valura\'s page background, ink or accent.')}
      ${tabs('collateral', list)}
      <div class="stage-wrap" id="print-area">${fn(p)}</div>
    </div>`;
  }

  /* -- Emails --------------------------------------------------------------- */
  function vEmails(p) {
    const list = VLR.Doc.emails(p);
    const cur = docTab.emails || list[0].code;
    const e = list.find(x => x.code === cur) || list[0];
    return `<div class="sheet wide">
      ${head('Email sequence', 'Drafted, queued, <em>and sent by a person</em>.',
        'The Hub never auto-sends. Every message is generated, reviewed and dispatched by a named human — which is also why each one carries a note on what to check first.')}
      <div class="docbar">
        <div class="doc-tabs">${list.map(x => {
          const sent = (p.emailLog || []).some(l => l.code === x.code);
          return `<button class="doc-tab ${cur === x.code ? 'on' : ''}" data-tab="emails:${x.code}">${sent ? '✓ ' : ''}${x.code} · ${x.day}</button>`;
        }).join('')}</div>
        <div class="spacer"></div>
        <button class="btn sm ghost" data-act="copy-email">Copy body</button>
        <button class="btn sm p" data-act="send-email" ${VLR.Api.configured() ? '' : 'disabled'}>Send this one</button>
        <button class="btn sm" data-act="print">Print / PDF</button>
      </div>

      ${(p.emailLog || []).filter(l => l.code === e.code).map(l => `
        <div class="banner"><div><b>Already sent.</b> ${VLR.fmt.esc(l.to)} on ${VLR.fmt.date(l.sentAt)} by ${VLR.fmt.esc(l.sentBy)}. Sending again will deliver a second copy.</div></div>`).join('')}

      ${!VLR.Api.configured() ? `<div class="banner warn"><div><b>Sending is off.</b> The message is drafted and can be copied out. To dispatch from the Hub, set the API key under Partner details → Connections.</div></div>` : ''}

      <div class="stage-wrap" id="print-area">${VLR.Doc.emailCard(p, e)}</div>
    </div>`;
  }

  /* -- Plan & statement ----------------------------------------------------- */
  function vPlan(p) {
    const list = [{ k: 'plan', label: 'Business plan' }, { k: 'stmt', label: 'Quarterly statement' }];
    const t = tabOf('plan', list);
    return `<div class="sheet wide">
      ${head('Plan & statement', 'Built backwards from the target, <em>settled forwards from the ledger</em>.',
        'The plan turns an AUM target into weekly calls and meetings. The statement is the same calculation run on the quarter — so what a partner was shown at pitch is what they can reconcile to at settlement.')}
      ${tabs('plan', list)}
      <div class="stage-wrap" id="print-area">${(t === 'plan' ? VLR.Doc.businessPlan : VLR.Doc.statement)(p)}</div>
    </div>`;
  }

  /* -- The partner pack ------------------------------------------------------ */
  function vPack(p) {
    const d = VLR.derive(p);
    const rd = VLR.readiness(p);
    const items = [
      ['Partner Agreement v2.0 + Schedules A–D', 'agreement', 'Executed via Zoho Sign. Variable fields only.'],
      ['Term sheet', 'commercial', 'Initialled before the agreement is generated.'],
      ['Economics one-pager', 'commercial', 'Co-branded. Same numbers as the agreement §6.'],
      ['Segment brief', 'commercial', `Written for a ${d.seg.label.toLowerCase()}.`],
      ['Intake form', 'compliance', 'One form. Everything downstream generates from it.'],
      ['KYB checklist and review record', 'compliance', `${VLR.CONFIG.ops.kybTatHours}h published turnaround.`],
      ['Referral disclosure', 'compliance', 'Clause 18(a). Hard gate on go-live.'],
      ['Activation calendar + ICS feed', 'calendar', 'Dated from signature. Includes the email-ID ask and handover.'],
      ['Co-branded microsite', 'collateral', d.micrositeUrl],
      ['Visiting cards', 'collateral', `${(p.people || []).filter(x => x.wantsCard).length} named people.`],
      ['Email signature blocks', 'collateral', 'One per mailbox, disclosure line included.'],
      ['Social kit', 'collateral', 'Banner, launch tile, story frame.'],
      ['Certificate of accreditation', 'collateral', 'Issued on certification.'],
      ['Marketing guardrails card', 'collateral', 'Two pages. Re-tested at recertification.'],
      ['Launch invite', 'collateral', 'Roundtable at D+17.'],
      ['Client onboarding wrapper', 'collateral', 'Cover and footer co-branded; body is regulated text.'],
      ['Welcome kit insert', 'collateral', 'Codes and the next four dates.'],
      ['Letterhead', 'collateral', 'With the required disclosure footer.'],
      ['Business plan', 'plan', 'AUM target down to weekly calls.'],
      ['Quarterly statement specimen', 'plan', 'Clause 5.3.2 — 15 business days.'],
      ['Email sequence, 12 messages', 'emails', 'Drafted. Sent by a named human.']
    ];
    return `<div class="sheet">
      ${head('The partner pack', 'Bring in a distributor. <em>Hand them this.</em>',
        `Twenty-one artefacts, all generated from the record for ${VLR.fmt.esc(d.displayName)}. Nothing on this list is designed, drafted or calculated by hand.`)}

      ${rd.ready ? `<div class="banner"><div><b>Cleared.</b> Every gate is green. The pack can go out and the code can go live.</div></div>`
        : `<div class="banner stop"><div><b>${rd.checks.filter(c => !c.ok).length} gate(s) still open.</b> The pack can be produced and reviewed, but the partner code must not go live: ${rd.checks.filter(c => !c.ok).map(c => c.label).join(' · ')}.</div></div>`}

      <div class="card" style="margin-bottom:22px">
        <table class="t">
          <thead><tr><th>Artefact</th><th>Note</th><th class="num">Open</th></tr></thead>
          <tbody>${items.map(([n, v, note]) => `<tr>
            <td><b>${VLR.fmt.esc(n)}</b></td>
            <td class="muted">${VLR.fmt.esc(note)}</td>
            <td class="num"><button class="btn sm ghost" data-act="goto:${v}">View</button></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>

      <div class="grid g3">
        <div class="card tint">
          <div class="lbl">Print everything</div>
          <h3 style="margin-top:6px">One PDF, in order</h3>
          <p class="muted" style="font-size:12.5px;margin:8px 0 14px">Agreement, term sheet, one-pager, intake, KYB, disclosure, guardrails, plan, statement and the collateral sheets, as a single print job.</p>
          <button class="btn p" data-act="print-all" style="width:100%;justify-content:center">Build the full pack</button>
        </div>
        <div class="card">
          <div class="lbl">Calendar</div>
          <h3 style="margin-top:6px">Live ICS feed</h3>
          <p class="muted" style="font-size:12.5px;margin:8px 0 14px">The 90-day programme with alarms, owners and the contractual statement deadlines.</p>
          <button class="btn" data-act="ics" style="width:100%;justify-content:center">Download .ics</button>
        </div>
        <div class="card">
          <div class="lbl">Record</div>
          <h3 style="margin-top:6px">Export the partner record</h3>
          <p class="muted" style="font-size:12.5px;margin:8px 0 14px">The whole Hub as JSON, so the record moves when the system does.</p>
          <button class="btn" data-act="export" style="width:100%;justify-content:center">Export JSON</button>
        </div>
      </div>
    </div>`;
  }

  /* -- Programme reference --------------------------------------------------- */
  function vProgramme(p) {
    const C = VLR.CONFIG;
    return `<div class="sheet">
      ${head('Programme & decisions', 'What was decided, <em>and what still needs a human</em>.',
        'Everything the Hub inferred rather than was told is listed here. None of it should harden into production without a named person confirming it.')}

      <div class="banner warn"><div><b>Four items need confirmation before an agreement leaves the building.</b> They are commercial and regulatory, and this system is deliberately unwilling to decide them.</div></div>

      <div class="card" style="margin-bottom:24px">
        <table class="t">
          <thead><tr><th>Inferred</th><th>What the Hub assumed</th><th>Who confirms</th></tr></thead>
          <tbody>
            <tr><td><b>Tier share percentages</b></td>
              <td>Starter ${VLR.fmt.pct(C.tiers.STARTER.platformSharePct, 0)} · Growth ${VLR.fmt.pct(C.tiers.GROWTH.platformSharePct, 0)} · Anchor ${VLR.fmt.pct(C.tiers.ANCHOR.platformSharePct, 0)} of collected revenue. The executed Neoma paper used a flat 50% expressed as a fixed rate.</td>
              <td>Val + Aaryan</td></tr>
            <tr><td><b>Anchor thresholds in USD</b></td>
              <td>${VLR.fmt.usd(C.anchorQualification.personalAumUsd)} and ${VLR.fmt.usd(C.anchorQualification.networkAumUsd)}, converted from ₹10 Cr and ₹25 Cr at ₹${C.ops.fxUsdInr}.</td>
              <td>Val + Parthiban</td></tr>
            <tr><td><b>Schedule C bonus values</b></td>
              <td>${C.incentiveGrid.rows.length} published milestones from ${VLR.fmt.usd(C.incentiveGrid.rows[0].bonusUsd)} to ${VLR.fmt.usd(Math.max(...C.incentiveGrid.rows.map(r => r.bonusUsd)))}.</td>
              <td>Aaryan</td></tr>
            <tr><td><b>Tier AUM targets</b></td>
              <td>${Object.values(C.tiers).map(t => `${t.label} ${VLR.fmt.usdShort(t.aumTargetY1Usd)}`).join(' · ')}, and the co-funding bands.</td>
              <td>Aaryan</td></tr>
            <tr><td><b>Placement net income</b></td>
              <td>Valura's typical net per asset class: ${Object.values(C.placementEconomics).map(x => `${x.label} ${VLR.fmt.pct(x.valuraNetTypical)}`).join(' · ')}. Taken from the Schedule A.2 note in the executed paper.</td>
              <td>Val</td></tr>
            <tr><td><b>Withholding and GST rates</b></td>
              <td>10% withholding and 18% GST in the statement specimen — indicative pending PAN and treaty documentation.</td>
              <td>Finance</td></tr>
          </tbody>
        </table>
      </div>

      <div class="split">
        <div>
          <div class="lbl">Still open in the client fee schedule</div><div class="eyebrow-rule"></div>
          <p class="muted" style="font-size:13px;margin-top:12px">Six items are flagged in Schedule of Fees &amp; Charges ${C.clientSchedule.version} as incomplete. Two of them touch this Hub directly.</p>
        </div>
        <div class="card">
          <table class="t">
            <tbody>
              <tr><td><b>Referral disclosure at 10.2</b></td><td class="muted">Placeholder in the published document. The Hub now renders it per partner code — this is the fix, and it needs to be wired into the client onboarding journey.</td></tr>
              <tr><td><b>Transfer-out and closure charges</b></td><td class="muted">Must be stated even if nil, because of the clause 38(j) undertaking.</td></tr>
              <tr><td><b>Global mutual fund brokerage</b></td><td class="muted">"Cost + 30%" is not a disclosed charge — the client cannot compute it. Needs a stated figure or a published cost table.</td></tr>
              <tr><td><b>Structured product custody</b></td><td class="muted">The pricing deck says 0.10% p.a.; the schedule says 20 bps. They contradict each other in public.</td></tr>
              <tr><td><b>Strategist consultation scope</b></td><td class="muted">A paid personal portfolio review is capable of amounting to investment advice against an execution-only permission. Licensing question.</td></tr>
              <tr><td><b>Marketing deck</b></td><td class="muted">Says pricing is "indicative" and names competitors with figures. Both are problems under the advertisement code and the 38(j) undertaking.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style="margin-top:30px" class="split">
        <div>
          <div class="lbl">The seven stages</div><div class="eyebrow-rule"></div>
          <p class="muted" style="font-size:13px;margin-top:12px">Each gate records who approved it, when, and against what evidence.</p>
        </div>
        <div class="card">
          <table class="t">
            <thead><tr><th>Stage</th><th>Window</th><th>Gate</th><th>Owner</th></tr></thead>
            <tbody>${C.stages.map(s => `<tr>
              <td><span class="mono faint">${s.no}</span> ${VLR.fmt.esc(s.label)}</td>
              <td class="mono" style="font-size:11px">${VLR.fmt.esc(s.window)}</td>
              <td class="muted">${VLR.fmt.esc(s.gate)}</td>
              <td class="muted">${VLR.fmt.esc(C.team[s.owner].name)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div style="margin-top:30px" class="split">
        <div>
          <div class="lbl">Constraints the Hub enforces</div><div class="eyebrow-rule"></div>
        </div>
        <div class="card sunken">
          <ol style="margin:0;padding-left:18px;font-size:13px;line-height:1.7;color:var(--text-body)">
            <li>Nothing is auto-sent to a partner or a client. Draft, do not dispatch.</li>
            <li>No partner code goes live without a resolving, compliance-approved referral disclosure.</li>
            <li>No non-standard term enters an agreement without two recorded approvals.</li>
            <li>Partner earnings are never presented from a second calculation.</li>
            <li>No client personal data in URLs or query strings.</li>
            <li>Every commercial term is versioned with an effective date. Rates change; history survives.</li>
          </ol>
        </div>
      </div>
    </div>`;
  }

  /* ============================================================ EVENTS === */
  function onClick(ev) {
    const t = ev.target.closest('[data-view],[data-partner],[data-tab],[data-act],[data-drop],[data-copy-sig]');
    if (!t) return;
    const p = VLR.Store.active();

    if (t.dataset.view) { view = t.dataset.view; render(); return; }
    if (t.dataset.partner) { VLR.Store.setActive(t.dataset.partner); render(); return; }
    if (t.dataset.tab) {
      const [v, k] = t.dataset.tab.split(':');
      docTab[v] = k; render(); return;
    }
    if (t.dataset.drop) { pickLogo(t.dataset.drop); return; }
    if (t.dataset.copySig) {
      const box = t.previousElementSibling;
      VLR.Doc.copy(box.outerHTML).then(() => toast('Signature HTML copied'));
      return;
    }

    const a = t.dataset.act || '';
    if (a.startsWith('goto:')) { view = a.slice(5); render(); return; }

    switch (a) {
      case 'new': {
        const np = VLR.blankPartner();
        np.legalName = 'New partner';
        VLR.Store.add(np); view = 'setup'; render(); toast('Partner created'); break;
      }
      case 'delete':
        if (confirm(`Delete ${VLR.derive(p).displayName}? This removes the record and everything generated from it.`)) {
          VLR.Store.remove(p.id); view = 'pipeline'; render(); toast('Deleted');
        }
        break;
      case 'print': window.print(); break;
      case 'print-all': printAll(p); break;
      case 'vars': showVars = !showVars; render(); break;
      case 'ics': {
        const ics = VLR.Cal.ics(p);
        if (!ics) { toast('Set a signature date first'); break; }
        VLR.Doc.download(`valura-${VLR.derive(p).slug || 'partner'}-activation.ics`, ics, 'text/calendar;charset=utf-8');
        toast('Calendar downloaded'); break;
      }
      case 'export':
        VLR.Doc.download('valura-partner-hub.json', VLR.Store.export(), 'application/json');
        toast('Exported'); break;
      case 'issue-code':
        if (!p.partnerCode) { p.partnerCode = VLR.makePartnerCode(p); VLR.Store.audit(p, 'Partner code issued', p.partnerCode); VLR.Store.save(); render(); toast('Code ' + p.partnerCode); }
        else toast('Code already issued');
        break;
      case 'kyb-all':
        VLR.CONFIG.kybPack.forEach(k => { p.kyb[k.code] = { status: 'APPROVED', note: '', at: new Date().toISOString() }; });
        VLR.Store.audit(p, 'KYB pack approved'); VLR.Store.save(); render(); toast('KYB approved'); break;
      case 'kyb-clear':
        p.kyb = {}; VLR.Store.save(); render(); toast('KYB reset'); break;
      case 'add-person':
        p.people = p.people || [];
        p.people.push({ name: '', title: '', mobile: '', wantsEmailId: true, wantsCard: true, cardQty: 100 });
        VLR.Store.save(); render(); break;
      case 'rm-person':
        p.people.splice(Number(t.dataset.i), 1); VLR.Store.save(); render(); break;
      case 'copy-email': {
        const list = VLR.Doc.emails(p);
        const e = list.find(x => x.code === (docTab.emails || list[0].code)) || list[0];
        const tmp = document.createElement('div'); tmp.innerHTML = e.body;
        VLR.Doc.copy(`Subject: ${e.subject}\n\n${tmp.textContent.replace(/\n{3,}/g, '\n\n').trim()}`)
          .then(() => toast('Email copied'));
        break;
      }

      /* -- pricing --------------------------------------------------------- */
      case 'split-reset':
        p.splits = {}; VLR.Store.audit(p, 'Splits reset to standard');
        VLR.Store.save(); render(); toast('Reset to standard'); break;

      case 'split-agree': {
        const by = prompt('Who approved this pricing?', VLR.CONFIG.team.ADMIN.name);
        if (!by) break;
        p.splitsAgreedBy = by;
        p.splitsAgreedAt = VLR.fmt.iso(new Date());
        VLR.Store.audit(p, 'Pricing agreed', JSON.stringify(p.splits));
        VLR.Store.save(); render(); toast('Pricing agreed'); break;
      }

      /* -- connections --------------------------------------------------- */
      case 'conn-save':
        VLR.Api.save({
          base: (el('conn-base').value || '').trim(),
          key: (el('conn-key').value || '').trim(),
          valuraEmail: (el('conn-valura-email').value || '').trim()
        });
        el('conn-result').textContent = 'Saved on this machine.';
        toast('Connection saved');
        break;

      case 'conn-test': {
        const out = el('conn-result');
        out.textContent = 'Checking…';
        VLR.Api.save({
          base: (el('conn-base').value || '').trim(),
          key: (el('conn-key').value || '').trim(),
          valuraEmail: (el('conn-valura-email').value || '').trim()
        });
        VLR.Api.health().then(h => {
          out.innerHTML = `Zoho ${h.zoho.configured ? (h.zoho.reachable ? '<b>reachable</b>' : '<b style="color:var(--down)">unreachable — ' + VLR.fmt.esc(h.zoho.error || '') + '</b>') : 'not configured'} · Resend ${h.resend.configured ? '<b>configured</b>' : 'not configured'} · DC ${VLR.fmt.esc(h.zoho.dc)}`;
        }).catch(err => { out.innerHTML = `<b style="color:var(--down)">${VLR.fmt.esc(err.message)}</b>`; });
        break;
      }

      /* -- e-signature ---------------------------------------------------- */
      case 'esign-dry': {
        const email = (el('esign-valura-email') || {}).value || VLR.Api.get().valuraEmail || 'preview@valura.ai';
        toast('Rendering…');
        VLR.Api.sendForSignature({ partner: p, valuraSigner: { email }, dryRun: true })
          .then(r => {
            const bin = atob(r.pdfBase64);
            const arr = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
            VLR.Doc.download(`valura-agreement-${VLR.derive(p).slug || 'partner'}-esign.pdf`, arr, 'application/pdf');
            toast(`${r.pages} pages · fields on page ${r.lastPage + 1}`);
          })
          .catch(err => alert('Preview failed.\n\n' + err.message));
        break;
      }

      case 'esign-send': {
        const email = ((el('esign-valura-email') || {}).value || VLR.Api.get().valuraEmail || '').trim();
        if (!email) { alert('Enter the Valura signatory email — Zoho sends the counter-signature request to it.'); break; }
        const d0 = VLR.derive(p);
        if (!confirm(
          `Send the Partner Agreement to two people for signature?\n\n` +
          `1. ${d0.ent.signatory.name} <${email}> — counter-signs first\n` +
          `2. ${p.signatoryName} <${p.signatoryEmail}>\n\n` +
          `Zoho emails them immediately. This cannot be unsent, only recalled.`)) break;

        toast('Sending…');
        VLR.Api.save({ valuraEmail: email });
        VLR.Api.sendForSignature({
          partner: p,
          valuraSigner: { name: d0.ent.signatory.name, email },
          expiryDays: Number((el('esign-expiry') || {}).value || 15)
        }).then(r => {
          p.esign = { requestId: r.requestId, sentAt: r.sentAt, status: 'inprogress', recipients: r.recipients };
          VLR.Store.audit(p, 'Agreement sent for signature', r.requestId);
          VLR.Store.save(); render(); toast('Sent · ' + r.requestId);
        }).catch(err => alert('Not sent.\n\n' + err.message + (err.detail ? '\n\n' + JSON.stringify(err.detail).slice(0, 400) : '')));
        break;
      }

      case 'esign-refresh':
        VLR.Api.signatureStatus(p.esign.requestId).then(r => {
          p.esign.status = r.status;
          p.esign.actions = r.actions;
          if (r.status === 'completed' && !p.esign.completedAt) {
            p.esign.completedAt = new Date().toISOString();
            VLR.Store.audit(p, 'Agreement fully executed', p.esign.requestId);
          }
          VLR.Store.save(); render(); toast('Status: ' + r.status);
        }).catch(err => alert(err.message));
        break;

      case 'esign-remind':
        toast('Reminding…');
        VLR.Api.remindSignature(p.esign.requestId).then(r => {
          const who = (r.waitingOn || []).map(a => a.email).join(', ');
          VLR.Store.audit(p, 'Signature reminder sent', who);
          VLR.Store.save();
          alert(`Zoho has re-sent the signature email${who ? ' to ' + who : ''}.\n\nIt only ever emails whoever's turn it is — a later signer cannot be chased before the one ahead of them has signed.`);
        }).catch(err => alert(err.message));
        break;

      case 'esign-download':
        toast('Fetching…');
        VLR.Api.downloadExecuted(p.esign.requestId).then(({ blob }) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = `executed-agreement-${VLR.derive(p).slug || 'partner'}.pdf`;
          document.body.appendChild(a); a.click();
          setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 200);
        }).catch(err => alert(err.message));
        break;

      case 'esign-clear':
        if (confirm('Detach this signature request from the partner record? The request stays live in Zoho Sign — this only stops the Hub tracking it.')) {
          VLR.Store.audit(p, 'Signature request detached', p.esign && p.esign.requestId);
          p.esign = null; VLR.Store.save(); render();
        }
        break;

      /* -- send one drafted email ----------------------------------------- */
      case 'send-email': {
        const list = VLR.Doc.emails(p);
        const e = list.find(x => x.code === (docTab.emails || list[0].code)) || list[0];
        const sentBy = prompt('Every outbound message is attributable to a person. Who is sending this?', VLR.CONFIG.team.BD.name);
        if (!sentBy) break;
        const toAddr = (e.to.match(/<([^>]+)>/) || [null, e.to])[1];
        if (!confirm(`Send "${e.subject}"\n\nto ${toAddr}\n\nas ${sentBy}?`)) break;

        toast('Sending…');
        VLR.Api.sendEmail({
          to: e.to, cc: e.cc || undefined, subject: e.subject,
          html: VLR.Doc.emailHtml(p, e),
          replyTo: VLR.CONFIG.ops.partnersEmail, sentBy
        }).then(r => {
          p.emailLog = p.emailLog || [];
          p.emailLog.unshift({ code: e.code, to: r.to.join(', '), sentBy, sentAt: r.sentAt, id: r.id });
          VLR.Store.audit(p, `Email ${e.code} sent by ${sentBy}`, r.to.join(', '));
          VLR.Store.save(); render(); toast('Sent');
        }).catch(err => alert('Not sent.\n\n' + err.message + (err.detail ? '\n\n' + JSON.stringify(err.detail).slice(0, 300) : '')));
        break;
      }
    }
  }

  /* Field binding — one handler for the whole form. */
  function onInput(ev) {
    const t = ev.target;
    const p = VLR.Store.active();
    if (!p) return;

    if (t.dataset.k) {
      let v = t.value;
      if (t.type === 'number') {
        v = v === '' ? null : Number(v);
        if (t.dataset.pct && v != null) v = v / 100;
      }
      if (t.dataset.k === 'tailMonths' && t.value === '') v = undefined;
      p[t.dataset.k] = v;
      /* Colour pickers and their text twins stay in step. */
      if (t.dataset.k === 'primaryHex' || t.dataset.k === 'secondaryHex') {
        document.querySelectorAll(`[data-k="${t.dataset.k}"]`).forEach(o => { if (o !== t) o.value = v; });
      }
      VLR.Store.save();
      renderTop(p);
      return;
    }
    /* Pricing splits — the slider and its number box stay in step, and the
       whole view re-renders so the client price moves as you drag. */
    if (t.dataset.split) {
      const pct = Math.min(80, Math.max(0, Number(t.value) || 0));
      p.splits = p.splits || {};
      p.splits[t.dataset.split] = pct / 100;
      VLR.Store.save();
      document.querySelectorAll(`[data-split="${t.dataset.split}"]`)
        .forEach(o => { if (o !== t) o.value = pct; });
      clearTimeout(onInput._t);
      onInput._t = setTimeout(() => {
        const active = document.activeElement;
        const key = active && active.dataset ? active.dataset.split : null;
        render();
        if (key) {
          const again = document.querySelector(`input[type="range"][data-split="${key}"]`);
          if (again) again.focus();
        }
      }, 220);
      return;
    }

    if (t.dataset.pk) {
      const [i, key] = t.dataset.pk.split(':');
      const person = p.people[Number(i)];
      person[key] = t.type === 'checkbox' ? t.checked : (t.type === 'number' ? Number(t.value) : t.value);
      VLR.Store.save();
      return;
    }
  }

  function onChange(ev) {
    const t = ev.target;
    const p = VLR.Store.active();
    if (!p) return;

    if (t.dataset.kyb) {
      p.kyb[t.dataset.kyb] = { status: t.value, note: (p.kyb[t.dataset.kyb] || {}).note || '', at: new Date().toISOString() };
      VLR.Store.audit(p, 'KYB ' + t.dataset.kyb + ' → ' + t.value);
      VLR.Store.save(); render(); return;
    }
    if (t.dataset.kbool) {
      p[t.dataset.kbool] = t.checked;
      if (t.dataset.kbool === 'disclosureApproved' && t.checked) {
        p.disclosureApprovedBy = VLR.CONFIG.team.COMPLIANCE.name;
        p.disclosureApprovedAt = VLR.fmt.iso(new Date());
      }
      VLR.Store.audit(p, t.dataset.kbool + ' → ' + t.checked);
      VLR.Store.save(); render(); return;
    }
    /* Selects and dates need a full re-render — they change derived values. */
    if (t.dataset.k && (t.tagName === 'SELECT' || t.type === 'date' || t.type === 'color')) {
      p[t.dataset.k] = t.value; VLR.Store.save(); render(); return;
    }
    if (t.dataset.pk && t.type === 'checkbox') { render(); }
  }

  /* Logo picker — reads to a data URL so the record stays self-contained. */
  function pickLogo(key) {
    const p = VLR.Store.active();
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/png,image/jpeg,image/svg+xml,image/webp';
    inp.onchange = () => {
      const file = inp.files[0]; if (!file) return;
      if (file.size > 2_000_000) { toast('Keep the logo under 2MB'); return; }
      const fr = new FileReader();
      fr.onload = () => { p[key] = fr.result; VLR.Store.audit(p, 'Brand asset uploaded', key); VLR.Store.save(); render(); toast('Logo added'); };
      fr.readAsDataURL(file);
    };
    inp.click();
  }

  /* Build the whole pack into one printable surface. */
  function printAll(p) {
    const body = el('body-view');
    body.innerHTML = `<div class="sheet wide">
      <div class="docbar no-print">
        <button class="btn ghost" data-act="goto:pack">Back to the pack</button>
        <div class="spacer"></div>
        <button class="btn p" data-act="print">Print / save as PDF</button>
      </div>
      <div class="stage-wrap plain">
        ${VLR.Doc.termSheet(p)}
        ${VLR.Doc.agreement(p, { showVars: false })}
        ${VLR.Doc.onePager(p)}
        ${VLR.Doc.segmentPage(p)}
        ${VLR.Doc.intakeForm(p)}
        ${VLR.Doc.kybChecklist(p)}
        ${VLR.Doc.disclosureDoc(p)}
        ${VLR.Doc.guardrails(p)}
        ${VLR.Doc.businessPlan(p)}
        ${VLR.Doc.statement(p)}
        ${VLR.Doc.onboardingWrapper(p)}
        ${VLR.Doc.invite(p)}
        ${VLR.Doc.kitInsert(p)}
        ${VLR.Doc.certificate(p)}
        ${VLR.Doc.letterhead(p)}
      </div>
    </div>`;
    window.scrollTo(0, 0);
    toast('Pack built — 15 documents');
  }

  return { init, render };
})();

document.addEventListener('DOMContentLoaded', VLR.App.init);
