# Valura Partner Activation Hub

A single internal system of record that takes a distribution partner from first meeting to
first funded ticket in 30 days, and produces every document that relationship needs.

You paste the partner's details, drop in their logo, pick a tier and set a signature date.
The agreement, term sheet, economics one-pager, segment brief, intake form, KYB record,
client-facing referral disclosure, 90-day calendar, microsite, visiting cards, email
signatures, social kit, accreditation certificate, guardrails card, launch invite, client
onboarding wrapper, welcome-kit insert, letterhead, business plan, quarterly statement and a
twelve-message email sequence are all generated from that one record.

## Running it

The Hub itself needs no build step and no server. Everything generates, renders and prints
in the browser, and the partner record lives in `localStorage`:

```bash
python3 -m http.server 4321 --directory public
```

Three fictional partners are seeded at different stages on first run, so the board is not
empty: **Neoma Capital** (Growth, live), **Sagara Wealth** (Starter, mid-KYB) and
**Aurum Network** (Anchor, pre-contract).

Three things a browser cannot do alone live in `/api` as serverless functions — putting an
agreement out for signature, sending a drafted message, and producing a PDF file without a
print dialog. To run those locally:

```bash
npm install && npx vercel dev
```

## Deploying

Import the repository into Vercel. It is a static site in `public/` plus Node functions in
`api/`; no framework preset is needed. Then set the environment variables from
`.env.example` under **Project → Settings → Environment Variables**:

| Variable | What it is |
|---|---|
| `ZOHO_SIGN_CLIENT_ID` / `_SECRET` / `_REFRESH_TOKEN` | Zoho API console app, scoped `ZohoSign.documents.ALL` |
| `ZOHO_SIGN_DC` | The data centre the Zoho account is in — `in` for India |
| `RESEND_API_KEY`, `RESEND_FROM` | Only used when a human clicks Send on a drafted message |
| `HUB_API_KEY` | A long random string. Every `/api` route requires it. |

`HUB_API_KEY` is what stops anyone who finds the deployment URL from sending documents under
Valura's Zoho account. Generate one with `python3 -c "import secrets;print(secrets.token_urlsafe(32))"`,
put it in Vercel, and paste the same value into the Hub under **Partner details →
Connections**. It is held in `localStorage` on the operator's machine, never in the partner
record and never in the repository.

## Sending an agreement for signature

**Agreement & schedules → Send for signature.** The Hub renders the e-sign copy, uploads it
to Zoho Sign, places the signature and date fields, and dispatches. Valura counter-signs
first, then it goes to the partner's named signatory.

Two details make this reliable rather than fiddly:

- **The e-sign copy carries its signature blocks once, on a fixed-geometry final page, after
  the schedules.** What gets signed is the whole instrument. And because the execution sheet
  is always last, the field placement resolves to `pageCount − 1` no matter how long the body
  runs — the agreement renders to 15 PDF pages from 10 HTML sheets, and that does not matter.
- **The field coordinates come from `VLR.ESIGN` in `public/js/docs/agreement.js`**, the same
  constant that draws the placeholder boxes on the page. Move a box and the signature field
  moves with it. There is no second set of coordinates to keep in step. Pixels at 96 dpi
  convert to PDF points at 72 dpi by × 0.75.

**Preview PDF** renders and downloads the exact file Zoho would receive without sending
anything. Use it the first time.

The Hub refuses to send an agreement that has no effective date, no named signatory, no
registered address, or a non-standard term carrying fewer than two approvals — the same
refusals the server applies, shown before the click rather than as an error after it.

## The one file you edit

`js/config.js` holds every commercial and regulatory constant: the two contracting entities,
the client fee schedule, tier definitions, placement economics, Anchor thresholds, the
Schedule C incentive grid, the KYB pack, the training modules and the seven stages with their
gates. Change a number there and the agreement, the term sheet, the one-pager, the business
plan, the statement and the client disclosure all move together.

Nothing downstream hard-codes a rate.

## One calculation, everywhere

`js/economics.js` is the only place partner earnings are computed. §6 of the agreement, the
term sheet, the one-pager, the segment brief, the business plan, the quarterly statement and
the client referral disclosure all call it.

The executed v1.0 paper failed this test: the agreement's §6 illustration added 0.35% and
0.06% to reach 0.41%, while its own text said brokerage was charged on 60% rotation, which
gives 0.386%. Two numbers, one document, quietly disagreeing. That class of bug is why this
file exists.

## What changed in the agreement, and why

`js/docs/agreement.js` generates **Partner Agreement v2.0**. Against the executed v1.0 paper:

