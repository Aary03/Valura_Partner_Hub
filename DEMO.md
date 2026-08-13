# Live demo — bringing a distributor on, end to end

Twelve minutes, one browser window, and a real signature request landing in a
real inbox at the end of it.

---

## Before anyone is in the room

**1 · Deploy is live and the API key is set.**
In the Hub, **Partner details → Connections**, paste the deployment URL and the
`HUB_API_KEY`, press **Test**. You want to see:

> Zoho **reachable** · Resend **configured** · DC in

If Zoho is not reachable, nothing else in this demo works. Fix it first.

**2 · Two inboxes you can show on screen.**
The signature request goes to two people in sequence. Use your own address for
the Valura side and a second address you can open live for the "partner" side —
a personal Gmail is ideal, because the audience recognises it.

**3 · A logo file to drop in.** Any PNG. The point is that it lands everywhere
within a second of dropping it.

**4 · Decide the split you will demo.** Standard is 50%. Going to 60% on equity
during the demo is the single most persuasive moment in it — do that one.

**5 · Create the demo partner but leave it empty.** New partner, name it after
whoever is watching if you want the room to sit up.

---

## The demo

### 1 · Start from the board — 30 seconds

**Pipeline → Board.**

> "Seven stages, one gate each. A stage cannot open until the gate before it is
> green. Nothing here is a status someone types — every gate is evidence."

Point at the gate panel on the right. Nine checks, some red. Do not dwell.

### 2 · Paste the partner in — 90 seconds

**Partner details.**

Type the legal name, registered address, CIN, signatory name and **the
signatory email you can open live**. Set the effective date to today.

Then drop the logo into the light box.

> "That is the entire data entry. Everything after this is generated."

### 3 · Show the calendar dating itself — 45 seconds

**Activation calendar.**

> "Day 0 is the signature date. Every date on this calendar is computed from it
> — including the contractual statement deadline, fifteen business days after
> quarter end, which is a clause not a preference."

Scroll to **D+1 · who needs a Valura email address** and **D+5 · mailboxes
created**. This is where you say Valura creates the mailboxes and the partner
configures nothing. Then **D+12 — Karmesh delivers the training**.

Click **Download .ics** so they see it is a real feed, not a picture.

### 4 · The moment that sells it — 2 minutes

**Pricing & revenue share.**

> "This is cost-plus. Every product has a hard cost and a fixed amount Valura
> keeps. Your share is a mark-up on top of both."

Drag **Equity, ETF & listed** from 50 to 60 and stop talking for a second.

Point at the three numbers that moved:

| | at 50% | at 60% |
|---|---|---|
| Partner earns | 6 bps | **9 bps** |
| Client pays | 22 bps | **25 bps** |
| Valura keeps | 6 bps | **6 bps** |

> "Your share went up by half. Your client pays three basis points more. Valura's
> margin did not move — which is why we can have this conversation with the
> numbers on the table instead of behind them."

Then the banner that appears:

> "And the Hub says it out loud: this partner's clients pay more than a standard
> partner's, and that amount is disclosed to every one of them before their
> account opens."

### 5 · The agreement, already written — 90 seconds

**Agreement & signing.**

Scroll into the document. Their name is in §1. Their mark is on the cover.
Schedule A shows **60%** and **25 bps** — the number you dragged thirty seconds
ago.

> "Nobody typed that. Schedule A reads the pricing tab. If we renegotiate the
> split tomorrow the agreement moves with it, and the business plan and the
> client disclosure move with it too. There is one number, in one place."

Point at the exclusivity banner:

> "One clause was removed from the template — the one that let Valura compete
> with the introducing broker. It is gone, and the Hub says which clause and why
> rather than quietly dropping it."

### 6 · Preview the file Zoho will get — 45 seconds

Click **Preview PDF**. A PDF downloads. Open it, jump to the **last page**.

> "Sixteen pages. The signature blocks are on the last one, after the schedules
> — so what gets signed is the whole instrument, not a cover page. And because
> the execution page is always last, the fields land correctly however long the
> agreement runs."

Nothing has been sent yet. Say so.

### 7 · Send it, live — 60 seconds

Enter the Valura signatory email. Click **Send for signature**.

The confirmation dialog names both recipients and the order. Read it aloud, then
confirm.

> "Valura counter-signs first, then it goes to the partner."

**Switch to the inbox.** The email from Zoho Sign is there, subject line
*Introducing Broker Agreement — Valura × [their name]*. Open it, click through
to the document, scroll to the last page, **sign it**.

Come back to the Hub. Click **Refresh status**.

> "Signed by Valura, waiting on the partner."

If you have the second inbox on screen, open that one and sign as the partner
too. Refresh again — status goes to **completed**, and **Download executed**
appears. That PDF carries the Zoho audit trail: who signed, when, from which IP.

### 8 · The pack — 45 seconds

**The partner pack → Build the full pack.**

> "Everything else was generated while we were talking."

Scroll fast. Microsite with their logo, visiting cards with variable data,
email signatures, social kit, certificate, guardrails card, business plan,
quarterly statement, and twelve emails already drafted in their brand.

### 9 · Send them a co-branded email — 45 seconds

**Email sequence → E01.**

> "Their logo, their accent colour, our disclosure footer. Drafted, not sent —
> the Hub has no authority to email anyone on its own."

Click **Send this one**, put your name in when it asks who is sending, confirm.
Open the inbox. It arrives co-branded.

---

## The two lines to close on

> "From an empty screen to a signed agreement and a co-branded welcome email:
> about ten minutes, and the only thing anyone typed was the partner's name and
> address."

> "The reason it is fast is not the templates. It is that the split lives in one
> place, and the agreement, the plan, the statement and what the client is told
> all read it. Nothing can disagree with anything else, because there is nothing
> to disagree with."

---

## What will go wrong, and what to say

| If | Say | Fix |
|---|---|---|
| **Send fails: "Not ready"** | "It is refusing because something is missing." Read the reason aloud — it names the field. | Fill it. This is a feature; do not apologise for it. |
| **Zoho email is slow** | Keep talking through the pack while it lands. It is usually under 30 seconds. | Refresh the inbox. |
| **Signature fields look wrong on the page** | Do not improvise. | Tell me — it means Zoho measures `y` from the bottom, and it is a one-line change in `api/sign/send.js`. |
| **Email arrives without the logo** | "The uploaded file is embedded — Gmail strips those. The hosted URL fixes it." | Set **Logo URL** in Partner details. The Hub warns about this before you send. |
| **Resend rejects the email** | "The sending domain is not verified yet." | Verify `valura.ai` in Resend, or set `RESEND_FROM` to a domain that is. |

---

## Two things a sharp audience will ask

**"Is the pricing consistent with what the client sees?"**
Not yet, and say so plainly. At a 50% split the platform fee lands at **47 bps**
to the client. The published Schedule of Fees & Charges v4.1 says **0.35% a
year**. 35 bps is the cost line in the partner model, not the client price. One
of those two documents has to move before either goes in front of a client.
It is written up in `DECISIONS.md`.

**"What happens to the revenue share if the agreement ends?"**
§8.1. It continues for as long as that client's assets stay with Valura,
whether or not the agreement is still live. It attaches to the clients
introduced, not to the contract.
