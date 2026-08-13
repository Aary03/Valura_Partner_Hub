/* ============================================================================
   Valura Partner Activation Hub — PARTNER RECORD & STATE
   The partner record is the only place partner state lives. Everything the
   Hub produces is a pure function of this object plus VLR.CONFIG.
   ==========================================================================*/

window.VLR = window.VLR || {};

/* -- Formatting ---------------------------------------------------------- */
VLR.fmt = {
  usd(n, dp) {
    if (n == null || isNaN(n)) return '—';
    const d = dp != null ? dp : (Math.abs(n) < 100 ? 2 : 0);
    return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  },
  usdShort(n) {
    if (n == null || isNaN(n)) return '—';
    const a = Math.abs(n);
    if (a >= 1e9) return '$' + (n / 1e9).toFixed(a % 1e9 === 0 ? 0 : 1) + 'B';
    if (a >= 1e6) return '$' + (n / 1e6).toFixed(a % 1e6 === 0 ? 0 : 1) + 'M';
    if (a >= 1e3) return '$' + (n / 1e3).toFixed(a % 1e3 === 0 ? 0 : 0) + 'K';
    return '$' + Math.round(n);
  },
  inr(n) {
    if (n == null || isNaN(n)) return '—';
    return '₹' + Math.round(n).toLocaleString('en-IN');
  },
  inrCr(n) {
    if (n == null || isNaN(n)) return '—';
    const cr = n / 1e7;
    return '₹' + cr.toLocaleString('en-IN', { maximumFractionDigits: 2 }) + ' Cr';
  },
  pct(n, dp) {
    if (n == null || isNaN(n)) return '—';
    const v = n * 100;
    const d = dp != null ? dp : (v < 1 ? 2 : (v % 1 === 0 ? 0 : 2));
    return v.toFixed(d).replace(/\.00$/, '') + '%';
  },
  bps(n) { return Math.round(n * 10000) + ' bps'; },
  date(d) {
    if (!d) return '—';
    const dt = (d instanceof Date) ? d : new Date(d + 'T00:00:00');
    if (isNaN(dt)) return '—';
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  },
  dateShort(d) {
    if (!d) return '—';
    const dt = (d instanceof Date) ? d : new Date(d + 'T00:00:00');
    if (isNaN(dt)) return '—';
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  },
  iso(d) {
    const dt = (d instanceof Date) ? d : new Date(d + 'T00:00:00');
    return isNaN(dt) ? '' : dt.toISOString().slice(0, 10);
  },
  esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
};

