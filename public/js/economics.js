/* ============================================================================
   Valura Partner Activation Hub — THE EARNINGS ILLUSTRATOR
   ----------------------------------------------------------------------------
   ONE function computes partner economics. The pitch illustrator, the term
   sheet, the agreement's §6 illustrative scenarios, the one-pager, the
   business plan and the quarterly statement all call it. They cannot disagree,
   because there is nothing to disagree with.

   The old template paid a FIXED 0.35% p.a. out of a platform fee that the
   client Schedule of Charges v3.0 sets at 0.30% p.a. — a 5bp loss on every
   rupee of AUM, and a total loss on GIFT City fund AUM, which is exempt.
   Here the partner is paid a SHARE OF WHAT IS ACTUALLY COLLECTED. Valura's
   margin cannot go negative by construction.
   ==========================================================================*/

window.VLR = window.VLR || {};

VLR.Econ = (function () {
  const C = () => VLR.CONFIG;

  /* --------------------------------------------------------------------- */
  /* Recurring economics for one partner at one AUM level.                 */
  /*                                                                        */
  /* aum            total Referred-Customer AUM in USD                      */
  /* rotation       annual portfolio turnover (0.60 = 60% of AUM traded)    */
  /* giftCityShare  fraction of AUM in GIFT City / external funds — EXEMPT  */
  /*                from the platform fee, so no partner share arises       */
  /* --------------------------------------------------------------------- */
  function recurring({ aum, rotation = 0.60, giftCityShare = 0, tierKey = 'GROWTH',
                       platformSharePct, brokerageSharePct }) {
    const cs = C().clientSchedule;
    const t  = VLR.tier(tierKey);
    const pShare = platformSharePct  != null ? platformSharePct  : t.platformSharePct;
    const bShare = brokerageSharePct != null ? brokerageSharePct : t.brokerageSharePct;

    const chargeableAum = aum * (1 - giftCityShare);
    const exemptAum     = aum - chargeableAum;

    // Platform fee leg — a share of fee actually collected from the client.
    const platformFeeCollected = chargeableAum * cs.platformFeePct;
    const platformToPartner    = platformFeeCollected * pShare;
    const platformToValura     = platformFeeCollected - platformToPartner;

    // Brokerage leg — a share of net brokerage Valura retains after
    // exchange, clearing and broker pass-through.
    const tradedValue     = aum * rotation;
    const grossBrokerage  = tradedValue * cs.grossBrokeragePct;
    const netRetained     = tradedValue * cs.netBrokerageRetainedPct;
    const brokerageToPartner = netRetained * bShare;
    const brokerageToValura  = netRetained - brokerageToPartner;

    const partnerTotal = platformToPartner + brokerageToPartner;
    const valuraTotal  = platformToValura  + brokerageToValura;

    return {
      inputs: { aum, rotation, giftCityShare, tierKey, pShare, bShare },
      chargeableAum, exemptAum,
      platformFeeCollected, platformToPartner, platformToValura,
      tradedValue, grossBrokerage, netRetained,
      brokerageToPartner, brokerageToValura,
      partnerTotal, valuraTotal,
      // Effective yields, the numbers a partner actually asks about.
      partnerYieldOnAum: aum ? partnerTotal / aum : 0,
      platformYieldOnChargeable: pShare * cs.platformFeePct,
      brokerageYieldOnTraded: bShare * cs.netBrokerageRetainedPct,
      // Margin guard. Must never be negative — that was defect #1.
      valuraMarginPct: (platformFeeCollected + netRetained)
        ? valuraTotal / (platformFeeCollected + netRetained) : 0,
      isNegativeMargin: valuraTotal < 0
    };
  }

  /* --------------------------------------------------------------------- */
  /* Placement economics — the partner earns a share of Valura's NET        */
  /* placement income, capped at the Schedule A.2 ceiling per asset class.  */
  /* --------------------------------------------------------------------- */
  function placement({ tierKey = 'GROWTH', placementSharePct }) {
    const t = VLR.tier(tierKey);
    const share = placementSharePct != null ? placementSharePct : t.placementSharePct;
    return Object.entries(C().placementEconomics).map(([key, p]) => {
      const raw = p.valuraNetTypical * share;
      return {
        key, label: p.label,
        valuraNetTypical: p.valuraNetTypical,
        ceiling: p.partnerCeiling,
        partnerRate: Math.min(raw, p.partnerCeiling),
        cappedByCeiling: raw > p.partnerCeiling
      };
    });
  }

  function placementOnDeal({ tierKey, assetClass, subscriptionUsd, placementSharePct }) {
    const row = placement({ tierKey, placementSharePct }).find(r => r.key === assetClass);
    if (!row) return null;
    return { ...row, subscriptionUsd, partnerFeeUsd: subscriptionUsd * row.partnerRate };
  }

  /* --------------------------------------------------------------------- */
  /* Anchor override — 20% of what the Sub-Partner earns under Schedule A,  */
  /* paid out of Valura's own share. It never reduces the Sub-Partner.      */
  /* --------------------------------------------------------------------- */
  function override({ networkAum, rotation = 0.60, giftCityShare = 0,
                      subPartnerTierKey = 'GROWTH', overridePct }) {
    const anchor = VLR.tier('ANCHOR');
    const pct = overridePct != null ? overridePct : anchor.overridePct;
    const sub = recurring({ aum: networkAum, rotation, giftCityShare, tierKey: subPartnerTierKey });
    const overrideTotal = sub.partnerTotal * pct;
    return {
      pct, networkAum,
      subPartnerEarns: sub.partnerTotal,
      overrideTotal,
      valuraRetainsAfterOverride: sub.valuraTotal - overrideTotal,
      erodesValuraMargin: (sub.valuraTotal - overrideTotal) < 0
    };
  }

  /* --------------------------------------------------------------------- */
  /* The illustration table that appears in the agreement §6, the term      */
  /* sheet and the one-pager. Same rows, same maths, every time.            */
  /* --------------------------------------------------------------------- */
  const LADDER = [1000000, 5000000, 10000000, 25000000];
  const NET_LADDER = [10000000, 50000000, 100000000, 250000000];

  function ladder(opts) {
    return LADDER.map(aum => {
      const r = recurring({ ...opts, aum });
      return { aum, annual: r.partnerTotal, yield: r.partnerYieldOnAum, detail: r };
    });
  }

  function overrideLadder(opts) {
    return NET_LADDER.map(networkAum => {
      const o = override({ ...opts, networkAum });
      return { networkAum, annual: o.overrideTotal, detail: o };
    });
  }

  /* --------------------------------------------------------------------- */
  /* Year-one plan built from the partner's own targets, used by the        */
  /* business plan builder and the funnel model.                            */
  /* --------------------------------------------------------------------- */
  function plan({ aumTarget, avgTicket, rotation = 0.60, giftCityShare = 0,
                  tierKey = 'GROWTH', rampMonths = 6, placementsPerYearUsd = 0,
                  placementMix = 'STRUCTURED' }) {
    const clients = avgTicket ? Math.ceil(aumTarget / avgTicket) : 0;
    const months = [];
    let cumulative = 0;
    for (let m = 1; m <= 12; m++) {
      // S-curve ramp: nothing lands in month one, target is hit by month 12.
      const progress = Math.min(1, Math.pow(Math.max(0, m - 1) / Math.max(1, 12 - 1), 1.6));
      const closingAum = aumTarget * progress;
      const avgAum = (cumulative + closingAum) / 2;
      const r = recurring({ aum: avgAum, rotation, giftCityShare, tierKey });
      const rampedPlacement = (placementsPerYearUsd / 12) * (m > rampMonths ? 1 : m / rampMonths);
      const pl = placementOnDeal({ tierKey, assetClass: placementMix, subscriptionUsd: rampedPlacement });
      months.push({
        month: m,
        closingAum, avgAum,
        clients: Math.round(clients * progress),
        recurringUsd: r.partnerTotal / 12,
        placementUsd: pl ? pl.partnerFeeUsd : 0,
        totalUsd: r.partnerTotal / 12 + (pl ? pl.partnerFeeUsd : 0)
      });
      cumulative = closingAum;
    }
    const year1Usd = months.reduce((s, m) => s + m.totalUsd, 0);
    const exitRun = recurring({ aum: aumTarget, rotation, giftCityShare, tierKey });
    return {
      clients, months,
      year1Usd,
      exitRunRateUsd: exitRun.partnerTotal + (placementsPerYearUsd
        ? placementOnDeal({ tierKey, assetClass: placementMix, subscriptionUsd: placementsPerYearUsd }).partnerFeeUsd : 0),
      exitRunRateInr: (exitRun.partnerTotal) * C().ops.fxUsdInr
    };
  }

  function breakEvenMonth(months, monthlyCostUsd) {
    let cum = 0;
    for (const m of months) {
      cum += m.totalUsd - monthlyCostUsd;
      if (cum >= 0) return m.month;
    }
    return null;
  }

  /* --------------------------------------------------------------------- */
  /* The client-facing referral disclosure string.                          */
  /* IFSCA global access framework clause 18(a) requires the remuneration   */
  /* payable to the introducing firm to be disclosed to the client as a     */
  /* REAL FIGURE. Clause 10.2 of the Schedule of Charges renders this.      */
  /* A partner code cannot go live until this resolves and Compliance       */
  /* has approved the resulting string.                                     */
  /* --------------------------------------------------------------------- */
  function disclosure(partner) {
    const cs = C().clientSchedule;
    const t  = VLR.tier(partner.tier);
    const pShare = partner.platformSharePct  != null ? partner.platformSharePct  : t.platformSharePct;
    const bShare = partner.brokerageSharePct != null ? partner.brokerageSharePct : t.brokerageSharePct;
    const plShare = partner.placementSharePct != null ? partner.placementSharePct : t.placementSharePct;

    const platformEff  = pShare * cs.platformFeePct;              // e.g. 0.0015
    const brokerageEff = bShare * cs.netBrokerageRetainedPct;     // e.g. 0.0006
    const per100k      = platformEff * 100000;

    const rows = placement({ tierKey: partner.tier, placementSharePct: plShare })
      .filter(r => r.key !== 'OTHER')
      .map(r => `${r.label.toLowerCase()} up to ${VLR.fmt.pct(r.ceiling)}`)
      .join(', ');

    const name = partner.legalName || 'your introducing firm';
    const code = partner.partnerCode || 'PENDING';

    const text =
      `Your account was introduced to Valura by ${name} (partner code ${code}). ` +
      `Valura pays ${name} ${VLR.fmt.pct(platformEff)} per annum of the chargeable assets you hold ` +
      `— that is ${VLR.fmt.usd(per100k)} a year for every ${VLR.fmt.usd(100000)} held — being ` +
      `${Math.round(pShare * 100)}% of the ${VLR.fmt.pct(cs.platformFeePct)} platform fee you pay. ` +
      `GIFT City-domiciled funds and external funds are exempt from the platform fee, and no ` +
      `referral payment arises on them. ` +
      `Valura also pays ${VLR.fmt.pct(brokerageEff)} of the value of each trade you execute, being ` +
      `${Math.round(bShare * 100)}% of the net brokerage Valura retains after exchange, clearing and ` +
      `broker charges. ` +
      `On subscriptions to primary placements Valura pays a one-time fee of ${rows}, ` +
      `of the amount you subscribe. ` +
      `These payments are made out of the charges set out in this Schedule. They do not increase ` +
      `what you pay, and no charge is made to you for the introduction.`;

    return {
      text,
      version: disclosureVersion(partner),
      resolves: Boolean(partner.partnerCode && partner.legalName && pShare > 0),
      figures: { platformEff, brokerageEff, per100k, pShare, bShare, plShare }
    };
  }

  function disclosureVersion(partner) {
    const t = VLR.tier(partner.tier);
    const p = Math.round(((partner.platformSharePct  ?? t.platformSharePct)  * 100));
    const b = Math.round(((partner.brokerageSharePct ?? t.brokerageSharePct) * 100));
    const l = Math.round(((partner.placementSharePct ?? t.placementSharePct) * 100));
    return `RD-${partner.partnerCode || 'PENDING'}-${p}${b}${l}-${(partner.effectiveDate || '').replace(/-/g, '') || 'NODATE'}`;
  }

  /* =======================================================================
     PARTNER PRICING — cost plus a split mark-up
     -----------------------------------------------------------------------
         partnerEarns = valuraKeeps × split / (1 − split)
         shareable    = valuraKeeps + partnerEarns
         clientPays   = cost + shareable

     One function. The pricing tab, Schedule A of the agreement, the client
     referral disclosure and the P&L all read it, so a split changed in one
     place moves every one of them together.
     ==================================================================== */
  function priceLine(line, split) {
    const s = split == null ? C().pricing.defaultSplit : Number(split);
    /* A 100% split would divide by zero — and would mean Valura marks up
       infinitely for the partner's benefit, which is not a thing. */
    const safe = Math.min(Math.max(s, 0), 0.95);
    const partnerEarns = safe === 0 ? 0 : line.valuraKeepsBps * safe / (1 - safe);
    const shareable = line.valuraKeepsBps + partnerEarns;
    const clientPays = line.costBps + shareable;
    return {
      ...line, split: safe, partnerEarnsBps: partnerEarns,
      shareableBps: shareable, clientPaysBps: clientPays,
      partnerShareOfShareable: shareable ? partnerEarns / shareable : 0,
      /* What the client pays at the default split, to show the mark-up. */
      baselineClientPaysBps: line.costBps + line.valuraKeepsBps * 2,
      markupOverBaselineBps: clientPays - (line.costBps + line.valuraKeepsBps * 2)
    };
  }

  /* The whole sheet for one partner. `splits` is { key: fraction }. */
  function pricingFor(partner) {
    const P = C().pricing;
    const splits = (partner && partner.splits) || {};
    const get = k => splits[k] != null ? splits[k] : P.defaultSplit;
    return {
      brokerage: P.brokerage.map(l => priceLine(l, get(l.key))),
      platform: priceLine(P.platform, get(P.platform.key)),
      placement: priceLine(P.placement, get(P.placement.key)),
      defaultSplit: P.defaultSplit
    };
  }

  /* Blended partner earning rate implied by the pricing sheet and the
     partner's asset mix — this is what replaces a hand-typed rate. */
  function blendedFromPricing(partner, mix) {
    const pr = pricingFor(partner);
    const classes = (mix && mix.classes) || C().assetMix.classes;
    const bpsToRate = b => b / 10000;
    const brokerageFor = key => {
      const m = { EQ: 'EQ', BOND: 'BOND', SN: 'SN', MF: 'MF', PREIPO: 'EQ', PMS: 'EQ' };
      const line = pr.brokerage.find(l => l.key === (m[key] || 'EQ')) || pr.brokerage[0];
      return line;
    };
    const rows = classes.map(c => {
      const brk = brokerageFor(c.key);
      const platform = bpsToRate(pr.platform.partnerEarnsBps);
      const brokerage = bpsToRate(brk.partnerEarnsBps) * c.rotation;
      const placement = (c.key === 'PREIPO' || c.key === 'PMS' || c.key === 'SN')
        ? bpsToRate(pr.placement.partnerEarnsBps) * (c.key === 'SN' ? 0.5 : 1) : 0;
      const trail = c.trail;
      const rate = platform + brokerage + placement + trail;
      return { ...c, platformRate: platform, brokerageRate: brokerage, placementRate: placement,
               trailRate: trail, rate, contribution: c.weight * rate };
    });
    const blended = rows.reduce((s, r) => s + r.contribution, 0);
    return { rows: rows.map(r => ({ ...r, shareOfEarnings: blended ? r.contribution / blended : 0 })),
             blended, pricing: pr };
  }

  /* =======================================================================
     THE FINALISED PARTNER P&L MODEL
     -----------------------------------------------------------------------
     Ported from Valura_Partner_PnL_Dashboard.xlsx. Same arithmetic, same
     order of operations, so a figure quoted here reconciles to the workbook.

     The engine is three lines:
       rate    = Σ weight × (platform + brokerage×rotation + placement + trail)
       roll    = (retention × (1 + growth)) ^ (1/12)
       AUM(m)  = AUM(m−1) × roll + newBusiness(m)
       rev(m)  = mean(AUM(m−1), AUM(m)) × rate / 12
     ==================================================================== */

  /* Blended partner earning rate, built up class by class. */
  function blendedRate(mix) {
    const classes = (mix && mix.classes) || C().assetMix.classes;
    const rows = classes.map(c => {
      const rate = c.platform + c.brokerage * c.rotation + c.placement + c.trail;
      return { ...c, rate, contribution: c.weight * rate };
    });
    const blended = rows.reduce((s, r) => s + r.contribution, 0);
    return {
      rows: rows.map(r => ({ ...r, shareOfEarnings: blended ? r.contribution / blended : 0 })),
      blended,
      weightTotal: rows.reduce((s, r) => s + r.weight, 0)
    };
  }

  /* The monthly cost base, with the 8% escalator stepping at months 13 and 25. */
  function budget(opts) {
    const o = opts || {};
    const b = C().budget;
    const lines = (o.lines || b.lines);
    const esc = o.escalator != null ? o.escalator : b.escalator;

    const rows = lines.map(l => {
      const valuraPays = l.monthly * l.coFund;
      return { ...l, valuraPays, partnerNet: l.monthly - valuraPays, annualNet: (l.monthly - valuraPays) * 12 };
    });
    const grossMonthly = rows.reduce((s, r) => s + r.monthly, 0);
    const valuraMonthly = rows.reduce((s, r) => s + r.valuraPays, 0);
    const centralAnnual = (o.centralPool || b.centralPool).reduce((s, r) => s + r.annual, 0);

    return {
      rows, grossMonthly, valuraMonthly,
      netMonthly: grossMonthly - valuraMonthly,
      coFundPct: grossMonthly ? valuraMonthly / grossMonthly : 0,
      centralAnnual,
      /* The number to show the partner: line-level co-marketing plus the pool. */
      valuraTotalAnnual: valuraMonthly * 12 + centralAnnual,
      escalatingGross: rows.filter(r => r.escalates).reduce((s, r) => s + r.monthly, 0),
      flatGross: rows.filter(r => !r.escalates).reduce((s, r) => s + r.monthly, 0),
      escalatingCoFund: rows.filter(r => r.escalates).reduce((s, r) => s + r.valuraPays, 0),
      flatCoFund: rows.filter(r => !r.escalates).reduce((s, r) => s + r.valuraPays, 0),
      escalator: esc
    };
  }

  /* The full month-by-month plan. Everything in INR unless suffixed Usd. */
  function partnerPlan(opts) {
    const o = opts || {};
    const P = C().planDefaults;
    const fx = o.fx || C().ops.fxUsdInr;

    const clientsPerMonth = o.clientsPerMonth ?? P.clientsPerMonth;
    const rampMonths      = o.rampMonths ?? P.rampMonths;
    const avgTicket       = o.avgTicketInr ?? P.avgTicketInr;
    const migrated        = o.migratedBookInr ?? P.migratedBookInr;
    const retention       = o.retention ?? P.retention;
    const growth          = o.aumGrowth ?? P.aumGrowth;
    const horizon         = o.horizonMonths ?? P.horizonMonths;

    const rate = o.blendedRate != null ? o.blendedRate : blendedRate(o.mix).blended;
    const roll = Math.pow(retention * (1 + growth), 1 / 12);

    const bud = budget(o);
    const esc = bud.escalator;
    const sec = C().budget.secondRm;

    /* Anchor override on a sub-partner book that ramps on the same curve. */
    const isAnchor = Boolean(o.anchor);
    const subPerMonth = o.subPartnerAumPerMonthInr ?? P.subPartnerAumPerMonthInr;
    const overrideRate = o.anchorOverrideRate ?? C().assetMix.anchorOverrideRate;

    const dayOne = o.includeDayOne === false ? 0 : (o.dayOneInr != null ? o.dayOneInr
      : P.dayOne.officeDepositMonths * (bud.rows[0] ? bud.rows[0].monthly : 0)
        + P.dayOne.capexInr + P.dayOne.licensingInr);

    const months = [];
    let aum = 0, subAum = 0, clients = 0, cum = -dayOne, peak = -dayOne, peakMonth = 0, breakEven = null;

    for (let m = 1; m <= horizon; m++) {
      const rampFactor = Math.min(1, m / rampMonths);
      const newClients = clientsPerMonth * rampFactor;
      const newBusiness = clientsPerMonth * avgTicket * rampFactor
        + (m <= rampMonths ? migrated / rampMonths : 0);

      const openAum = aum;
      aum = aum * roll + newBusiness;
      clients += newClients;

      const openSub = subAum;
      if (isAnchor) subAum = subAum * roll + subPerMonth * rampFactor;

      const ownRevenue = ((openAum + aum) / 2) * rate / 12;
      const overrideRevenue = isAnchor ? ((openSub + subAum) / 2) * overrideRate / 12 : 0;
      const revenue = ownRevenue + overrideRevenue;

      /* Cost: flat lines hold, escalating lines step 8% at months 13 and 25. */
      const step = m <= 12 ? 0 : (m <= 24 ? 1 : 2);
      const escFactor = Math.pow(1 + esc, step);
      const secondRmOn = clients >= sec.triggerClients || aum >= sec.triggerAumInr;
      const secondRmCost = secondRmOn ? sec.monthlyInr * escFactor : 0;

      const gross = bud.flatGross + bud.escalatingGross * escFactor + secondRmCost;
      const coFund = bud.flatCoFund + bud.escalatingCoFund * escFactor;
      const net = gross - coFund;

      const profit = revenue - net;
      cum += profit;
      if (cum < peak) { peak = cum; peakMonth = m; }
      if (breakEven === null && cum >= 0) breakEven = m;

      months.push({
        month: m, clients, newClients,
        openAum, closingAum: aum, avgAum: (openAum + aum) / 2,
        subAum, ownRevenue, overrideRevenue, revenue,
        gross, coFund, net, profit, cumulative: cum, secondRmOn
      });
    }

    const sum = (arr, k, from, to) => arr.slice(from, to).reduce((s, r) => s + r[k], 0);
    const window = (from, to) => ({
      revenue: sum(months, 'revenue', from, to),
      gross:   sum(months, 'gross', from, to),
      coFund:  sum(months, 'coFund', from, to),
      net:     sum(months, 'net', from, to),
      profit:  sum(months, 'profit', from, to),
      closingAum: months[Math.min(to, months.length) - 1] ? months[Math.min(to, months.length) - 1].closingAum : 0,
      clients:    months[Math.min(to, months.length) - 1] ? months[Math.min(to, months.length) - 1].clients : 0
    });

    const totalNet = sum(months, 'net', 0, horizon);
    const totalRev = sum(months, 'revenue', 0, horizon);
    const last = months[months.length - 1];

    return {
      inputs: { clientsPerMonth, rampMonths, avgTicket, migrated, retention, growth, horizon, rate, roll, isAnchor, fx },
      rate, roll, budget: bud, dayOne, months,
      m6: window(0, 6), y1: window(0, 12), full: window(0, horizon),
      /* Working capital — the deepest the cumulative position ever goes. */
      peakCapital: -peak, peakMonth, reserve: -peak * 1.2, breakEvenMonth: breakEven,
      /* Output measures */
      costPerClient: last && last.clients ? totalNet / last.clients : 0,
      revenuePerRupee: totalNet ? totalRev / totalNet : 0,
      aumPerRupee: totalNet && last ? last.closingAum / totalNet : 0,
      exitMrr: last ? last.revenue : 0,
      year3RunRate: sum(months, 'revenue', 24, 36),
      valuraTotalAnnual: bud.valuraTotalAnnual
    };
  }

  /* Low / Medium / High, run through the identical engine so the comparison
     isolates what the partner actually controls. */
  function threeCases(opts) {
    const o = opts || {};
    return Object.entries(C().cases).map(([key, c]) => {
      const scaled = C().budget.lines.map(l => ({
        ...l, monthly: l.monthly * (c.grossMonthlyInr / 218000)
      }));
      const p = partnerPlan({
        ...o,
        lines: scaled,
        clientsPerMonth: c.clientsPerMonth,
        avgTicketInr: c.avgTicketInr,
        migratedBookInr: c.migratedBookInr,
        rampMonths: c.rampMonths
      });
      return { key, ...c, plan: p };
    });
  }

  /* What Valura carries that never lands on the partner's cost sheet. */
  function valuraBorne() {
    const rows = C().valuraBorne;
    return {
      rows,
      annualInr: rows.reduce((s, r) => s + (r.listedInr || 0), 0),
      countedItems: rows.filter(r => r.listedInr).length,
      totalItems: rows.length
    };
  }

  return { recurring, placement, placementOnDeal, override, ladder, overrideLadder,
           plan, breakEvenMonth, disclosure, disclosureVersion, LADDER, NET_LADDER,
           blendedRate, budget, partnerPlan, threeCases, valuraBorne,
           priceLine, pricingFor, blendedFromPricing };
})();
