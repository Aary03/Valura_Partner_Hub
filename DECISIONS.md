# Decisions register

Everything in this file was **inferred rather than told**. It is in the code because the Hub
needed a number to run, not because anyone approved it. Each item names who should confirm it.
Nothing here should reach a partner, a bank or a regulator until it has been.

All of it lives in one place — `js/config.js` — so confirming an item is a one-line change.

---

## 1 · Tier share percentages — **commercial, needs Val + Aaryan**

`CONFIG.tiers[*].platformSharePct / brokerageSharePct / placementSharePct`

| Tier | Platform | Brokerage | Placement |
|---|---|---|---|
| Starter | 40% | 40% | 40% |
| Growth | 50% | 50% | 50% |
| Anchor | 55% | 55% | 55% |

**What was actually stated.** The executed Neoma paper used a flat 50%, but expressed it as a
*fixed 0.35% p.a.* — which is where the negative margin came from. The programme document
says the standard tier should become "a percentage of net revenue actually collected" but does
not say what percentage, or how the tiers differ.

**What the Hub did.** Kept Growth at 50% to match the executed paper, and spread Starter and
Anchor either side of it so the tiers have a commercial difference. This is a guess.

**Why it matters.** At Growth, 50% of the 0.30% platform fee is 0.15% p.a. on chargeable AUM.
On $1m of referred AUM at 60% rotation and 15% in fee-exempt funds, that is **$1,635 a year**.
The v1.0 paper illustrated **$4,100** on the same book. Any partner who saw the old
illustration will notice, and the honest answer is that the old number was never fundable.

---

## 2 · Anchor thresholds restated in USD — **commercial + legal, needs Val + Parthiban**

`CONFIG.anchorQualification`

- Personal AUM: **USD 1,200,000** (from ₹10 crore)
- Network: **5 sub-partners** with combined **USD 3,000,000** (from ₹25 crore)
- Both sustained **3 continuous months**

**What was actually stated.** §7 and Schedule B.1 state ₹10 crore and ₹25 crore. Every
payment obligation in the same agreement is in USD.

**What the Hub did.** Converted at **₹83 = $1** and stated the thresholds in USD only, so the
template carries one currency. The conversion rate is hard-coded at `CONFIG.ops.fxUsdInr`.

**Open question for a human.** Should the threshold be a USD figure fixed at signature, or an
INR figure converted at the measurement date? The two diverge materially over three years,
and the answer changes who qualifies.

---

## 3 · Schedule C incentive grid — **commercial, needs Aaryan**

`CONFIG.incentiveGrid`

Six published milestones from **$500** (first funded ticket inside 30 days) to **$15,000**
(USD 10m net new AUM sustained three months).

**What was actually stated.** Nothing. §5.1.1 promised an addendum and never defined it. The
programme document says to "ship as Schedule C, a published grid, or delete §5.1.1".

**What the Hub did.** Wrote a grid so Schedule C exists and §5.1.1 could be closed. Every
value is a placeholder. The *structure* — published, uniform, prospectively amendable, not
payable on termination for cause, measured on sustained rather than peak AUM — is the part
worth keeping; the numbers are not.

---

## 4 · Tier AUM targets and co-funding bands — **commercial, needs Aaryan**

`CONFIG.tiers[*].aumTargetY1Usd / clientTargetY1 / coFundingPct / spendBandInr`

Starter $1.5m · Growth $6m · Anchor $20m, with co-funding at 20 / 25 / 30%.

**What was actually stated.** The programme document marks the AUM targets as "placeholder —
Aaryan's model sets the real numbers" and confirms only the **20–30% co-funding participation**
and the INR spend bands. The co-funding percentages and spend bands are therefore given; the
AUM and client targets are invented.

These feed the business plan's ramp, its break-even month and the default term-sheet
illustration, so they are the most visible placeholders in the system.

---

## 5 · Valura's net placement income — **commercial, needs Val**

`CONFIG.placementEconomics[*].valuraNetTypical`

Structured products 1.50% · Pre-IPO 4.00% · Private funds 2.00% · Other 1.00%

