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

  /* =========================================================================
     PARTNER PRICING & REVENUE SHARE
     -------------------------------------------------------------------------
     Source: Valura_Partner_Pricing_Revenue_Share_1.xlsx.

     This is a cost-plus model, not a share of a fixed fee, and the difference
     matters. Every product has a hard COST and a fixed amount VALURA KEEPS.
     The partner's split is applied on top:

         partnerEarns = valuraKeeps × split / (1 − split)
         shareable    = valuraKeeps + partnerEarns
         clientPays   = cost + shareable

     So raising a partner's split raises what their client pays. Valura's
     margin never moves. At a 50% split the partner earns exactly what Valura
     keeps; at 60% the partner earns 1.5× it and the client pays the
     difference. That is the lever, and it is per product, per partner.

     Every default below reconciles to the published Schedule of Fees &
     Charges v4.2: equity 22 bps, other brokerage 20 bps, platform 35 bps p.a.
     A partner priced at the defaults costs their clients exactly what the
     published schedule says. A mark-up takes them ABOVE it, which is why it
     needs written agreement and client disclosure — see `markupRule`.
     ====================================================================== */
  pricing: {
    source: 'Valura_Partner_Pricing_Revenue_Share.xlsx',
    alignedTo: 'Schedule of Fees & Charges v4.2',
    defaultSplit: 0.50,
    /* All rates in basis points. 1 bp = 0.01%. */
    brokerage: [
      { key: 'EQ',    label: 'Equity, ETF & listed',  costBps: 10, valuraKeepsBps: 6, canMarkUp: true, defaultSplit: 0.50,
        note: 'Client pays 0.22% per trade, min $1. Matches the published Schedule.' },
      { key: 'BOND',  label: 'Bonds & fixed income',  costBps: 10, valuraKeepsBps: 5, canMarkUp: true, defaultSplit: 0.50,
        note: 'Client pays 0.20% per trade.' },
      { key: 'MF',    label: 'Global mutual funds',   costBps: 10, valuraKeepsBps: 5, canMarkUp: true, defaultSplit: 0.50,
        note: 'Client pays 0.20% per transaction.' },
      { key: 'UCITS', label: 'UCITS funds',           costBps: 10, valuraKeepsBps: 5, canMarkUp: true, defaultSplit: 0.50,
        note: 'Client pays 0.20% per transaction.' },
      { key: 'SN',    label: 'Structured products',   costBps: 10, valuraKeepsBps: 5, canMarkUp: true, defaultSplit: 0.50,
        note: 'Client pays 0.20% per trade.' }
    ],
    /* The platform fee is NOT revenue-shared by default. Cost 30, Valura
       keeps 5, client pays 35 — which is the published 0.35% p.a. exactly.
       A split above zero marks the client up beyond the published schedule. */
    platform: {
      key: 'PLATFORM', label: 'Platform fee — all held assets',
      costBps: 30, valuraKeepsBps: 5, canMarkUp: true, per: 'year', defaultSplit: 0,
      note: 'Cost 0.30%, Valura keeps 0.05%. The split is 0%, so this fee is not revenue-shared and the client pays 0.35% p.a., matching the published Schedule. Raising the split marks the client up.'
    },
    placement: {
      key: 'PREIPO', label: 'Pre-IPO & private markets',
      costBps: 100, valuraKeepsBps: 150, canMarkUp: true, per: 'deal', defaultSplit: 0.50,
      note: 'Indicative default only. The published Schedule prices pre-IPO per deal and discloses it to the client before they commit.'
    },
    /* Charged to the client, never shared with the partner. */
    clientOnly: [
      { label: 'Custody — exchange-listed stocks, ETFs and UCITS funds', charge: 'Nil', note: '' },
      { label: 'Custody — all other products', charge: '0.20% per year',
        note: 'Global mutual funds, structured products, pre-IPO and other unlisted holdings. Charged by the custodian, calculated daily, debited quarterly.' },
      { label: 'Deposits', charge: '$0', note: '' },
      { label: 'Withdrawals', charge: 'One free per calendar month, then $5 each', note: 'Resets on the 1st.' },
      { label: 'Transferring securities out', charge: 'At actuals', note: '' },
      { label: 'Closing the account', charge: 'At actuals', note: '' }
    ],
    /* Levied by third parties, passed through at actuals with no mark-up. */
    passThrough: [
      { charge: 'IFSCA global access turnover fee', rate: '0.005% of turnover', by: 'IFSCA', note: '' },
      { charge: 'FINRA Transaction Fee', rate: '$0.000166 per share sold', by: 'FINRA (US)', note: 'Per-share fee on sales, subject to the applicable FINRA cap.' },
      { charge: 'CAT (Consolidated Audit Trail) fees', rate: '$0.000022 per share', by: 'US regulators', note: 'Per-share, buy and sell.' },
      { charge: 'SEC Section 31 fee', rate: 'At actuals on sales', by: 'SEC (US)', note: '' },
      { charge: 'IGST on brokerage', rate: '18%', by: 'Government of India', note: 'Indian resident clients.' },
      { charge: 'Exchange, clearing and settlement', rate: 'At actuals', by: 'Venues and clearing houses', note: '' },
      { charge: 'Bank and payment charges', rate: 'At actuals', by: 'Banks and GlomoPay', note: '' }
    ],
    howToRead: 'Cost is what the chain charges Valura. Valura keeps is our fixed margin. The partner split is a share of the margin pool above cost; raising it increases what the client pays, and our fixed keep is unchanged. Client pays = cost + shareable.',
    markupRule: 'A mark-up raises the client above the rates published in the Valura Schedule of Fees & Charges v4.2. Any mark-up must be agreed with Valura in writing and disclosed to the client before the account is opened.',
    exempt: 'GIFT City funds are exempt from the platform fee. No platform-fee share arises on them.'
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
      { milestone: 'First funded ticket within 5 days of the Effective Date', bonusUsd: 500,   window: 'One-time' },
      { milestone: 'USD 1,000,000 net new Referred-Customer AUM',              bonusUsd: 1000,  window: 'Sustained 3 months' },
      { milestone: 'USD 5,000,000 net new Referred-Customer AUM',              bonusUsd: 6000,  window: 'Sustained 3 months' },
      { milestone: 'USD 10,000,000 net new Referred-Customer AUM',             bonusUsd: 15000, window: 'Sustained 3 months' },
      { milestone: '25 funded Referred Customers in a calendar year',          bonusUsd: 2500,  window: 'Annual' },
      { milestone: 'Anchor: 5 certified Sub-Partners live in a calendar year', bonusUsd: 5000,  window: 'Annual' }
    ]
  },

  /* =========================================================================
     THE FINALISED PARTNER P&L MODEL
     -------------------------------------------------------------------------
     Source: Valura_Partner_PnL_Dashboard.xlsx, marked finalised.
     The blended partner earning rate is built up class by class here, exactly
     as the Asset Mix sheet does it, and the business plan runs on the result.
     Change a rate or a weight and the whole plan reprices.

     ⚠ RECONCILIATION — the platform-fee leg below is 0.35% p.a. to the
     partner, being 50% of a 0.70% AUM fee, per Schedule A of the Introducing
     Broker Agreement v5. The published client Schedule of Fees & Charges v3.0
     (effective 5 August 2026) charges clients 0.30% p.a. and exempts GIFT City
     and external funds. One of those two documents has to move. See
     DECISIONS.md — this is the same defect flagged against the v1.0 paper,
     now carried into v5 and into this model.
     ====================================================================== */
  assetMix: {
    source: 'Valura_Partner_PnL_Dashboard.xlsx · Asset Mix sheet',
    /* platform / brokerage / placement / trail are PARTNER-SIDE rates p.a.
       brokerage is per trade and multiplied by annual rotation.            */
    classes: [
      { key: 'EQ',     label: 'Equity & ETF',        weight: 0.45, platform: 0.0035, brokerage: 0.0006, rotation: 1.2, placement: 0,      trail: 0,
        note: 'Platform fee plus brokerage on rotation.' },
      { key: 'BOND',   label: 'Bonds',               weight: 0.10, platform: 0.0035, brokerage: 0.0006, rotation: 1.2, placement: 0,      trail: 0,
        note: '' },
      { key: 'SN',     label: 'Structured Notes',    weight: 0.15, platform: 0.0035, brokerage: 0.0006, rotation: 1.2, placement: 0.0075, trail: 0,
        note: 'Placement is one-time on deployment; shown p.a. per the base-case convention.' },
      { key: 'MF',     label: 'Mutual Funds',        weight: 0.20, platform: 0.0035, brokerage: 0.0006, rotation: 1.2, placement: 0,      trail: 0.005,
        note: 'Trail from the AMC on distributed funds.' },
      { key: 'PREIPO', label: 'Pre-IPO',             weight: 0.05, platform: 0.0035, brokerage: 0.0006, rotation: 1.2, placement: 0.02,   trail: 0,
        note: 'Placement one-time; the p.a. convention assumes the allocation redeploys about once a year.' },
      { key: 'PMS',    label: 'Private Funds & PMS', weight: 0.05, platform: 0.0035, brokerage: 0.0006, rotation: 1.2, placement: 0.01,   trail: 0.005,
        note: '' }
    ],
    /* Anchor override on the sub-partner book, p.a. — Revenue Share Model. */
    anchorOverrideRate: 0.001769
  },

  /* The partner's own cost base, and what Valura funds against each line.
     `escalates` lines step up by the inflation escalator at months 13 and 25. */
  budget: {
    escalator: 0.08,
    lines: [
      { label: 'Office rent / desk',                    monthly: 25000, coFund: 0,    escalates: true,  note: 'Client-meeting capable space.' },
      { label: 'Relationship manager — salary & incentive', monthly: 80000, coFund: 0, escalates: false, note: 'One RM to start; add a line per hire.' },
      { label: 'Support / operations staff',            monthly: 25000, coFund: 0,    escalates: true,  note: 'Onboarding, KYC chasing, servicing.' },
      { label: 'Digital marketing & paid ads',          monthly: 30000, coFund: 0.25, escalates: false, note: 'Meta, Google, LinkedIn.' },
      { label: 'Print & collateral',                    monthly: 5000,  coFund: 0.30, escalates: false, note: 'Printed from central artwork.' },
      { label: 'Events & round tables',                 monthly: 25000, coFund: 0.30, escalates: false, note: 'Valura co-sponsors and sends a speaker.' },
      { label: 'Travel & client meetings',              monthly: 10000, coFund: 0,    escalates: true,  note: '' },
      { label: 'Tech — CRM, telephony, tools',          monthly: 6000,  coFund: 0,    escalates: true,  note: 'Your own CRM and phones. The Valura platform itself is not charged to you.' },
      { label: 'Webinar / Zoom subscription',           monthly: 4000,  coFund: 1.00, escalates: false, note: 'Shared central subscription — funded in full by Valura.' },
      { label: 'Contingency & miscellaneous',           monthly: 8000,  coFund: 0,    escalates: false, note: '' }
    ],
    /* Funded by Valura on top of the line-level co-marketing above. */
    centralPool: [
      { label: 'Event sponsorship pool',            annual: 100000, note: 'Drawn against approved partner events through the year.' },
      { label: 'Creative & campaign pack',          annual: 60000,  note: 'Central artwork, videos, launch posts — built once, issued to every partner.' },
      { label: 'Training delivery & certification', annual: 50000,  note: 'Trainer time, exams, certificates.' }
    ],
    secondRm: { triggerClients: 80, triggerAumInr: 400000000, monthlyInr: 60000 }
  },

  /* =========================================================================
     WHAT VALURA BEARS — the costs that never reach the partner's P&L.
     These are real and material, and a partner reading only their own cost
     sheet will not see them. Schedule A of the Introducing Broker Agreement
     already waives the first three; the rest is infrastructure Valura runs.
     ====================================================================== */
  valuraBorne: [
    { item: 'Platform access',               basis: 'Listed, waived',            listedInr: null, note: 'Access to every permitted asset class. Schedule A, Part A.' },
    { item: 'Market data',                   basis: 'USD 1,000 p.a., waived',    listedInr: 88000, note: 'Live global market data across permitted venues. Schedule A, Part A.' },
    { item: 'Client-driven events',          basis: 'USD 2 per client, waived',  listedInr: 176,   note: 'DTC movements, voluntary corporate actions, money movements. Per event, per client.' },
    { item: 'Co-branded email identities',   basis: 'Provisioned and hosted',    listedInr: 12000, note: 'One mailbox per named person, created and administered by Valura. DNS and MX managed centrally.' },
    { item: 'Co-branded microsite',          basis: 'Built and hosted',          listedInr: 60000, note: 'partner.valura.ai/<slug>, with the partner code baked into every client link.' },
    { item: 'Partner portal and dashboard',  basis: 'Included',                  listedInr: 90000, note: 'Clients, AUM and earnings visibility. A contractual obligation under the agreement, not an extra.' },
    { item: 'Onboarding, KYC and AML',       basis: 'Borne by Valura',           listedInr: 45000, note: 'Valura is the regulated entity and performs KYC/CDD, screening, monitoring and reporting as principal.' },
    { item: 'Collateral generation',         basis: 'Central artwork',           listedInr: 60000, note: 'Brochure, one-pagers, decks, social kit, signatures — generated per partner, not designed per partner.' },
    { item: 'Training, exam and certification', basis: 'Central pool',           listedInr: 50000, note: 'Nine modules, scored exam, certificate and recertification.' },
    { item: 'Webinar platform',              basis: 'Funded in full',            listedInr: 48000, note: 'Shared central subscription. Appears on the partner budget at 100% co-funded.' },
    { item: 'Event sponsorship pool',        basis: 'Central pool',              listedInr: 100000, note: 'Drawn against approved partner events.' },
    { item: 'Statements, reporting and settlement', basis: 'Included',           listedInr: 36000, note: 'Quarterly statements, tax documentation and USD settlement.' }
  ],

  /* Three commitment levels, from the Three Cases sheet. */
  cases: {
    LOW:    { label: 'Low — test the water', grossMonthlyInr: 100000, coFundPct: 0.08,  clientsPerMonth: 3,  avgTicketInr: 2000000, migratedBookInr: 15000000,  rampMonths: 6,
              note: 'Solo operator, shared desk.' },
    MEDIUM: { label: 'Medium — commit',      grossMonthlyInr: 218000, coFundPct: 0.094, clientsPerMonth: 5,  avgTicketInr: 3000000, migratedBookInr: 50000000,  rampMonths: 6,
              note: 'One RM plus an office. This is the base plan.' },
    HIGH:   { label: 'High — scale',         grossMonthlyInr: 450000, coFundPct: 0.10,  clientsPerMonth: 10, avgTicketInr: 4000000, migratedBookInr: 100000000, rampMonths: 6,
              note: 'Two RMs, bigger office, double the events.' }
  },

  /* Defaults for a new plan, from the Setup sheet. */
  planDefaults: {
    clientsPerMonth: 5, rampMonths: 6, avgTicketInr: 3000000, migratedBookInr: 50000000,
    retention: 0.90, aumGrowth: 0.30, horizonMonths: 36,
    subPartnerAumPerMonthInr: 2000000,
    dayOne: { officeDepositMonths: 6, capexInr: 300000, licensingInr: 50000 }
  },

  /* =========================================================================
     Introducing Broker Agreement v5 — the bracketed terms, in one place.
     ====================================================================== */
  ibTerms: {
    version: 'Introducing Broker Agreement v6',
    effective: '11 August 2026',
    firstLineTransferDays: 2,
    complaintForwardDays: 3,
    recordYears: 8,
    changeNoticeDays: 15,
    additionalInfoHours: 24,
    additionalInfoDays: 3,
    nonCircumventionMonths: 12,
    statementBusinessDay: 20,
    paymentDays: 30,
    disputeNoticeDays: 30,
    disputeResolveDays: 60,
    terminationNoticeDays: 90,
    cureDays: 30,
    changeOfControlNoticeDays: 30,
    liabilityCapMonths: 12,
    confidentialitySurvivalYears: 2,
    indemnitySurvivalYears: 5,
    forceMajeureNoticeDays: 5,
    forceMajeureTerminationDays: 60,
    noticeChangeDays: 30,
    /* Schedule A, Part A */
    shareable: [
      { item: 'Brokerage — Equities & ETFs', basis: '12 bps (shareable)', partner: 0.50, valura: 0.50, note: 'Shareable brokerage between Valura and the Introducing Broker, computed on settlement value.' },
      { item: 'AUM fee',                     basis: '0.70% p.a.',         partner: 0.50, valura: 0.50, note: 'Charged on AUM of referred Clients.' },
      { item: 'Other financial products',    basis: 'As per actuals',     partner: 0.50, valura: 0.50, note: 'Structured products, pre-IPO, mutual funds and bonds.' },
      { item: 'Float income',                basis: '—',                  partner: 0.80, valura: 0.20, note: 'Applicable when float income is announced by Valura.' },
      { item: 'Platform access',             basis: 'Waived',             partner: null, valura: null, note: 'Access to permitted asset classes.' },
      { item: 'Client-driven events',        basis: 'USD 2 per client — waived', partner: null, valura: null, note: 'DTC movements, voluntary corporate actions, money movements.' },
      { item: 'Market data',                 basis: 'USD 1,000 — waived', partner: null, valura: null, note: 'Market data fee waived.' }
    ],
    passThrough: [
      { cost: 'CAT fees',              rate: '0.000022 × qty',  note: 'Per buy/sell quantity.' },
      { cost: 'FINRA transaction fees', rate: '0.000166 × qty', note: 'Per sale quantity.' },
      { cost: 'IFSCA turnover fees',   rate: '0.00005 × volume', note: 'Per trade volume.' },
      { cost: 'IGST (Indian residents)', rate: '18%',           note: 'On brokerage value, where applicable.' }
    ],
    /* Schedule A, Part B — the cascade. Each row totals 100%. */
    cascade: [
      { scenario: 'Case 1 — Anchor direct', sourcedBy: 'Anchor Partner (own business)',            level2: null, subDist: null, anchor: 0.50, valura: 0.50,
        derivation: '50% of the Shareable Fee, paid directly.' },
      { scenario: 'Case 2 — Sub-Distributor', sourcedBy: 'Sub-Distributor appointed by the Anchor', level2: null, subDist: 0.50, anchor: 0.10, valura: 0.40,
        derivation: "20% of Valura's residual 50% = 10% of the Shareable Fee." },
      { scenario: 'Case 3 — Level 2', sourcedBy: 'Introducer appointed by the Sub-Distributor',     level2: 0.45, subDist: 0.10, anchor: 0.05, valura: 0.40,
        derivation: "5% of the Shareable Fee, after the Sub-Distributor's 10% override." }
    ]
  },

  /* -- Operating constants ------------------------------------------------ */
  ops: {
    fxUsdInr: 83,
    statementDueBusinessDays: 15,     // Clause 5.3.2 — contractual
    disputeWindowDays: 15,            // Clause 5.3.5
    kybTatHours: 24,                  // published TAT, doc-complete → code
    goLiveDays: 5,
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
    CONTENT:    { label: 'Content & training',     name: 'Karmesh' },
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
