/* ============================================================================
   Valura Partner Activation Hub — THE ACTIVATION CALENDAR
   ----------------------------------------------------------------------------
   Every date in the partner relationship is derived from one input: the
   signature date. Signature to first funded ticket is five days, because the
   three tracks — what Valura builds, what the partner returns, and what they
   do together — run in parallel rather than in sequence. Change the date and
   the whole programme re-dates itself,
   including the contractual quarterly-statement deadline.
   Exports as a live ICS feed the partner can subscribe to.
   ==========================================================================*/

window.VLR = window.VLR || {};

VLR.Cal = (function () {

  const OWNER = { V: 'Valura', P: 'Partner', B: 'Both' };

  /* The programme. `d` is days from signature. Anything marked hard:true is
     a contractual or regulatory deadline, not a nicety.                    */
  const PROGRAMME = [
    /* ---- Before signature ------------------------------------------- */
    { d: -2, k: 'termsheet', stage: '01_pitch_price', owner: 'B', track: 'JOINT', hrs: 1, title: 'Pricing sheet and term sheet initialled',
      detail: 'The split is agreed per product on one page. Schedule A of the agreement reads it directly, so the contract stage is a signature rather than a second negotiation.' },
    { d: -1, k: 'agreement_out', stage: '02_contract', owner: 'V', track: 'VALURA', hrs: 0, title: 'Agreement issued for e-signature',
      detail: 'Generated from the partner record with their name, mark and agreed split. Sent through Zoho Sign by a named person — the Hub drafts, it never dispatches.' },

    /* ================= DAY 0 — signature, and everything that can start
       the same hour. The three tracks below run in parallel from here. */
    { d: 0, k: 'd0_exec', stage: '02_contract', owner: 'B', track: 'JOINT', hrs: 0, hard: true, title: 'Agreement executed — Day 0',
      detail: 'Every date below is computed from today. Go-live is Day 5, and most of what follows happens in parallel rather than in sequence.' },
    { d: 0, k: 'd0_welcome', stage: '03_onboard_kyb', owner: 'V', track: 'VALURA', hrs: 0, title: 'Welcome email · intake form · KYB pack issued',
      detail: 'One link, one action. Everything downstream generates from that form, so it goes out the moment the signature lands rather than the next morning.' },
    { d: 0, k: 'kickoff', stage: '03_onboard_kyb', owner: 'B', track: 'JOINT', hrs: 1, at: '16:00', title: 'Kickoff call · named owner · channel opened',
      detail: 'Same day as signature. The 5-day plan walked through, the WhatsApp group opened, the escalation path given in writing.' },
    { d: 0, k: 'email_ask', stage: '04_identity_kit', owner: 'V', track: 'VALURA', hrs: 0, ask: true, title: 'ASK — who needs a Valura email ID and a card?',
      detail: 'Asked on the kickoff call, not in a later email: full name, title, mobile, and whether each person needs a mailbox, a card or both. Valura creates the mailboxes; the partner configures nothing. Due back with the intake form tomorrow.' },
    { d: 0, k: 'brand_ask', stage: '04_identity_kit', owner: 'V', track: 'VALURA', hrs: 0, ask: true, title: 'ASK — logo, colours and shipping address',
      detail: 'Logo in light and dark at 1000px or more, primary and secondary hex, preferred lockup, and where the kit ships. The microsite and the whole collateral pack are blocked on this and on nothing else.' },

    /* ================= DAY 1 — partner returns; Valura starts building
       against whatever has already landed. Nothing waits for everything. */
    { d: 1, k: 'intake_due', stage: '03_onboard_kyb', owner: 'P', track: 'PARTNER', hrs: 0, hard: true, title: 'Intake form · KYB pack · brand kit · email-ID list due',
      detail: 'All four in one return. Compliance reviews documents as they arrive rather than waiting for a complete set, so a missing item delays only itself.' },
    { d: 1, k: 'kyb_review', stage: '03_onboard_kyb', owner: 'V', track: 'VALURA', hrs: 2, title: 'Compliance review — rolling, as documents land',
      detail: 'Approve, query or reject each document in the Hub with a timestamped note. Published turnaround is 24 hours from document completeness to partner code.' },
    { d: 1, k: 'build_start', stage: '04_identity_kit', owner: 'V', track: 'VALURA', hrs: 0, title: 'Microsite and collateral generation begins',
      detail: 'Starts the moment the brand kit lands, in parallel with compliance. Nothing here is designed per partner — it is generated from the logo and the two hex values.' },
    { d: 1, k: 'disclosure', stage: '03_onboard_kyb', owner: 'V', track: 'VALURA', hrs: 0, hard: true, title: 'Referral disclosure resolved and approved',
      detail: 'The remuneration figure is rendered from the agreed split and approved by a compliance user. The partner code cannot go live until this resolves — it is a hard gate, not a checklist item.' },

    /* ================= DAY 2 — the partner goes live. */
    { d: 2, k: 'code', stage: '03_onboard_kyb', owner: 'V', track: 'VALURA', hrs: 0, hard: true, title: 'Partner Code issued · portal logins live',
      detail: 'Written into the referral-disclosure renderer at the same moment. From here the partner can generate a client link that renders the correct disclosure.' },
    { d: 2, k: 'email_give', stage: '04_identity_kit', owner: 'V', track: 'VALURA', hrs: 0, title: 'Co-branded mailboxes created · credentials handed over',
      detail: 'Each mailbox provisioned, signature block pre-installed, forced password reset on first login. Valura manages DNS and MX centrally.' },
    { d: 2, k: 'microsite', stage: '04_identity_kit', owner: 'V', track: 'VALURA', hrs: 0, title: 'Microsite live · collateral pack delivered · cards to print',
      detail: 'partner.valura.ai/<slug> with the partner code baked into every client link. Publication requires the trademark licence to be signed.' },
    { d: 2, k: 'training', stage: '05_plan_enable', owner: 'B', track: 'JOINT', hrs: 2, at: '11:00', title: 'Training delivered — Karmesh',
      detail: 'Karmesh runs the nine modules as a single working session rather than leaving them to be found in a portal. Covers what may and may not be said, which is what Clause 4 and Clause 9 require evidence of.' },
    { d: 2, k: 'plan_ws', stage: '05_plan_enable', owner: 'B', track: 'JOINT', hrs: 2, at: '15:00', title: 'Business plan workshop',
      detail: 'Runs the same afternoon as training, on the same people. AUM target down to weekly calls, budget lines, and the month the book pays for itself.' },

    /* ================= DAY 3 — certified and ready to sell. */
    { d: 3, k: 'exam', stage: '05_plan_enable', owner: 'B', track: 'JOINT', hrs: 1, hard: true, title: 'Certification exam · business plan signed off',
      detail: 'Pass mark 80%. Certification is a hard gate on launch — there is no campaign without it, and it is the evidence a regulator would ask for.' },
    { d: 3, k: 'kit_del', stage: '06_launch', owner: 'V', track: 'VALURA', hrs: 0, title: 'Welcome kit delivered · guardrails card issued',
      detail: 'Certificate of accreditation, visiting cards, brochure and the two-page marketing guardrails card. The guardrails card is the one to read before anything is posted.' },
    { d: 3, k: 'campaign_ready', stage: '06_launch', owner: 'B', track: 'JOINT', hrs: 1, title: 'Launch campaign approved',
      detail: 'Valura creates, the partner marks up, both confirm. Four steps compressed into one working session because the artwork was generated on Day 2.' },

    /* ================= DAY 4 — the market hears about it. */
    { d: 4, k: 'launch_ann', stage: '06_launch', owner: 'B', track: 'JOINT', hrs: 0, touch: 'T1', title: 'Touch 1 — partner announcement',
      detail: "Co-branded email to the partner's client base, plus partner social. Sent from the partner's own channel, using approved artwork unaltered." },
    { d: 4, k: 'pr', stage: '06_launch', owner: 'V', track: 'VALURA', hrs: 0, touch: 'T2', title: 'Touch 2 — press note',
      detail: 'Trade media, where the tier warrants it. No comparative claim with figures unless accurate, current and substantiable under the IFSCA advertisement code.' },
    { d: 4, k: 'kyc', stage: '06_launch', owner: 'P', track: 'PARTNER', hrs: 0, title: 'First client KYCs in flight',
      detail: 'Every client link carries the partner code and renders the approved referral disclosure at KYC time.' },
    { d: 4, k: 'spotlight', stage: '06_launch', owner: 'V', track: 'VALURA', hrs: 0, touch: 'T3', title: 'Touch 3 — product spotlight',
      detail: 'Segmented email and WhatsApp. Factual product description from the approved fact sheets only.' },

    /* ================= DAY 5 — live. */
    { d: 5, k: 'funded', stage: '06_launch', owner: 'B', track: 'JOINT', hrs: 1, hard: true, title: 'First funded ticket · go-live review',
      detail: 'The launch gate. Funnel read end to end: reached → viewed → lead → KYC started → funded. Five days from signature.' },

    /* ================= After go-live — the running relationship. */
    { d: 7, k: 'roundtable', stage: '06_launch', owner: 'B', track: 'JOINT', hrs: 3, at: '18:30', touch: 'T4', title: 'Touch 4 — launch roundtable',
      detail: 'Top 20 clients, offline, Valura co-funded against the tier band. Held after go-live so the partner can already open accounts in the room.' },
    { d: 10, k: 'webinar', stage: '06_launch', owner: 'B', track: 'JOINT', hrs: 1, at: '17:00', touch: 'T5', title: 'Touch 5 — joint webinar',
      detail: 'Full book. Valura hosts and presents; the partner introduces and closes.' },
    { d: 12, k: 'wk1', stage: '07_run_review', owner: 'B', track: 'JOINT', hrs: 0.5, at: '10:00', title: 'Weekly input review',
      detail: 'Calls, meetings, IOIs, KYCs started. Inputs are managed; outputs are only observed. Runs weekly for the first 90 days.' },
    { d: 30, k: 'month1', stage: '07_run_review', owner: 'B', track: 'JOINT', hrs: 1, title: 'Month-one operating review',
      detail: 'Pipeline, funded AUM, statement preview, collateral requests, product feedback.' },
    { d: 90, k: 'qbr', stage: '07_run_review', owner: 'B', track: 'JOINT', hrs: 2, hard: true, title: 'Quarterly business review · tier reconfirmed',
      detail: 'Statement reconciliation, plan versus actual, Anchor eligibility checked against the Schedule B thresholds, tier reconfirmed or moved.' }
  ];

  /* ---------------------------------------------------------------------- */
  function addDays(iso, n) {
    const d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return d;
  }

  /* Quarter-end statement deadlines: 15 business days after each quarter end.
     Clause 5.3.2 — contractual, and the Hub treats it as a hard deadline.  */
  function businessDaysAfter(date, n) {
    const d = new Date(date.getTime());
    let added = 0;
    while (added < n) {
      d.setDate(d.getDate() + 1);
      const day = d.getDay();
      if (day !== 0 && day !== 6) added++;
    }
    return d;
  }

  function statementDeadlines(fromIso, count) {
    const start = new Date(fromIso + 'T00:00:00');
    const out = [];
    let y = start.getFullYear();
    let q = Math.floor(start.getMonth() / 3);
    for (let i = 0; i < (count || 4); i++) {
      const endMonth = q * 3 + 2;
      const qEnd = new Date(y, endMonth + 1, 0);
      if (qEnd >= start) {
        out.push({
          quarter: `Q${q + 1} ${y}`,
          quarterEnd: qEnd,
          due: businessDaysAfter(qEnd, VLR.CONFIG.ops.statementDueBusinessDays),
          disputeCloses: new Date(businessDaysAfter(qEnd, VLR.CONFIG.ops.statementDueBusinessDays).getTime()
            + VLR.CONFIG.ops.disputeWindowDays * 86400000)
        });
      } else { i--; }
      q++; if (q > 3) { q = 0; y++; }
    }
    return out;
  }

  /* Build the dated event list for a partner. ---------------------------- */
  function build(p) {
    const d = VLR.derive(p);
    const eff = p.effectiveDate;
    if (!eff) return { events: [], statements: [], ok: false };

    const events = PROGRAMME
      .filter(e => {
        if (e.touch === 'T2' && p.tier === 'STARTER') return false;   // no PR at Starter
        if (e.touch === 'T3' && p.tier === 'STARTER') return false;   // no co-funded event
        return true;
      })
      .map(e => {
        const date = addDays(eff, e.d);
        return {
          ...e,
          date,
          iso: VLR.fmt.iso(date),
          ownerLabel: OWNER[e.owner],
          stageLabel: (VLR.CONFIG.stages.find(s => s.key === e.stage) || {}).label || ''
        };
      })
      .sort((a, b) => a.date - b.date || a.d - b.d);

    /* Weekly input reviews, D+37 to D+90 */
    const weekly = [];
    for (let w = 19; w <= 88; w += 7) {
      const date = addDays(eff, w);
      weekly.push({
        d: w, k: 'wk' + w, stage: '07_run_review', owner: 'B', hrs: 0.5, at: '10:00',
        title: 'Weekly input review', recurring: true,
        detail: 'Calls, meetings, IOIs, KYCs started against the weekly input targets in the business plan.',
        date, iso: VLR.fmt.iso(date), ownerLabel: OWNER.B, stageLabel: 'Run & review'
      });
    }

    const statements = statementDeadlines(eff, 5).map(s => ({
      ...s,
      d: Math.round((s.due - new Date(eff + 'T00:00:00')) / 86400000)
    }));

    const stmtEvents = statements.map(s => ({
      d: s.d, k: 'stmt_' + s.quarter.replace(/\s/g, ''), stage: '07_run_review', owner: 'V',
      hrs: 0, hard: true, statement: true,
      title: `${s.quarter} statement due — contractual`,
      detail: `Clause 5.3.2 requires the statement within ${VLR.CONFIG.ops.statementDueBusinessDays} business days of quarter end (${VLR.fmt.date(s.quarterEnd)}). The partner's dispute window under Clause 5.3.5 closes ${VLR.fmt.date(s.disputeCloses)}.`,
      date: s.due, iso: VLR.fmt.iso(s.due), ownerLabel: OWNER.V, stageLabel: 'Run & review'
    }));

    const all = [...events, ...weekly, ...stmtEvents].sort((a, b) => a.date - b.date);
    return { events: all, core: events, weekly, statements, ok: true, derived: d };
  }

  /* ICS feed ------------------------------------------------------------- */
  function ics(p) {
    const { events, ok } = build(p);
    if (!ok) return '';
    const d = VLR.derive(p);
    const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const fold = s => s.replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

    const lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'PRODID:-//Valura//Partner Activation Hub//EN',
      `X-WR-CALNAME:Valura × ${fold(d.displayName)} — activation`,
      'X-WR-TIMEZONE:Asia/Kolkata',
      `X-WR-CALDESC:${fold('5-day activation programme, generated from the signature date ' + VLR.fmt.date(p.effectiveDate) + '. Partner code ' + (p.partnerCode || 'pending') + '.')}`,
      /* Timed events carry TZID=Asia/Kolkata. A strict parser rejects a TZID
         it has not been given, so the zone is defined here. IST has no DST. */
      'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata',
      'BEGIN:STANDARD', 'DTSTART:19700101T000000',
      'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST',
      'END:STANDARD', 'END:VTIMEZONE'
    ];

    events.forEach((e, i) => {
      const y = e.date.getFullYear();
      const m = String(e.date.getMonth() + 1).padStart(2, '0');
      const dd = String(e.date.getDate()).padStart(2, '0');
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${p.id}-${e.k}-${i}@valura.ai`);
      lines.push(`DTSTAMP:${stamp}`);
      if (e.hrs && e.at) {
        const [hh, mm] = e.at.split(':');
        const end = new Date(e.date.getTime());
        end.setHours(Number(hh), Number(mm), 0, 0);
        const s = new Date(end.getTime());
        end.setMinutes(end.getMinutes() + e.hrs * 60);
        const f = x => `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, '0')}${String(x.getDate()).padStart(2, '0')}T${String(x.getHours()).padStart(2, '0')}${String(x.getMinutes()).padStart(2, '0')}00`;
        lines.push(`DTSTART;TZID=Asia/Kolkata:${f(s)}`);
        lines.push(`DTEND;TZID=Asia/Kolkata:${f(end)}`);
      } else {
        const next = new Date(e.date.getTime()); next.setDate(next.getDate() + 1);
        lines.push(`DTSTART;VALUE=DATE:${y}${m}${dd}`);
        lines.push(`DTEND;VALUE=DATE:${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, '0')}${String(next.getDate()).padStart(2, '0')}`);
      }
      lines.push(`SUMMARY:${fold(`D${e.d >= 0 ? '+' : ''}${e.d} · ${e.title}`)}`);
      lines.push(`DESCRIPTION:${fold(e.detail + '\n\nOwner: ' + e.ownerLabel + '\nStage: ' + e.stageLabel + (e.hard ? '\nThis is a hard deadline.' : ''))}`);
      lines.push(`CATEGORIES:${fold(e.stageLabel)}`);
      if (e.hard) lines.push('PRIORITY:1');
      lines.push('BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY',
                 `DESCRIPTION:${fold(e.title)}`, 'END:VALARM');
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  return { build, ics, statementDeadlines, businessDaysAfter, PROGRAMME, OWNER };
})();