**What was actually stated.** The Schedule A.2 note in the executed paper gives these as
examples — "approximately 2% on a typical 4% Pre-IPO placement, approximately 0.75% on a
typical 1.5% Structured Note placement, approximately 1% on a typical 2% Private Fund
subscription." The partner ceilings (0.75% / 2.00% / 1.00%) *are* stated in Schedule A.2.

**What the Hub did.** Treated the illustrative figures as the typical case and derived the
partner rate as `share × Valura net`, capped at the stated ceiling. So a Growth partner earns
50% of 4% = 2% on a typical Pre-IPO, exactly matching the note.

At Anchor, 55% of 4% is 2.2%, which the ceiling caps back to 2.00%. Whether the ceiling or the
share should win at the top tier is a commercial decision the Hub currently resolves in
Valura's favour.

---

## 6 · Withholding and GST in the statement specimen — **finance**

`js/docs/ops.js` — 10% withholding, 18% GST.

Indicative only, pending each partner's PAN and treaty documentation. The production statement
runs on the settled ledger; the specimen's structure and every *rate* are final, but the AUM,
traded value and placement figures are drawn from the business plan rather than the ledger,
and the statement says so on its face.

---

## 7 · Sub-partner tier assumption in the override calculation — **commercial**

`VLR.Econ.override()` defaults `subPartnerTierKey` to `GROWTH`.

The Anchor override is 20% of what the sub-partner earns under Schedule A, so the override
depends on the sub-partner's own tier. Until real sub-partner linkages exist in the record,
the illustration assumes every sub-partner is at Growth. Once linkages are stored, the
override should be summed across actual sub-partners rather than modelled.

---

## 8 · Contracting entity details for Hattword — **legal, needs Deepti**

`CONFIG.entities.HATTWORD`

The UAE entity carries only its name and CMA Category 5 Licence No. 20200000304, both taken
from the client Schedule of Fees & Charges. Its **registered address, governing law drafting,
arbitration seat and signatory are placeholders** — the Hub currently assumes UAE law and a
DIFC-LCIA seat with the same signatory as the India entity.

An agreement generated on the Hattword template today would need legal review before issue.
The India IFSC entity's details are complete and sourced from the executed paper and the
published fee schedule.

---

## 9 · Email and microsite addressing — **technology, needs Nithesh**

`CONFIG.ops.micrositeRoot = 'partner.valura.ai'` and the default address format
`firstname@{slug}.valura.ai`.

The programme document lists "Co-branded email ID provisioning — decide: subdomain vs partner
domain" as an open item (T12). The Hub assumes a Valura-managed subdomain per partner, and the
D+1 calendar item asks the partner for the name list on that basis. If the decision goes the
other way, the D+5 handover changes from "we created your mailboxes" to "here is your DNS
configuration", which is a materially worse partner experience and should be argued against.

---

## What is *not* inferred

These came directly from the source documents and can be relied on:

- **Client pricing** — 0.30% p.a. platform fee, GIFT City-domiciled and external funds exempt,
  0.22% brokerage with a $1 minimum, 20 bps custody on funds and structured products.
  Schedule of Fees & Charges v3.0, effective 5 August 2026.
- **Net retained brokerage of 0.12% out of 0.22% gross.** Stated in Schedule A.1 of the
  executed paper.
- **Entity identity** — Valura India IFSC Private Limited, IFSCA Broker Dealer Reg. No.
  CMI2026BDK1112, registered 30 July 2026, CIN U64990GJ2025PTC169870, GIFT City address.
- **Quarterly statement within 15 business days of quarter end** and a **15-day dispute
  window**. Clauses 5.3.2 and 5.3.5.
- **30 days' notice, 15 days to cure, 12-month liability cap, 3-year confidentiality
  survival, 6-month non-solicit, perpetual client-data restriction.** §10–§13.
- **The 20% Anchor override paid out of Valura's own share**, not deducted from the
  sub-partner. Schedule B.2.
- **Clause 18(a)** of the IFSCA global access framework requiring real-figure referral
  disclosure, and **clause 38(j)** requiring the undertaking that nothing undisclosed is
  collected.
- **The seven stages, their gates and the 30-day calendar shape.** Valura Distribution
  Partner Programme v1.0, 10 August 2026.

---

## Also worth fixing outside this Hub

Six items are flagged as incomplete on the face of the published client Schedule of Fees &
Charges v3.0. Two of them interact with this system directly:

1. **Referral disclosure at 10.2** is still `REFERRAL_DISCLOSURE`. The Hub now renders it per
   partner code — that resolver needs wiring into the client onboarding journey at KYC.
2. **Transfer-out and account closure charges** are `NIL / $__`. They must be stated even if
   nil, because of the clause 38(j) undertaking.
3. **Global mutual fund brokerage** is "actual cost + 30% handling margin". A formula over an
   undisclosed cost base is not a disclosed charge, because the client cannot compute it.
4. **Structured product custody** — the customer-facing pricing deck says 0.10% p.a.; the
   schedule says 20 bps. They contradict each other in public.
5. **Strategist consultation and AI "opportunities" alerts** need a scope check against
   execution-only status. A paid personal portfolio review is capable of amounting to
   investment advice. Licensing question, not a drafting one.
6. **The marketing deck** describes pricing as "indicative", which contradicts the 38(j)
   undertaking, and names competitors with specific figures, which the IFSCA advertisement
   code requires to be accurate, current and substantiable. It also shows valura.com /
   hello@valura.com while the rest of the suite uses valura.ai.

---

## 10 · Client platform fee — **two published documents disagree, needs Val**

`CONFIG.pricing.platform` and the published Schedule of Fees & Charges v4.1.

- The partner pricing model treats **35 bps as Valura's cost**, adds 6 bps that
  Valura keeps and 6 bps for the partner at a 50% split, so **the client pays
  47 bps a year**.
- The published **Schedule of Fees & Charges v4.1**, effective 5 August 2026,
  tells clients the platform fee is **0.35% per year**.

Those cannot both be true. Either the client schedule is understating the fee by
12 bps, or the pricing model has mislabelled the client price as a cost. This is
the same class of defect flagged against the v1.0 partner paper, and it is the
one number a client can check for themselves.

Nothing in the Hub resolves it. The pricing tab, Schedule A and the P&L all run
on the pricing model; the client-facing disclosure quotes it. **Neither should
go in front of a client until one of the two documents moves.**

## 11 · Brokerage in the client schedule vs the partner model

Schedule v4.1 charges clients 0.22% on equities and **0.20%** on bonds, mutual
funds, UCITS and structured products. The partner pricing model has equity at
22 bps and everything else at 20 bps, which reconciles. Confirmed, not inferred.

## 12 · The exclusivity clause — **removed on instruction**

`§2.6` of the Introducing Broker Agreement — *"This Agreement is non-exclusive.
Either Party may enter into similar arrangements with others, and Valura and its
affiliates may compete with the Introducing Broker in any aspect of its
business"* — has been removed in full. §2 now runs 2.1 to 2.5.

**What was deliberately left in place:** the words "non-exclusive" in §2.2 (the
IB acts as an independent, non-exclusive referrer) and §3.1 (the appointment
itself). Striking those would convert the appointment into an **exclusive** one
and commit Valura to a territory or segment. That is a commercial decision with
real consequences, not a tidy-up, and it was not what was asked for. If exclusive
appointment is intended, it needs drafting properly — scope, territory, term,
minimum volumes and what happens when they are missed.

## 13 · Referral disclosure has moved — **confirm the onboarding pack carries it**

Schedule v3.0 carried the disclosure at clause 10.2 as a `REFERRAL_DISCLOSURE`
placeholder. **v4.1 no longer has that clause.** Section 08 now says only that
what the introducing firm earns "is set out in your onboarding pack before you
open the account".

The obligation under clause 18(a) has not gone away — it has moved into the
onboarding pack. The Hub still resolves the figure per partner code and renders
it into the co-branded onboarding wrapper. **Someone must confirm that the pack
the client actually receives at KYC contains that rendered string**, because the
fee schedule no longer does.

## 14 · Global Access Provider named for the first time

Schedule v4.1 names **ViewTrade International IFSC Private Limited** as the
Global Access Provider through which trades are executed, cleared and held. The
Introducing Broker Agreement refers only to an unnamed "Execution & Custody
Partner" and reserves Valura's right to change it without notice. That is
consistent, but the two documents should be read together before either is
issued, since the client schedule names the entity and the partner agreement
does not.
