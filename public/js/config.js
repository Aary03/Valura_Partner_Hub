/* ============================================================================
   Valura Partner Activation Hub — CONFIGURATION
   ----------------------------------------------------------------------------
   This is the only file you edit when commercial policy changes.
   Every document, email, illustrator and calendar in the Hub reads from here.
   Nothing is hard-coded downstream. Change a number here and the agreement,
   the term sheet, the one-pager and the client referral disclosure all move
   together — which is the entire point of this system.
   ==========================================================================*/

window.VLR = window.VLR || {};

VLR.CONFIG = {

  /* -- The two contracting entities ------------------------------------- */
  entities: {
    VALURA_INDIA_IFSC: {
      key: 'VALURA_INDIA_IFSC',
      legalName: 'Valura India IFSC Private Limited',
      short: 'Valura India IFSC',
      regulator: 'International Financial Services Centres Authority (IFSCA)',
      licence: 'Broker Dealer · Reg. No. CMI2026BDK1112',
      registeredOn: '30 July 2026',
      cin: 'U64990GJ2025PTC169870',
      address: 'Shilp Incubation Centre, Office No. SI-G-C015, Unit A, Ground Floor, ' +
               'Plot 11T 3 & 11T 5, Block 11, GIFT SEZ, GIFT City, ' +
               'Dist. Gandhinagar – 382 050, Gujarat, India',
      signatory: { name: 'Priyesh Ranjan', title: 'Chief Executive Officer' },
      governingLaw: 'India',
      seat: 'New Delhi, India',
      arbitration: 'Arbitration and Conciliation Act, 1996 · sole arbitrator · MCIA appointment fallback',
      notice: 'partners@valura.ai',
      currency: 'USD'
    },
    HATTWORD: {
      key: 'HATTWORD',
      legalName: 'Hattword Financial Consultancies LLC',
      short: 'Hattword',
      regulator: 'Capital Market Authority (CMA)',
      licence: 'CMA Category 5 Licence No. 20200000304',
      registeredOn: '—',
      cin: '—',
      address: 'United Arab Emirates',
      signatory: { name: 'Priyesh Ranjan', title: 'Chief Executive Officer' },
      governingLaw: 'the United Arab Emirates',
      seat: 'Dubai, United Arab Emirates',
      arbitration: 'DIFC-LCIA Arbitration Centre · sole arbitrator',
      notice: 'partners@valura.ai',
      currency: 'USD'
    }
  },

  /* -- What the CLIENT actually pays -------------------------------------
     Source: Valura India IFSC — Schedule of Fees & Charges v3.0,
     effective 5 August 2026. Partner compensation is expressed as a SHARE OF
     THIS, never as a fixed bps figure — so a pricing change can never again
     produce a negative margin (defect #1 in the programme paper).
     -------------------------------------------------------------------- */
  clientSchedule: {
    version: 'v3.0',
    effective: '5 August 2026',
    platformFeePct: 0.0030,          // 0.30% p.a. on chargeable assets
    platformFeeExempt: 'GIFT City-domiciled funds and external funds',
    grossBrokeragePct: 0.0022,       // 0.22% per executed trade
    netBrokerageRetainedPct: 0.0012, // 0.12% retained after pass-through
    brokerageMinUsd: 1,
    custodyBps: { mutualFunds: 0.0020, structured: 0.0020, ucits: 0, listed: 0 }
  },

  /* -- Valura's own net income on primary placements ---------------------
     The partner earns a share of THIS, not of the headline subscription.  */
  placementEconomics: {
    STRUCTURED:  { label: 'Structured products',      valuraNetTypical: 0.0150, partnerCeiling: 0.0075 },
    PREIPO:      { label: 'Pre-IPO offerings',        valuraNetTypical: 0.0400, partnerCeiling: 0.0200 },
    PRIVATE:     { label: 'Private / alternative funds', valuraNetTypical: 0.0200, partnerCeiling: 0.0100 },
    OTHER:       { label: 'Other primary placements', valuraNetTypical: 0.0100, partnerCeiling: 0.0050 }
  },

  /* -- Tiers --------------------------------------------------------------
     ⚠ REVIEW REQUIRED — see DECISIONS.md. The executed Neoma paper used a
     flat 50% share. The split below differentiates the tiers commercially.
     Aaryan's model sets the final numbers; change them here only.
     -------------------------------------------------------------------- */
  tiers: {
    STARTER: {
      key: 'STARTER', label: 'Starter', order: 1,
      platformSharePct: 0.40,      // share of platform fee ACTUALLY COLLECTED
      brokerageSharePct: 0.40,     // share of net brokerage RETAINED by Valura
      placementSharePct: 0.40,     // share of Valura's net placement income
      overridePct: 0,
      tailMonths: 24,
      portalSeats: 2,
      coFundingPct: 0.20,
      spendBandInr: '₹0 – 3 lakh',
      kit: 'Digital pack + visiting cards',
      gtm: 'Digital, on the existing book',
      coverage: 'Pooled partner desk',
      cadence: 'Monthly review',
      aumTargetY1Usd: 1500000,     // ⚠ placeholder — Aaryan's model
      clientTargetY1: 15
    },
    GROWTH: {
      key: 'GROWTH', label: 'Growth', order: 2,
      platformSharePct: 0.50,
      brokerageSharePct: 0.50,
      placementSharePct: 0.50,
      overridePct: 0,
      tailMonths: 36,
      portalSeats: 5,
      coFundingPct: 0.25,
      spendBandInr: '₹3 – 12 lakh',
      kit: 'Full kit + co-branded microsite',
      gtm: 'Digital + two offline events',
      coverage: 'Named partner manager',
      cadence: 'Fortnightly for 90 days, then monthly',
      aumTargetY1Usd: 6000000,
      clientTargetY1: 45
    },
    ANCHOR: {
      key: 'ANCHOR', label: 'Anchor', order: 3,
      platformSharePct: 0.55,
      brokerageSharePct: 0.55,
      placementSharePct: 0.55,
      overridePct: 0.20,           // on Sub-Partner Schedule A entitlement
      tailMonths: null,            // null = perpetual (Anchor only)
      portalSeats: 12,
      coFundingPct: 0.30,
      spendBandInr: '₹12 lakh +',
      kit: 'Full kit + microsite + co-funded launch event',
      gtm: 'Digital + roadshow + sub-partner recruitment',
      coverage: 'Named manager + senior sponsor',
      cadence: 'Weekly for 90 days, then fortnightly',
      aumTargetY1Usd: 20000000,
      clientTargetY1: 120
    }
  },

  /* -- Segments ---------------------------------------------------------- */
  segments: {
    RIA:             { code: 'RI', label: 'Registered Investment Adviser',
                       hook: 'Global allocation without building custody',
                       wants: 'Fee transparency and fiduciary-safe language' },
    IFA:             { code: 'IF', label: 'Independent Financial Adviser',
                       hook: 'A second revenue line on the same client book',
                       wants: 'Simple economics, low effort, fast onboarding' },
    MERCHANT_BANKER: { code: 'MB', label: 'Merchant Banker',
                       hook: 'Pre-IPO and private placement access',
                       wants: 'Deal flow, allocation certainty, placement fees' },
    FAMILY_OFFICE:   { code: 'FO', label: 'Family Office',
                       hook: 'Structured products, direct access, discretion',
                       wants: 'Confidentiality, bespoke terms, senior coverage' },
    DISTRIBUTOR:     { code: 'DI', label: 'Distributor / sub-broker network',
                       hook: 'Anchor tier — an override on a whole network',
                       wants: 'The 20% override maths and recruitment support' }
  },

  /* -- Anchor qualification ----------------------------------------------
     Restated in USD. The executed paper stated ₹10 Cr / ₹25 Cr while every
     payment obligation is in USD — one currency per template.
     ⚠ Conversion at ₹83 = $1. Confirm before issue. See DECISIONS.md.
     -------------------------------------------------------------------- */
  anchorQualification: {
    personalAumUsd: 1200000,
    networkSubPartners: 5,
    networkAumUsd: 3000000,
    sustainedMonths: 3,
    fxNote: 'USD figures restated from ₹10 Cr / ₹25 Cr at ₹83 = $1.'
  },

  /* -- Schedule C — the published incentive grid --------------------------
     Replaces the dangling §5.1.1 "to be mutually agreed" clause. Published,
     not negotiated. A partner either hits the threshold or does not.
     ⚠ Bonus values are placeholders pending Aaryan's model.
     -------------------------------------------------------------------- */
  incentiveGrid: {
    ref: 'SCHED-C-2026.1',
    effective: '1 September 2026',
    rows: [
      { milestone: 'First funded ticket within 30 days of the Effective Date', bonusUsd: 500,   window: 'One-time' },
      { milestone: 'USD 1,000,000 net new Referred-Customer AUM',              bonusUsd: 1000,  window: 'Sustained 3 months' },
      { milestone: 'USD 5,000,000 net new Referred-Customer AUM',              bonusUsd: 6000,  window: 'Sustained 3 months' },
      { milestone: 'USD 10,000,000 net new Referred-Customer AUM',             bonusUsd: 15000, window: 'Sustained 3 months' },
      { milestone: '25 funded Referred Customers in a calendar year',          bonusUsd: 2500,  window: 'Annual' },
      { milestone: 'Anchor: 5 certified Sub-Partners live in a calendar year', bonusUsd: 5000,  window: 'Annual' }
    ]
  },

  /* -- Operating constants ------------------------------------------------ */
  ops: {
    fxUsdInr: 83,
    statementDueBusinessDays: 15,     // Clause 5.3.2 — contractual
    disputeWindowDays: 15,            // Clause 5.3.5
    kybTatHours: 48,                  // published TAT, doc-complete → code
    goLiveDays: 30,
    noticeDays: 30,
    cureDays: 15,
    liabilityCapMonths: 12,
    confidentialitySurvivalYears: 3,
    nonSolicitMonths: 6,
    micrositeRoot: 'partner.valura.ai',
    emailRoot: 'valura.ai',
    supportEmail: 'support@valura.ai',
    partnersEmail: 'partners@valura.ai',
    complianceEmail: 'compliance@valura.ai',
    agreementsUrl: 'valura.ai/legal',
    templateVersion: 'Partner Agreement v2.0',
    templateEffective: '10 August 2026'
  },

  /* -- Internal roles ----------------------------------------------------- */
  team: {
    ADMIN:      { label: 'Programme owner',        name: 'Val' },
    BD:         { label: 'Business development',   name: 'BD desk' },
    COMPLIANCE: { label: 'Compliance',             name: 'Parthiban / Deepti' },
    DESIGN:     { label: 'Design',                 name: 'Rupesh' },
    TECH:       { label: 'Technology',             name: 'Nithesh' },
    CONTENT:    { label: 'Content & training',     name: 'Karmesh / Chinmay' },
    FINANCE:    { label: 'Economics & finance',    name: 'Aaryan' }
  },

  /* -- The seven stages and their gates ----------------------------------- */
  stages: [
    { key: '00_qualify',      no: '00', label: 'Qualify',              window: 'T-14 → T-7',
      gate: 'Fit confirmed · regulatory and adverse-media pre-screen clean', owner: 'BD' },
    { key: '01_pitch_price',  no: '01', label: 'Pitch & price',        window: 'T-7 → T-3',
      gate: 'One-page term sheet initialled', owner: 'BD' },
    { key: '02_contract',     no: '02', label: 'Contract',             window: 'T-3 → D0',
      gate: 'Agreement executed with Schedules A / B / C / D attached', owner: 'ADMIN' },
    { key: '03_onboard_kyb',  no: '03', label: 'Onboard & KYB',        window: 'D0 → D+5',
      gate: 'Compliance approval → Partner Code issued', owner: 'COMPLIANCE' },
    { key: '04_identity_kit', no: '04', label: 'Identity & kit',       window: 'D+3 → D+10',
      gate: 'Partner generates a client link that renders the correct referral disclosure', owner: 'DESIGN' },
    { key: '05_plan_enable',  no: '05', label: 'Business plan & enablement', window: 'D+7 → D+14',
      gate: 'Business plan signed off · certification exam passed', owner: 'CONTENT' },
    { key: '06_launch',       no: '06', label: 'Launch',               window: 'D+15 → D+30',
      gate: 'First funded ticket settled', owner: 'BD' },
    { key: '07_run_review',   no: '07', label: 'Run & review',         window: 'D+30 → ongoing',
      gate: 'QBR held · tier reconfirmed', owner: 'ADMIN' }
  ],

  /* -- KYB pack ----------------------------------------------------------- */
  kybPack: [
    { code: 'COI',      label: 'Certificate of incorporation',                    required: true },
    { code: 'PAN',      label: 'PAN card of the entity',                          required: true },
    { code: 'GST',      label: 'GST registration certificate',                    required: true },
    { code: 'BOARD',    label: 'Board resolution / authorised signatory letter',  required: true },
    { code: 'SIGID',    label: 'Signatory photo ID and address proof',            required: true },
    { code: 'UBO',      label: 'UBO declaration for every holder ≥ 25%',          required: true },
    { code: 'BANK',     label: 'USD bank account proof + cancelled cheque (Clause 5.3.1)', required: true },
    { code: 'REGCERT',  label: 'Regulatory registration certificates, where held', required: false },
    { code: 'FATCA',    label: 'FATCA / CRS self-certification',                  required: true },
    { code: 'W8',       label: 'W-8BEN-E, where applicable',                      required: false },
    { code: 'ADDR',     label: 'Office address proof',                            required: true },
    { code: 'GSTINV',   label: 'GST invoicing details',                           required: true },
    { code: 'PEC',      label: 'Pre-Existing Clients declaration (Clause 12.2 carve-out)', required: true },
    { code: 'ADVMEDIA', label: 'Adverse media and regulatory action declaration (5 years)', required: true }
  ],

  /* -- Training modules — certification gates Stage 06 ---------------------- */
  training: [
    'Valura and the licences — what each entity may do',
    'The platform — accounts, custody, settlement',
    'Global investing for the NRI corridor',
    'The asset classes on the menu',
    'Client bucketisation and the five segment pitches',
    'The fee schedule, explained line by line',
    'What you may and may not say',
    'The client onboarding journey end to end',
    'Objection handling'
  ],
  examPassMark: 80,

  /* -- Launch campaign — seven touches, auto-dated from signature ---------- */
  campaign: [
    { code: 'T1', day: 15, label: 'Partner announcement', audience: "The partner's client base", channel: 'Co-branded email + partner social' },
    { code: 'T2', day: 15, label: 'Press note',           audience: 'Trade media',               channel: 'PR — Growth and Anchor tiers only' },
    { code: 'T3', day: 17, label: 'Launch roundtable',    audience: 'Top 20 clients',            channel: 'Offline, Valura co-funded' },
    { code: 'T4', day: 20, label: 'Joint webinar',        audience: 'Full book',                 channel: 'Zoom — Valura hosts, partner introduces' },
    { code: 'T5', day: 22, label: 'Product spotlight',    audience: 'Segmented list',            channel: 'Email + WhatsApp' },
    { code: 'T6', day: 25, label: 'First allocation drive', audience: 'Warm list',               channel: 'Deal menu' },
    { code: 'T7', day: 28, label: 'Closing nudge',        audience: 'Non-converters',            channel: 'Triggered email' }
  ]
};

/* -- Convenience lookups ------------------------------------------------- */
VLR.tier    = k => VLR.CONFIG.tiers[k] || VLR.CONFIG.tiers.GROWTH;
VLR.segment = k => VLR.CONFIG.segments[k] || VLR.CONFIG.segments.IFA;
VLR.entity  = k => VLR.CONFIG.entities[k] || VLR.CONFIG.entities.VALURA_INDIA_IFSC;
