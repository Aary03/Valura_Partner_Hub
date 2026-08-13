/* ============================================================================
   Valura Partner Activation Hub — THE ACTIVATION CALENDAR
   ----------------------------------------------------------------------------
   Every date in the partner relationship is derived from one input: the
   signature date. Change it and the whole 90-day programme re-dates itself,
   including the contractual quarterly-statement deadline.
   Exports as a live ICS feed the partner can subscribe to.
   ==========================================================================*/

window.VLR = window.VLR || {};

VLR.Cal = (function () {

  const OWNER = { V: 'Valura', P: 'Partner', B: 'Both' };

  /* The programme. `d` is days from signature. Anything marked hard:true is
     a contractual or regulatory deadline, not a nicety.                    */
  const PROGRAMME = [
    { d: -7, k: 'termsheet', stage: '01_pitch_price', owner: 'B', hrs: 1, title: 'Term sheet initialled',
      detail: 'Tier, shares, tail and launch budget agreed on one page. Schedule A is locked to this document — the agreement is generated from it, not renegotiated against it.' },
    { d: -3, k: 'agreement_out', stage: '02_contract', owner: 'V', hrs: 0, title: 'Agreement issued for e-signature',
      detail: 'Generated from the template with variable fields only. Schedules A, B (Anchor), C (incentive grid) and D (trademark licence) attached. Sent via Zoho Sign by a named person — the Hub drafts, it never dispatches.' },

    { d: 0, k: 'd0_exec', stage: '02_contract', owner: 'B', hrs: 0, hard: true, title: 'Agreement executed — Day 0',
      detail: 'Every date in this calendar is computed from today. The countdown to first funded ticket is 30 days.' },
    { d: 0, k: 'd0_welcome', stage: '03_onboard_kyb', owner: 'V', hrs: 0, title: 'Welcome email + intake form issued',
      detail: 'One tokenised link, one action: build the partner profile. Drafted in the Hub, reviewed, then sent by the named partner owner.' },
    { d: 0, k: 'd0_owner', stage: '03_onboard_kyb', owner: 'V', hrs: 0, title: 'Named Valura owner assigned',
      detail: 'One accountable person each side, published at kickoff along with the escalation path.' },

    { d: 1, k: 'kickoff', stage: '03_onboard_kyb', owner: 'B', hrs: 1, at: '11:00', title: 'Kickoff call · channel opened',
      detail: 'Introductions, the 30-day plan walked through, the WhatsApp/Slack group opened. Speed lives in the group; the record lives in the Hub.' },
    { d: 1, k: 'email_ask', stage: '04_identity_kit', owner: 'V', hrs: 0, ask: true, title: 'ASK — who needs a Valura email ID?',
      detail: 'On the kickoff call Valura asks the partner for the list of people who need a co-branded email address and a visiting card: full name, title, mobile, and the address format they prefer. Valura creates the mailboxes and hands over the credentials — the partner does not configure anything. Return the list with the intake form by D+3.' },

    { d: 3, k: 'intake_due', stage: '03_onboard_kyb', owner: 'P', hrs: 0, hard: true, title: 'Intake form + KYB pack due',
      detail: 'Entity, people, brand, digital, commercial, GTM, logistics and compliance sections — plus logo files, brand colours and the email-ID list. Everything downstream generates from this one form.' },
    { d: 3, k: 'brand_in', stage: '04_identity_kit', owner: 'P', hrs: 0, title: 'Brand kit received',
      detail: 'Logo in light and dark, SVG or PNG at 1000px or more, primary and secondary hex, preferred lockup, any usage restrictions.' },

    { d: 4, k: 'kyb_review', stage: '03_onboard_kyb', owner: 'V', hrs: 2, title: 'Compliance review of the KYB pack',
      detail: 'Approve, query or reject each document in the Hub with a timestamped note. Published turnaround: 48 hours from document completeness to partner code.' },

    { d: 5, k: 'code', stage: '03_onboard_kyb', owner: 'V', hrs: 0, hard: true, title: 'Partner Code issued · portal logins live',
      detail: 'The code is written into the referral-disclosure renderer at the same moment. It cannot go live until the disclosure string resolves and Compliance has approved it — clause 18(a) of the global access framework.' },
    { d: 5, k: 'email_give', stage: '04_identity_kit', owner: 'V', hrs: 0, title: 'Co-branded email IDs created and handed over',
      detail: 'Valura provisions each mailbox requested at D+1, sets up signatures from the generated signature block, and hands over credentials with a forced password reset on first login. DNS and MX are managed by Valura.' },

    { d: 7, k: 'proofs', stage: '04_identity_kit', owner: 'B', hrs: 1, title: 'Kit design proofs shared',
      detail: 'Visiting cards with variable data per named person, brochure, one-pager, email signature, social tiles and the welcome-kit insert — all generated from the brand kit, none designed by hand.' },
    { d: 7, k: 'plan_ws', stage: '05_plan_enable', owner: 'B', hrs: 2, at: '15:00', title: 'Business plan workshop',
      detail: 'AUM target, client count, ticket size, conversion assumptions, weekly input targets, budget lines and the month-by-month P&L in USD and INR.' },

    { d: 10, k: 'microsite', stage: '04_identity_kit', owner: 'V', hrs: 0, title: 'Microsite live · collateral pack delivered · cards to print',
      detail: 'partner.valura.ai/<slug> with the partner mark in the permitted co-brand position and the partner code baked into every client link. Publication requires the Schedule D trademark licence to be signed.' },

    { d: 12, k: 'training', stage: '05_plan_enable', owner: 'B', hrs: 1, at: '15:00', title: 'Training modules open — Karmesh delivers',
      detail: 'Karmesh issues the nine modules to the partner and runs the session. Self-paced thereafter. Ends in a scored exam. Certification evidences Clause 8.1 and 8.2 compliance if a regulator asks.' },

    { d: 14, k: 'exam', stage: '05_plan_enable', owner: 'B', hrs: 1, hard: true, title: 'Certification exam · business plan signed off',
      detail: 'Pass mark 80%. Certification is a hard gate on Stage 06 — there is no launch without it.' },

    { d: 15, k: 'kit_del', stage: '06_launch', owner: 'V', hrs: 0, title: 'Welcome kit delivered',
      detail: 'Box, diary, calendar, pen, accreditation certificate and the two-page marketing guardrails card.' },
    { d: 15, k: 'launch_ann', stage: '06_launch', owner: 'B', hrs: 0, touch: 'T1', title: 'Touch 1 — partner announcement',
      detail: "Co-branded email to the partner's client base plus partner social. Created by Valura, marked up by the partner, confirmed on the weekly call, then sent." },
    { d: 15, k: 'pr', stage: '06_launch', owner: 'V', hrs: 0, touch: 'T2', title: 'Touch 2 — press note',
      detail: 'Trade media. Growth and Anchor tiers only. No comparative claims with figures unless accurate, current and substantiable under the IFSCA advertisement code.' },

    { d: 17, k: 'roundtable', stage: '06_launch', owner: 'B', hrs: 3, at: '18:30', touch: 'T3', title: 'Touch 3 — launch roundtable',
      detail: 'Top 20 clients, offline, Valura co-funded against the tier band.' },

    { d: 20, k: 'webinar', stage: '06_launch', owner: 'B', hrs: 1, at: '17:00', touch: 'T4', title: 'Touch 4 — joint webinar',
      detail: 'Full book. Valura hosts and presents; the partner introduces and closes.' },

    { d: 21, k: 'kyc', stage: '06_launch', owner: 'P', hrs: 0, title: 'First client KYCs in flight',
      detail: 'Every client link carries the partner code and renders the approved referral disclosure at KYC time.' },

    { d: 22, k: 'spotlight', stage: '06_launch', owner: 'V', hrs: 0, touch: 'T5', title: 'Touch 5 — product spotlight',
      detail: 'Segmented email and WhatsApp. Factual product description from the approved fact sheets only.' },

    { d: 25, k: 'allocation', stage: '06_launch', owner: 'B', hrs: 0, touch: 'T6', title: 'Touch 6 — first allocation drive',
      detail: 'The live deal menu to the warm list. Placement economics per Schedule A.2.' },

    { d: 28, k: 'nudge', stage: '06_launch', owner: 'V', hrs: 0, touch: 'T7', title: 'Touch 7 — closing nudge',
      detail: 'Triggered to non-converters. Approved copy, unchanged.' },

    { d: 30, k: 'funded', stage: '06_launch', owner: 'B', hrs: 1, hard: true, title: 'First funded ticket · 30-day review',
      detail: 'The Stage 06 gate. Funnel read end to end: reached → viewed → lead → KYC started → funded.' },

    { d: 37, k: 'wk1', stage: '07_run_review', owner: 'B', hrs: 0.5, at: '10:00', weeklyFrom: true, title: 'Weekly input review',
      detail: 'Calls, meetings, IOIs, KYCs started. Inputs are managed; outputs are only observed. Runs weekly for the first 90 days.' },

    { d: 60, k: 'month2', stage: '07_run_review', owner: 'B', hrs: 1, title: 'Monthly operating review',
      detail: 'Pipeline, funded AUM, statement preview, collateral requests, product feedback.' },

    { d: 90, k: 'qbr', stage: '07_run_review', owner: 'B', hrs: 2, hard: true, title: 'Quarterly business review · tier reconfirmed',
      detail: 'Statement reconciliation, plan versus actual, Anchor eligibility checked against the Schedule B.1 thresholds, tier reconfirmed or moved.' }
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
    for (let w = 44; w <= 88; w += 7) {
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
      `X-WR-CALDESC:${fold('30-day activation programme, generated from the signature date ' + VLR.fmt.date(p.effectiveDate) + '. Partner code ' + (p.partnerCode || 'pending') + '.')}`,
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
