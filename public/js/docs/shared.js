/* ============================================================================
   Shared document chrome — the ink band, the co-brand lockup, the footer.
   Every generated artefact composes from these so the brand cannot drift.
   ==========================================================================*/

window.VLR = window.VLR || {};
VLR.Doc = VLR.Doc || {};

VLR.Doc.MARK_GREEN = 'assets/valura-mark-green.png';
VLR.Doc.MARK_WHITE = 'assets/valura-mark-white.png';

/* The partner's mark sits in the partner slot of the lockup and nowhere else.
   It never replaces Valura's page background, ink or accent.               */
VLR.Doc.lockup = function (p, opts) {
  const o = opts || {};
  const d = VLR.derive(p);
  const onInk = o.onInk !== false;
  const abs = u => o.forEmail && u && !/^https?:/i.test(u)
    ? (location.origin + '/' + String(u).replace(/^\//, '')) : u;
  const mark = abs(onInk ? VLR.Doc.MARK_WHITE : VLR.Doc.MARK_GREEN);
  const col = onInk ? '#fff' : 'var(--ink)';
  /* Email clients drop data: URIs, so a co-branded email uses the hosted
     mark if one has been given and falls back to the partner's name in type
     rather than shipping a broken image. */
  const logo = o.forEmail
    ? (onInk ? (p.logoDarkUrl || p.logoLightUrl) : (p.logoLightUrl || p.logoDarkUrl))
    : (onInk ? (p.logoDark || p.logoLight) : (p.logoLight || p.logoDark));
  const partnerSlot = logo
    ? `<img class="pmark" src="${logo}" alt="">`
    : `<span class="pname" style="color:${onInk ? '#fff' : d.t ? p.primaryHex : 'var(--ink)'}">${VLR.fmt.esc(d.displayName)}</span>`;
  return `
    <div class="lockup ${p.lockup === 'stacked' ? 'stacked' : ''} ${onInk ? '' : 'on-light'}">
      <span class="mark" style="display:flex;align-items:center;gap:7px">
        <img src="${mark}" alt="Valura" style="width:${o.size || 18}px;height:${o.size || 18}px">
        <span class="pname" style="color:${col}">Valura</span>
      </span>
      <span class="div"></span>
      ${partnerSlot}
    </div>`;
};

/* The one ink band per document. */
VLR.Doc.band = function (p, { label, title, stand, meta, cobrand }) {
  const d = VLR.derive(p);
  const head = cobrand
    ? VLR.Doc.lockup(p, { onInk: true })
    : `<span class="mark"><img src="${VLR.Doc.MARK_WHITE}" alt="Valura"><span>Valura</span></span>`;
  return `
  <div class="band">
    <div class="brandline">
      ${head}
      <span class="doclbl">${VLR.fmt.esc(label || '')}</span>
    </div>
    <h1>${title}</h1>
    ${stand ? `<p class="stand">${stand}</p>` : ''}
    ${meta && meta.length ? `<div class="metarow">${meta.map(m =>
      `<div><div class="k">${VLR.fmt.esc(m[0])}</div><div class="v">${VLR.fmt.esc(m[1])}</div></div>`).join('')}</div>` : ''}
  </div>`;
};

VLR.Doc.foot = function (p, left, right) {
  const d = VLR.derive(p);
  return `<div class="pg-num">
    <span>${VLR.fmt.esc(left || (d.ent.legalName + ' · ' + d.ent.licence))}</span>
    <span>${VLR.fmt.esc(right || 'Confidential · ' + VLR.CONFIG.ops.templateVersion)}</span>
  </div>`;
};

VLR.Doc.eyebrow = function (text) {
  return `<div class="eyebrow-blk"><div class="lbl">${VLR.fmt.esc(text)}</div><div class="eyebrow-rule"></div></div>`;
};

/* Placement table used identically in Schedule A.2, the term sheet and the
   one-pager. One source, three documents.                                  */
VLR.Doc.placementTable = function (p, opts) {
  const d = VLR.derive(p);
  const rows = VLR.Econ.placement({ tierKey: p.tier, placementSharePct: d.placementSharePct });
  return `<table class="dt">
    <thead><tr>
      <th>Asset class</th>
      <th class="num">Valura net, typical</th>
      <th class="num">Partner share</th>
      <th class="num">Partner rate</th>
      <th class="num">Ceiling</th>
    </tr></thead>
    <tbody>${rows.map(r => `<tr>
      <td>${r.label}</td>
      <td class="num">${VLR.fmt.pct(r.valuraNetTypical)}</td>
      <td class="num">${VLR.fmt.pct(d.placementSharePct, 0)}</td>
      <td class="num"><b>${VLR.fmt.pct(r.partnerRate)}</b></td>
      <td class="num">${VLR.fmt.pct(r.ceiling)}</td>
    </tr>`).join('')}</tbody>
  </table>
  ${opts && opts.noNote ? '' : `<p class="fine">The partner rate is ${VLR.fmt.pct(d.placementSharePct, 0)} of Valura's net placement income on the relevant deal, capped at the ceiling shown. Where Valura earns more on a deal the partner's share rises with it; where Valura earns less, it falls. The actual rate for each placement is confirmed in writing before subscription. Ceilings are ceilings, not entitlements.</p>`}`;
};

/* The earnings ladder — agreement §6, term sheet and one-pager all call this. */
VLR.Doc.ladderTable = function (p, opts) {
  const d = VLR.derive(p);
  const o = opts || {};
  const rows = VLR.Econ.ladder({
    tierKey: p.tier, rotation: p.rotation, giftCityShare: p.giftCityShare,
    platformSharePct: d.platformSharePct, brokerageSharePct: d.brokerageSharePct
  });
  return `<table class="dt">
    <thead><tr>
      <th>Referred-Customer AUM</th>
      <th class="num">Platform fee leg</th>
      <th class="num">Brokerage leg</th>
      <th class="num">Annual recurring</th>
      ${o.inr ? '<th class="num">In INR</th>' : ''}
      <th class="num">Effective yield</th>
    </tr></thead>
    <tbody>${rows.map(r => `<tr>
      <td class="num" style="text-align:left">${VLR.fmt.usd(r.aum)}</td>
      <td class="num">${VLR.fmt.usd(r.detail.platformToPartner)}</td>
      <td class="num">${VLR.fmt.usd(r.detail.brokerageToPartner)}</td>
      <td class="num"><b>${VLR.fmt.usd(r.annual)}</b></td>
      ${o.inr ? `<td class="num">${VLR.fmt.inr(r.annual * VLR.CONFIG.ops.fxUsdInr)}</td>` : ''}
      <td class="num">${VLR.fmt.pct(r.yield)}</td>
    </tr>`).join('')}</tbody>
  </table>
  <p class="fine">Assumes ${VLR.fmt.pct(p.rotation, 0)} annual portfolio rotation and ${VLR.fmt.pct(p.giftCityShare, 0)} of assets in GIFT City-domiciled or external funds, which are exempt from the platform fee under the client Schedule of Fees &amp; Charges ${VLR.CONFIG.clientSchedule.version} and therefore generate no platform-fee share. Placement fees are additional and deal-specific. Figures are pre-tax and pre-FX projections, not a guarantee of compensation.</p>`;
};

/* Download / copy helpers ------------------------------------------------ */
VLR.Doc.download = function (filename, content, mime) {
  const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 200);
};

VLR.Doc.copy = function (text) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  const ta = document.createElement('textarea');
  ta.value = text; document.body.appendChild(ta); ta.select();
  document.execCommand('copy'); ta.remove();
  return Promise.resolve();
};
