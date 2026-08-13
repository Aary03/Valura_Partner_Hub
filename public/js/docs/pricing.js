/* ============================================================================
   PARTNER PRICING SHEET — the agreed revenue share, per product, per partner.
   ----------------------------------------------------------------------------
   Rendered as a document so it can be attached to the term sheet and to
   Schedule A of the agreement. The same numbers drive the Hub's pricing tab,
   the client referral disclosure and the P&L.
   ==========================================================================*/

window.VLR = window.VLR || {};
VLR.Doc = VLR.Doc || {};

VLR.Doc.pricingSheet = function (p) {
  const d = VLR.derive(p);
  const C = VLR.CONFIG;
  const P = C.pricing;
  const pr = VLR.Econ.pricingFor(p);
  const bps = n => `${Number(n).toFixed(Number(n) % 1 === 0 ? 0 : 1)} bps`;
  const pctOf = n => VLR.fmt.pct(n / 10000);

  const brokerageRows = pr.brokerage.map(l => `<tr${l.split !== P.defaultSplit ? ' class="hl"' : ''}>
    <td>${VLR.fmt.esc(l.label)}</td>
    <td class="num">${bps(l.costBps)}</td>
    <td class="num">${bps(l.valuraKeepsBps)}</td>
    <td class="num">${VLR.fmt.pct(l.split, 0)}</td>
    <td class="num"><b>${bps(l.partnerEarnsBps)}</b></td>
    <td class="num">${bps(l.shareableBps)}</td>
    <td class="num">${bps(l.clientPaysBps)} · ${pctOf(l.clientPaysBps)}</td>
  </tr>`).join('');

  const totalMarkup = [...pr.brokerage, pr.platform, pr.placement]
    .reduce((s, l) => s + l.markupOverBaselineBps, 0);

  return `
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: 'Partner pricing & revenue share', cobrand: true,
      title: `What the client pays, what it costs, <em>and what you earn</em>.`,
      stand: `Every product carries a hard cost and a fixed amount Valura keeps. Your share is a mark-up on top of both. Raise it and you earn more — and your client pays more. Valura's retained margin does not move either way, which is why this can be agreed openly.`,
      meta: [
        ['Partner', d.displayName],
        ['Default split', VLR.fmt.pct(P.defaultSplit, 0)],
        ['Aligned to', 'Fees & Charges v4.1'],
        ['Agreed', p.splitsAgreedAt ? VLR.fmt.date(p.splitsAgreedAt) : 'Not yet agreed']
      ] })}

    <h2 class="sec"><span class="no">01</span>Brokerage — charged per trade on the amount transacted</h2>
    <table class="dt">
      <thead><tr>
        <th>Product</th><th class="num">Cost</th><th class="num">Valura keeps</th>
        <th class="num">Your split</th><th class="num">You earn</th><th class="num">Shareable</th><th class="num">Client pays</th>
      </tr></thead>
      <tbody>${brokerageRows}</tbody>
    </table>

    <h2 class="sec"><span class="no">02</span>Platform fee — charged per year on assets held</h2>
    <table class="dt">
      <thead><tr>
        <th>Product</th><th class="num">Cost</th><th class="num">Valura keeps</th>
        <th class="num">Your split</th><th class="num">You earn</th><th class="num">Client pays</th>
      </tr></thead>
      <tbody><tr${pr.platform.split !== P.defaultSplit ? ' class="hl"' : ''}>
        <td>${VLR.fmt.esc(pr.platform.label)}</td>
        <td class="num">${bps(pr.platform.costBps)}</td>
        <td class="num">${bps(pr.platform.valuraKeepsBps)}</td>
        <td class="num">${VLR.fmt.pct(pr.platform.split, 0)}</td>
        <td class="num"><b>${bps(pr.platform.partnerEarnsBps)} p.a.</b></td>
        <td class="num">${bps(pr.platform.clientPaysBps)} · ${pctOf(pr.platform.clientPaysBps)} p.a.</td>
      </tr></tbody>
    </table>
    <p class="fine">${VLR.fmt.esc(pr.platform.note)} ${VLR.fmt.esc(P.exempt)}</p>

    <h2 class="sec"><span class="no">03</span>Placement — pre-IPO and private markets</h2>
    <table class="dt">
      <thead><tr>
        <th>Product</th><th class="num">Cost</th><th class="num">Valura keeps</th>
        <th class="num">Your split</th><th class="num">You earn</th><th class="num">Client pays</th>
      </tr></thead>
      <tbody><tr${pr.placement.split !== P.defaultSplit ? ' class="hl"' : ''}>
        <td>${VLR.fmt.esc(pr.placement.label)}</td>
        <td class="num">${bps(pr.placement.costBps)}</td>
        <td class="num">${bps(pr.placement.valuraKeepsBps)}</td>
        <td class="num">${VLR.fmt.pct(pr.placement.split, 0)}</td>
        <td class="num"><b>${bps(pr.placement.partnerEarnsBps)}</b></td>
        <td class="num">${bps(pr.placement.clientPaysBps)} · ${pctOf(pr.placement.clientPaysBps)}</td>
      </tr></tbody>
    </table>
    <p class="fine">${VLR.fmt.esc(pr.placement.note)} Priced per deal and disclosed to the client before they commit.</p>

    <h2 class="sec"><span class="no">04</span>How the split works</h2>
    <div class="callout"><b>Your earning is Valura's retained margin, marked up by your split.</b>
      At ${VLR.fmt.pct(P.defaultSplit, 0)} you earn exactly what Valura keeps. Above that, the excess is
      added to what the client pays — it does not come out of Valura's margin, and it does not come out
      of anyone else's. The arithmetic is
      <span class="mono">you earn = Valura keeps × split ÷ (1 − split)</span>.</div>

    ${totalMarkup > 0.01 ? `<div class="callout warn"><b>This partner is priced above the standard split.</b>
      Across all products their clients pay ${bps(totalMarkup)} more than they would at
      ${VLR.fmt.pct(P.defaultSplit, 0)}. That is a commercial decision and a disclosure obligation:
      the amount this partner earns is stated to each client before the account is opened.</div>` : ''}

    <table class="dt">
      <thead><tr><th class="num">If your split were</th><th class="num">You earn on equity</th><th class="num">Client pays</th><th class="num">Valura keeps</th></tr></thead>
      <tbody>${[0.40, 0.50, 0.60, 0.70].map(s => {
        const l = VLR.Econ.priceLine(C.pricing.brokerage[0], s);
        return `<tr${Math.abs(s - pr.brokerage[0].split) < 1e-9 ? ' class="hl"' : ''}>
          <td class="num" style="text-align:left">${VLR.fmt.pct(s, 0)}</td>
          <td class="num">${bps(l.partnerEarnsBps)}</td>
          <td class="num">${bps(l.clientPaysBps)}</td>
          <td class="num">${bps(l.valuraKeepsBps)}</td></tr>`;
      }).join('')}
      </tbody>
    </table>
    <p class="fine">Valura's retained bps is identical on every row. That is the whole point of the structure.</p>

    <div class="sign-grid" style="margin-top:20px">
      <div class="sign-box"><div class="who">${VLR.fmt.esc(d.displayName)} — pricing agreed</div><div class="line"></div>
        <div class="f">${VLR.fmt.esc(p.signatoryName || '—')}<br>Date: ______________</div></div>
      <div class="sign-box"><div class="who">Valura — pricing approved</div><div class="line"></div>
        <div class="f">${VLR.fmt.esc(p.splitsAgreedBy || C.team.ADMIN.name)}<br>Date: ______________</div></div>
    </div>
    ${VLR.Doc.foot(p, d.ent.legalName + ' · ' + d.ent.licence, 'Partner pricing · forms Schedule A of the agreement')}
  </section>`;
};