/* -- A blank partner record ---------------------------------------------- */
VLR.blankPartner = function () {
  return {
    id: 'p_' + Math.random().toString(36).slice(2, 10),

    /* Entity */
    legalName: '', tradingName: '', slug: '',
    segment: 'IFA', tier: 'GROWTH', contractingEntity: 'VALURA_INDIA_IFSC',
    registeredAddress: '', correspondenceAddress: '',
    cin: '', pan: '', gst: '', incorporationDate: '', website: '',
    regRegistrations: '',
    country: 'India', cities: '',

    /* People */
    signatoryName: '', signatoryTitle: '', signatoryEmail: '', signatoryMobile: '',
    businessContact: '', businessEmail: '', businessMobile: '',
    marketingContact: '', marketingEmail: '',
    opsContact: '', opsEmail: '',
    complianceContact: '', complianceEmail: '',
    portalSeats: null,
    /* People who need a co-branded Valura email ID and a visiting card */
    people: [],           // { name, title, mobile, email, wantsEmailId, wantsCard, cardQty }

    /* Pricing — the partner's split per product, as a fraction.
       Blank inherits VLR.CONFIG.pricing.defaultSplit. Raising a split raises
       what that partner's clients pay; Valura's retained bps never moves. */
    splits: {},
    splitsAgreedAt: '', splitsAgreedBy: '',

    /* Brand */
    logoLight: '', logoDark: '',      // data URLs — used on screen and in PDFs
    /* Email clients do not render data: URIs. A co-branded email needs the
       mark at a real https URL, so it is held separately. */
    logoLightUrl: '', logoDarkUrl: '',
    primaryHex: '#0B4F31', secondaryHex: '#02A24B',
    lockup: 'side',                    // side | stacked
    tagline: '', brandFontNote: 'Use Valura typography',
    social: { linkedin: '', instagram: '', x: '', website: '' },

    /* Digital */
    ownsDomain: false, domain: '', controlsDns: false,
    emailFormat: 'firstname@{slug}.valura.ai',
    crm: '',

    /* Commercial — blank means "inherit the tier default" */
    platformSharePct: null, brokerageSharePct: null, placementSharePct: null,
    overridePct: null, tailMonths: undefined,
    anchorPartnerCode: '',
    aumTargetUsd: null, clientTarget: null, avgTicketUsd: null,
    rotation: 0.60, giftCityShare: 0.15,
    placementsPerYearUsd: 0, placementMix: 'STRUCTURED',
    marketingBudgetInr: null, monthlyCostUsd: 1500,
    bankName: '', bankAccount: '', swift: '', iban: '', gstEntity: '',

    /* GTM */
    clientSegments: '', languages: 'English', offlineAppetite: 'Yes',

    /* Logistics */
    shippingAddress: '', welcomeKitQty: 1, giftPreference: '',

    /* Compliance */
    preExistingClients: '', otherPlatforms: '', regulatoryAction: 'None declared',

    /* Programme state */
    effectiveDate: '',                 // Day 0 — the signature date
    esign: null,                       // { requestId, sentAt, status, recipients, actions }
    emailLog: [],                      // { code, to, sentBy, sentAt, id }
    partnerCode: '',
    stage: '00_qualify',
    gates: {},                         // stageKey → { status, by, at, evidence, overrideReason }
    disclosureApproved: false, disclosureApprovedBy: '', disclosureApprovedAt: '',
    trademarkLicenceSigned: false,
    certifiedAt: '', examScore: null,
    kyb: {},                           // docCode → { status, note, at }
    nonStandardTerms: [],              // { clause, text, approvals: [] }
    audit: [],
    createdAt: new Date().toISOString()
  };
};

/* -- Derived values ------------------------------------------------------ */
VLR.derive = function (p) {
  const t = VLR.tier(p.tier);
  const seg = VLR.segment(p.segment);
  const ent = VLR.entity(p.contractingEntity);
  const tailMonths = (p.tailMonths === undefined || p.tailMonths === null || p.tailMonths === '')
    ? t.tailMonths : Number(p.tailMonths);
  return {
    t, seg, ent, tailMonths,
    platformSharePct:  p.platformSharePct  ?? t.platformSharePct,
    brokerageSharePct: p.brokerageSharePct ?? t.brokerageSharePct,
    placementSharePct: p.placementSharePct ?? t.placementSharePct,
    overridePct:       p.overridePct       ?? t.overridePct,
    portalSeats:       p.portalSeats       ?? t.portalSeats,
    tailLabel: tailMonths == null ? 'Perpetual, while the client remains active'
                                  : `${tailMonths} months from termination`,
    slug: p.slug || VLR.slugify(p.tradingName || p.legalName),
    displayName: p.tradingName || p.legalName || 'Untitled partner',
    micrositeUrl: VLR.CONFIG.ops.micrositeRoot + '/' + (p.slug || VLR.slugify(p.tradingName || p.legalName) || 'partner'),
    isAnchor: p.tier === 'ANCHOR',
    isSubPartner: Boolean(p.anchorPartnerCode)
  };
};

VLR.slugify = s => String(s || '').toLowerCase().trim()
  .replace(/(private|pvt\.?|limited|ltd\.?|llp|llc|inc\.?)/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 28);

