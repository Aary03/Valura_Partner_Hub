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

  return { recurring, placement, placementOnDeal, override, ladder, overrideLadder,
           plan, breakEvenMonth, disclosure, disclosureVersion, LADDER, NET_LADDER };
})();