| | Defect in v1.0 | v2.0 |
|---|---|---|
| **1** | Schedule A.1 paid a fixed **0.35% p.a.** out of a platform fee the client Schedule of Fees & Charges v3.0 sets at **0.30% p.a.**, and paid it on GIFT City fund AUM, which is exempt entirely. Five basis points of negative margin per rupee, and a total loss on exempt assets. | The partner is paid **a percentage of what Valura actually collects**. A new defined term, *Chargeable AUM*, excludes fee-exempt assets. The margin cannot go negative by construction, and the clause survives any future repricing. |
| **2** | §10.4(iv) and Schedule A.3 granted a **perpetual, uncapped tail** to every partner, ending only on voluntary client closure or termination for fraud. | Tail by tier: **24 months Starter, 36 months Growth, perpetual at Anchor only.** |
| **3** | §5.1.1 promised an incentive addendum "to be mutually agreed within thirty days" and expressly preserved a right to negotiate one forever after. | Replaced by **Schedule C**, a published grid applying uniformly at each tier, with an explicit statement that no separate addendum is contemplated and neither party is obliged to negotiate one. |
| **4** | Anchor thresholds in §7 and Schedule B.1 were in **INR crore** while every payment obligation was in **USD**. | One currency throughout. Thresholds restated in USD — see `DECISIONS.md`, the conversion needs confirming. |
| **5** | No trademark or co-branding licence existed, despite co-branded microsites, cards and client documents being part of the programme. | **Schedule D** — limited, non-exclusive, revocable, no sub-licensing, written artwork approval, automatic termination with take-down obligations on both sides. |
| **6** | §11.3 was drafted but there was no data-protection addendum. | **§16** with a Client Data Addendum hook, a 72-hour breach notification, and a prohibition on client personal data in URLs. |
| **7** | Nothing obliged the partner to route introductions through a tracked code. | **§8.7** — introductions must go through a tracked link or code so the clause 18(a) disclosure actually reaches the client. |

## The regulatory gate

Clause 18(a) of the IFSCA *Regulatory Framework for Global Access in the IFSC* requires the
remuneration payable to a client's introducing firm to be disclosed to that client. Clause
10.2 of the client Schedule of Fees & Charges currently carries the placeholder
`REFERRAL_DISCLOSURE`.

`VLR.Econ.disclosure()` resolves a partner code to a real figure — "0.15% per annum of the
chargeable assets you hold, that is $150 a year for every $100,000 held" — versioned, with
the version stamped on every document that renders it.

**A partner code cannot be marked live until that string resolves and a compliance user has
approved it.** The Hub enforces this as a hard gate. `VLR.readiness()` returns the nine
checks; the pipeline board, the fact sheet and the pack view all read from it.

## Constraints the Hub enforces

1. Nothing is auto-sent to a partner or a client. Every message is drafted, queued and
   dispatched by a named human — the Hub has no send credentials and is not meant to.
2. No partner code goes live without a resolving, compliance-approved referral disclosure.
3. No non-standard term enters an agreement without two recorded approvals.
4. Partner earnings are never presented from a second calculation.
5. No client personal data in URLs or query strings.
6. Every commercial term carries an effective date. Rates change; history survives the change.

## Layout

```
public/index.html            the Hub shell
public/print.html            headless render target — shares every generator with the Hub
public/css/tokens.css        Valura design tokens
public/css/hub.css           application chrome
public/css/doc.css           generated documents and collateral, at fixed page sizes
public/js/config.js          ← the only file you edit for commercial policy
public/js/economics.js       the earnings illustrator — one calculation, everywhere
public/js/state.js           the partner record, derived values, go-live readiness, storage
public/js/calendar.js        the 90-day programme and the ICS feed
public/js/api.js             client for the server routes
public/js/docs/shared.js     ink band, co-brand lockup, shared tables
public/js/docs/agreement.js  Partner Agreement v2.0 + Schedules A–D, and VLR.ESIGN geometry
public/js/docs/commercial.js term sheet, one-pager, fact sheet, referral disclosure
public/js/docs/emails.js     the twelve-message sequence
public/js/docs/collateral.js microsite, cards, signatures, social, certificate, guardrails …
public/js/docs/ops.js        intake form, KYB record, business plan, quarterly statement
public/js/main.js            views and event handling

api/_lib/zoho.js             Zoho OAuth and the two-step send
api/_lib/render.js           HTML → PDF through the Hub's own rendering
api/_lib/http.js             auth, body parsing, error shape
api/sign/send.js             render, place fields, dispatch
api/sign/status.js           where a request has got to
api/sign/download.js         the executed copy
api/email/send.js            one drafted message, sent by a named human
api/pdf.js                   any artefact as a PDF file
api/health.js                which integrations are configured and reachable

DECISIONS.md                 everything inferred rather than told — confirm before it hardens
```

## Printing

Every generated artefact is laid out at a fixed page size (A4 portrait at 794 × 1123 px,
landscape at 1123 × 794 px, both 96 dpi). **Print / PDF** on any view prints just the
document. **The partner pack → Build the full pack** assembles fifteen documents into one
print job in the order a partner should receive them.