/* -- Partner code: VLR-<SEGMENT2><SEQ4> ---------------------------------- */
VLR.makePartnerCode = function (p, seq) {
  const seg = VLR.segment(p.segment);
  const n = String(seq == null ? (VLR.Store.nextSeq()) : seq).padStart(4, '0');
  return `VLR-${seg.code}${n}`;
};

/* -- Go-live readiness: the hard gates ----------------------------------- */
VLR.readiness = function (p) {
  const d = VLR.derive(p);
  const disc = VLR.Econ.disclosure({ ...p, ...d });
  const kybReq = VLR.CONFIG.kybPack.filter(k => k.required);
  const kybOk = kybReq.every(k => (p.kyb[k.code] || {}).status === 'APPROVED');
  const nonStd = p.nonStandardTerms.filter(n => (n.approvals || []).length < 2);

  const checks = [
    { key: 'agreement',  label: 'Agreement executed',                    ok: Boolean(p.effectiveDate),
      why: 'Day 0 is the signature date. Nothing downstream dates without it.' },
    { key: 'kyb',        label: 'KYB pack approved',                     ok: kybOk,
      why: `${kybReq.filter(k => (p.kyb[k.code] || {}).status === 'APPROVED').length} of ${kybReq.length} required documents approved.` },
    { key: 'code',       label: 'Partner code issued',                   ok: Boolean(p.partnerCode),
      why: 'Issued by Compliance on KYB approval.' },
    { key: 'disclosure', label: 'Referral disclosure resolves',          ok: disc.resolves,
      why: 'IFSCA global access framework clause 18(a) — the client must see a real figure.' },
    { key: 'discAppr',   label: 'Disclosure approved by Compliance',     ok: Boolean(p.disclosureApproved),
      why: 'A code that goes live without this is a regulatory breach, not a bug.' },
    { key: 'margin',     label: 'Valura margin positive at every tier',  ok: !VLR.Econ.recurring({ aum: 1e6, tierKey: p.tier, platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct }).isNegativeMargin,
      why: 'Partner share is a percentage of collected revenue, so this cannot fail by construction.' },
    { key: 'nonstd',     label: 'Non-standard terms doubly approved',    ok: nonStd.length === 0,
      why: nonStd.length ? `${nonStd.length} term(s) awaiting a second approval.` : 'No unapproved deviations.' },
    { key: 'tm',         label: 'Trademark licence signed',              ok: Boolean(p.trademarkLicenceSigned),
      why: 'Schedule D. The microsite and co-branded collateral cannot publish without it.' },
    { key: 'cert',       label: 'Certification passed',                  ok: Boolean(p.certifiedAt),
      why: `Pass mark ${VLR.CONFIG.examPassMark}%. Certification gates Stage 06.` }
  ];
  return { checks, ready: checks.every(c => c.ok), disclosure: disc };
};

/* -- Storage ------------------------------------------------------------- */
VLR.Store = (function () {
  const KEY = 'vlr_hub_v1';
  let db = { partners: [], seq: 100, activeId: null };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) db = Object.assign(db, JSON.parse(raw));
    } catch (e) { /* first run, or storage blocked */ }
    return db;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {}
  }
  return {
    load, save,
    all: () => db.partners,
    get: id => db.partners.find(p => p.id === id),
    active: () => db.partners.find(p => p.id === db.activeId) || db.partners[0],
    setActive(id) { db.activeId = id; save(); },
    add(p) { db.partners.unshift(p); db.activeId = p.id; save(); return p; },
    remove(id) {
      db.partners = db.partners.filter(p => p.id !== id);
      if (db.activeId === id) db.activeId = db.partners[0] ? db.partners[0].id : null;
      save();
    },
    nextSeq() { db.seq += 1; save(); return db.seq; },
    audit(p, action, detail) {
      p.audit = p.audit || [];
      p.audit.unshift({ at: new Date().toISOString(), actor: 'Hub user', action, detail: detail || '' });
      save();
    },
    export() { return JSON.stringify(db, null, 2); },
    import(json) { db = JSON.parse(json); save(); }
  };
})();
