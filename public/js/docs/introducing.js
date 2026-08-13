/* ============================================================================
   INTRODUCING BROKER AGREEMENT v5.1 — Client Referral & Revenue Share
   ----------------------------------------------------------------------------
   Generated from the partner record. Source: Valura_Introducing_Broker_
   Agreement_v5.docx, with one change made on instruction:

   [REMOVED] §2.6 "Non-exclusive" — the standalone clause reading "This
             Agreement is non-exclusive. Either Party may enter into similar
             arrangements with others, and Valura and its affiliates may
             compete with the Introducing Broker in any aspect of its
             business." §2 now runs 2.1 to 2.5.

   What deliberately REMAINS, because removing it would do something much
   larger than was asked: the words "non-exclusive" in §2.2 (the IB acts as an
   independent, non-exclusive referrer) and §3.1 (the appointment itself).
   Striking those would convert the appointment into an exclusive one and
   commit Valura to a territory or segment. That is a commercial decision, not
   a tidy-up. See the note in the Hub above this document.

   Every bracketed figure in the source is in VLR.CONFIG.ibTerms.
   ==========================================================================*/

window.VLR = window.VLR || {};
VLR.Doc = VLR.Doc || {};

VLR.Doc.introducingBroker = function (p, opts) {
  const o = opts || {};
  const d = VLR.derive(p);
  const C = VLR.CONFIG;
  const T = C.ibTerms;
  const ent = C.entities.VALURA_INDIA_IFSC;

  const v = (val, name) => `<span class="vf${o.showVars ? ' vf-on' : ''}" data-f="${name}">${VLR.fmt.esc(val == null || val === '' ? '—' : val)}</span>`;
  const n = x => `<span class="mono">${x}</span>`;
  const pages = [];

  /* -- COVER · PARTIES -------------------------------------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.band(p, {
      label: `${T.version} · Client referral & revenue share`, cobrand: true,
      title: `You introduce. <em>We carry the licence.</em>`,
      stand: `Valura is the IFSCA-registered Broker Dealer and is responsible, as principal, for execution, clearing, settlement, custody and the client relationship. The Introducing Broker solicits and refers clients, and is paid a share of the revenue those clients generate — for as long as their assets stay.`,
      meta: [
        ['Effective date', p.effectiveDate ? VLR.fmt.date(p.effectiveDate) : '—'],
        ['Introducing Broker', d.displayName],
        ['Tier', p.tier === 'ANCHOR' ? 'Anchor Partner' : (d.isSubPartner ? 'Sub-Distributor' : 'Introducing Broker')],
        ['Governing law', 'Gujarat, India · IFSCA']
      ]
    })}

    <h2 class="sec"><span class="no">A</span>Valura — the Broker Dealer (Principal)</h2>
    <table class="dt"><tbody>
      <tr><td style="width:32%">Legal name</td><td>${VLR.fmt.esc(ent.legalName)} (&ldquo;Valura&rdquo;)</td></tr>
      <tr><td>Constitution</td><td>Private company limited by shares, incorporated under the Companies Act, 2013</td></tr>
      <tr><td>Corporate Identity No.</td><td>${VLR.fmt.esc(ent.cin)}</td></tr>
      <tr><td>Registered / principal address</td><td>${VLR.fmt.esc(ent.address)}</td></tr>
      <tr><td>Regulatory authority</td><td>International Financial Services Centres Authority (&ldquo;IFSCA&rdquo;), GIFT City IFSC — ${VLR.fmt.esc(ent.licence)}</td></tr>
    </tbody></table>

    <h2 class="sec"><span class="no">B</span>Introducing Broker — the Referrer</h2>
    <table class="dt"><tbody>
      <tr><td style="width:32%">Legal name</td><td>${v(p.legalName, 'ib_legal_name')} (the &ldquo;Introducing Broker&rdquo; or &ldquo;IB&rdquo;)</td></tr>
      <tr><td>Constitution</td><td>${v(p.constitution || '', 'ib_constitution')}</td></tr>
      <tr><td>Registration no. (CIN / LLPIN / GST / PAN)</td><td>${v([p.cin, p.pan, p.gst].filter(Boolean).join(' · '), 'ib_registration')}</td></tr>
      <tr><td>Principal address</td><td>${v(p.registeredAddress, 'ib_address')}</td></tr>
      <tr><td>Jurisdiction of operation</td><td>${v(p.country || 'India', 'ib_jurisdiction')}</td></tr>
      <tr><td>Regulatory registrations held</td><td>${v(p.regRegistrations || 'None declared', 'ib_registrations')}</td></tr>
      <tr><td>Permitted Client segments</td><td>${v(p.clientSegments || 'Indian residents (LRS), NRIs and OCIs — as applicable', 'ib_segments')}</td></tr>
      <tr><td>Primary contact</td><td>${v([p.signatoryName, p.signatoryTitle, p.signatoryEmail, p.signatoryMobile].filter(Boolean).join(' · '), 'ib_contact')}</td></tr>
      <tr><td>Revenue-share bank account</td><td>${v([p.bankName, p.bankAccount, p.swift].filter(Boolean).join(' · ') || 'As set out in Schedule A', 'ib_bank')}</td></tr>
      <tr class="hl"><td>Effective Date</td><td>${v(p.effectiveDate ? VLR.fmt.date(p.effectiveDate) : '', 'effective_date')}</td></tr>
    </tbody></table>

    <h2 class="sec"><span class="no">§</span>Background</h2>
    <p>(A) Valura is a company incorporated in India with its registered office at GIFT City, Gandhinagar, and is registered with and licensed by IFSCA as a Broker Dealer authorised to provide Global Access to global securities markets under the IFSCA Act, 2019, the IFSCA (Capital Market Intermediaries) Regulations, 2025 and the IFSCA framework and circulars governing Global Access. Valura provides onboarding, execution, clearing, settlement, custody, foreign exchange, corporate actions, reporting and client servicing in respect of global securities, in each case directly or through its execution and custody partners.</p>
    <p>(B) The Introducing Broker is engaged in the business of ${v(p.ibBusiness || (d.seg.label.toLowerCase() + ' services'), 'ib_business')} and wishes to solicit and refer clients to Valura so that such clients may avail Valura's Global Access Services, in consideration of a revenue share. Valura is willing to accept such referrals on the terms of this Agreement.</p>
    <p>(C) The Introducing Broker does not, and shall not hold itself out to, execute orders, clear or settle transactions, hold or control client money or securities, or provide the Global Access Services — all of which are provided by Valura as principal. The Introducing Broker's role is limited to soliciting and referring clients and to the first-line facilitation expressly set out in this Agreement.</p>
    <p>NOW THEREFORE, in consideration of the mutual promises below, the Parties agree as follows:</p>
    ${VLR.Doc.foot(p, ent.legalName + ' · ' + ent.licence, `Parties and background · ${T.version}`)}
  </section>`);

  /* -- 1 DEFINITIONS · 2 STRUCTURE · 3 APPOINTMENT ---------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.eyebrow('Definitions · structure · appointment')}

    <h2 class="sec"><span class="no">1</span>Definitions and interpretation</h2>
    <p>1.1 In this Agreement, unless the context requires otherwise:</p>
    <div class="defn">(a) <b>&ldquo;Applicable Law&rdquo;</b> means all laws, rules, regulations, circulars, directions, guidelines, notifications and statutory requirements of any jurisdiction applicable to a Party, its Clients or the services, including (as regards Valura) the IFSCA Act, 2019, the IFSCA (Capital Market Intermediaries) Regulations, 2025, the IFSCA (Anti-Money Laundering, Counter-Terrorist Financing and Know Your Customer) Guidelines, 2022, the IFSCA circulars on Global Access, the Prevention of Money-Laundering Act, 2002 and the rules thereunder, and the Digital Personal Data Protection Act, 2023; and (as regards the Introducing Broker) all laws, licensing and registration requirements applicable to it and its referral activity in its jurisdiction of operation.</div>
    <div class="defn">(b) <b>&ldquo;Business Day&rdquo;</b> means a day (other than a Saturday, Sunday or public holiday) on which banks and the relevant exchanges are open for business in GIFT City IFSC, India.</div>
    <div class="defn">(c) <b>&ldquo;Client&rdquo;</b> means a person or entity introduced by the Introducing Broker to Valura who opens, or applies to open, a Client Account. Upon onboarding, the Client is the client of Valura for the Global Access Services.</div>
    <div class="defn">(d) <b>&ldquo;Client Account&rdquo;</b> or <b>&ldquo;Account&rdquo;</b> means an account established and maintained by Valura for a Client.</div>
    <div class="defn">(e) <b>&ldquo;Execution &amp; Custody Partner&rdquo;</b> means any broker, clearing member, custodian, bank or other third party engaged by Valura to provide execution, clearing, settlement, custody or related services underlying the Global Access Services. The identity, terms, addition, removal and replacement of such partners are at Valura's sole discretion, and the Introducing Broker has no direct relationship with them.</div>
    <div class="defn">(f) <b>&ldquo;Global Access Services&rdquo;</b> (also &ldquo;Broker Dealer Services&rdquo;) means the brokerage and related services provided by Valura to Clients as described in Recital (A), whether provided directly by Valura or through an Execution &amp; Custody Partner.</div>
    <div class="defn">(g) <b>&ldquo;KYC/CDD&rdquo;</b> means know-your-customer and customer due-diligence requirements under Applicable Law and Valura's policies.</div>
    <div class="defn">(h) <b>&ldquo;Referral&rdquo;</b> means the introduction of a prospective Client by the Introducing Broker to Valura in accordance with this Agreement.</div>
    <div class="defn">(i) <b>&ldquo;Revenue Share&rdquo;</b> means the compensation payable to the Introducing Broker as set out in Schedule A.</div>
    <div class="defn">(j) <b>&ldquo;Confidential Information&rdquo;</b> has the meaning given in Section 13.</div>
    <div class="defn">(k) <b>&ldquo;Marks&rdquo;</b> means the names, logos, trademarks and brand elements of a Party.</div>
    <p>1.2 <b>Interpretation.</b> Headings are for convenience only. References to a statute or regulation are to that instrument as amended and in force from time to time, and such changes are automatically incorporated. The Schedules form part of this Agreement. &ldquo;Including&rdquo; means &ldquo;including without limitation&rdquo;.</p>

    <h2 class="sec"><span class="no">2</span>Structure and relationship of the Parties</h2>
    <p>2.1 <b>Valura as principal.</b> Valura is the IFSCA-registered Broker Dealer and is solely responsible, as principal, for providing the Global Access Services and for the Client relationship, subject to the allocation of responsibilities in this Agreement. The Introducing Broker does not provide, and shall not represent that it provides, brokerage, execution, clearing, custody, settlement or investment services.</p>
    <p>2.2 <b>Introducing Broker as independent referrer.</b> The Introducing Broker acts solely as an independent, non-exclusive referrer of Clients. Nothing in this Agreement creates any partnership, joint venture, agency, employment or fiduciary relationship between the Parties. The Introducing Broker has no authority to open or approve Accounts, accept or transmit orders, bind Valura, resolve disputes for Valura, or make representations on Valura's behalf, except as expressly authorised in writing.</p>
    <p>2.3 <b>No handling of Client money, securities or orders.</b> The Introducing Broker shall not receive, hold, control or have signatory authority over any Client money or securities, and shall not receive, route, transmit or execute Client orders. All Client funds and securities move only between the Client and Valura, or its Execution &amp; Custody Partner.</p>
    <p>2.4 <b>Execution &amp; Custody Partner.</b> Client transactions are executed, cleared, settled and custodied by Valura through its Execution &amp; Custody Partners. Valura may add, remove or replace any such partner at its discretion and without the consent of, or notice to, the Introducing Broker; any such change does not constitute a breach of this Agreement and does not affect the Introducing Broker's obligations.</p>
    <p>2.5 <b>Valura's discretion over Clients and Accounts.</b> Valura may, in its sole discretion, accept or reject any Referral or Client, impose conditions, and suspend, restrict, close or decline to open any Account, and may conduct its own KYC/CDD, AML screening and transaction surveillance, in each case without liability to the Introducing Broker. Acceptance of a Client is conditional on Valura's satisfactory KYC/CDD and receipt of complete and accurate Client information.</p>

    <h2 class="sec"><span class="no">3</span>Appointment and scope of referral</h2>
    <p>3.1 <b>Appointment.</b> Valura appoints the Introducing Broker as a non-exclusive introducing broker to solicit and refer Clients, and the Introducing Broker accepts such appointment, on the terms of this Agreement.</p>
    <p>3.2 <b>Client segments and territory.</b> The Introducing Broker may refer Clients only within the permitted Client segments and territory stated in the Parties table, only where it is lawful for the Introducing Broker to solicit and refer such Clients, and only in segments Valura is able to onboard.</p>
    <p>3.3 <b>Manner of referral.</b> Referrals shall be made in the manner notified by Valura from time to time. Valura may prescribe onboarding journeys, referral links or codes, and technology for identifying and attributing Referrals for Revenue Share purposes.</p>
    <p>3.4 <b>No advice.</b> Unless the Introducing Broker is separately and appropriately licensed and the Parties expressly agree in writing, the Introducing Broker shall not provide investment advice, research recommendations on specific securities, or portfolio management to Clients, and shall present only factual, Valura-approved information about the Global Access Services.</p>
    ${VLR.Doc.foot(p, ent.legalName, `§1–§3 · ${T.version}`)}
  </section>`);

  /* -- 4 IB DUTIES ------------------------------------------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.eyebrow('Duties of the Introducing Broker')}
    <h2 class="sec"><span class="no">4</span>Duties and obligations of the Introducing Broker</h2>
    <p>In addition to its obligations elsewhere in this Agreement, the Introducing Broker represents, warrants and covenants that:</p>
    <ol type="a">
      <li><b>Own licensing and lawful activity.</b> The Introducing Broker has examined Applicable Law in its jurisdiction and has itself determined, and shall maintain, all registrations, licences and approvals required for it to solicit and refer Clients, including any requirements relevant to the referral of, or outward remittance by, its Clients — for example, applicable exchange-control and remittance rules for resident Clients investing overseas. The Introducing Broker shall not undertake any activity requiring a licence it does not hold, and shall not cause Valura to be in breach of Applicable Law.</li>
      <li><b>Accurate information; no misrepresentation.</b> The Introducing Broker shall provide accurate and complete information in respect of each Referral, and shall not misrepresent Valura, the Global Access Services, the applicable risks, fees or regulatory protections, and shall not guarantee or imply any assured return, capital protection or performance.</li>
      <li><b>Risk disclosures.</b> The Introducing Broker shall ensure Clients are directed to, and where required acknowledge, Valura's risk disclosures for global investing, including the disclosure that the investor-protection, dispute-resolution and grievance-redressal mechanisms of IFSC-based exchanges are not available for Global Access activity, and shall display Valura-approved disclosures wherever it references the Global Access Services.</li>
      <li><b>First-line Client information.</b> Where the Introducing Broker collects initial Client information or documents, it shall do so accurately and transmit the same to Valura, in the form and manner Valura requires, within ${n(T.firstLineTransferDays)} Business Days of collection, to enable Valura's onboarding and KYC/CDD. This is first-line collection only; final KYC/CDD and onboarding are performed by Valura under Section 6.</li>
      <li><b>No funds or orders.</b> The Introducing Broker shall comply at all times with Section 2.3 and shall not accept, hold or transmit Client money, securities or orders.</li>
      <li><b>Client support boundaries.</b> The Introducing Broker may provide general facilitation and may pass Client queries to Valura, but all Account-specific matters — including orders, executions, corporate actions, money or securities movements, and complaints relating to execution or custody — are handled by Valura, and the Introducing Broker shall not purport to decide or resolve them.</li>
      <li><b>Complaints.</b> The Introducing Broker shall maintain a register of Client complaints, forward to Valura any complaint relating to Valura or an Account promptly and in any case within ${n(T.complaintForwardDays)} Business Days, cooperate in resolution, and shall have no authority to decide or settle any complaint on Valura's behalf.</li>
      <li><b>Marketing approval.</b> The Introducing Broker shall not advertise or promote Valura or the Global Access Services except using Valura-approved materials and channels, and shall obtain Valura's prior written approval for any material that references Valura or its Marks. All such activity shall comply with applicable advertising norms.</li>
      <li><b>No inducement to Clients.</b> The Introducing Broker shall not pass on, rebate or share the Revenue Share, or any commission or fee, with any Client, nor offer any cash or in-kind inducement to any Client, except as expressly permitted in writing by Valura and under Applicable Law.</li>
      <li><b>Eligibility of Clients.</b> The Introducing Broker shall refer only Clients who are not minors or otherwise legally incompetent, shall not refer prohibited persons, and shall conduct reasonable diligence before making a Referral.</li>
      <li><b>Conflicts and disclosure to Clients.</b> The Introducing Broker shall disclose to each Client its role as a referrer and the fact that it receives compensation from Valura for referrals, shall avoid or disclose conflicts of interest, and shall act honestly and in good faith.</li>
      <li><b>AML first-line.</b> To the extent it collects Client information, the Introducing Broker shall screen Referrals against applicable sanctions and watchlists, shall not knowingly refer shell banks or entities or accounts held for undisclosed beneficial owners, and shall immediately notify Valura of any suspicion, adverse media, sanctions match, or politically-exposed-person status concerning a Client.</li>
      <li><b>Records.</b> The Introducing Broker shall maintain records of Referrals and of Client consents for the period required by Applicable Law and in any case for not less than ${n(T.recordYears)} years, and shall make them available to Valura on request.</li>
      <li><b>Authorised persons and security.</b> The Introducing Broker shall maintain a current written list of its personnel authorised to interact with Valura, shall ensure that only such authorised persons access any Valura system or credentials, and shall safeguard all credentials.</li>
      <li><b>No resale; no misuse.</b> The Introducing Broker shall not resell, sublicense, share, reverse-engineer or misuse Valura's services, systems, technology or data, shall not use them to compete with Valura, and shall not claim any proprietary right over Valura's intellectual property.</li>
      <li><b>Notice of changes and disciplinary events.</b> The Introducing Broker shall promptly notify Valura of any material change to its business, ownership, control or licences, and of any material disciplinary, regulatory, criminal or insolvency action against it or its principals — orally immediately and in writing within ${n(T.changeNoticeDays)} Business Days.</li>
      <li><b>Cooperation and audit.</b> The Introducing Broker shall cooperate with Valura's compliance requirements and reasonable audits, and, where it performs first-line collection, shall provide Valura with an up-to-date English-language copy of its own KYC/AML policies.</li>
    </ol>
    ${VLR.Doc.foot(p, ent.legalName, `§4 · ${T.version}`)}
  </section>`);

  /* -- 5 VALURA DUTIES · 6 KYC · 7 CLIENT OWNERSHIP ---------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.eyebrow("Valura's duties · onboarding · client ownership")}
    <h2 class="sec"><span class="no">5</span>Duties and obligations of Valura</h2>
    <ol type="a">
      <li><b>Provision of services.</b> Valura shall provide the Global Access Services to accepted Clients as principal, directly or through its Execution &amp; Custody Partner, in compliance with Applicable Law applicable to Valura.</li>
      <li><b>Onboarding and KYC/AML.</b> Valura shall onboard Clients and perform KYC/CDD, AML screening, monitoring and reporting as the regulated entity, as set out in Section 6.</li>
      <li><b>Safekeeping and records.</b> Valura shall be responsible, directly or through its custodian, for safeguarding Client funds and securities once received and accepted by Valura or its custodian, and shall maintain books and records as required by Applicable Law.</li>
      <li><b>Statements and reporting.</b> Valura shall make available to Clients trade confirmations and Account statements as required by Applicable Law, and shall provide the Introducing Broker with agreed reporting on referred Clients to the extent permitted and relevant for computing the Revenue Share.</li>
      <li><b>Client servicing.</b> Valura shall handle Account-specific queries, corporate actions, money and securities movements, and complaints relating to the Global Access Services.</li>
      <li><b>Revenue Share.</b> Valura shall compute and pay the Revenue Share in accordance with Schedule A and Section 8.</li>
      <li><b>Tax.</b> Valura shall handle tax withholding and reporting on Accounts as required of Valura; each Party bears its own income taxes.</li>
      <li><b>Support and materials.</b> Valura shall provide reasonable operational support for the referral process and shall provide the Introducing Broker with Valura-approved marketing materials and disclosures.</li>
    </ol>

    <h2 class="sec"><span class="no">6</span>KYC, AML and Client onboarding</h2>
    <p>6.1 <b>Valura as principal for KYC/AML.</b> As the IFSCA-registered Broker Dealer, Valura is responsible, as principal, for Client onboarding, KYC/CDD, sanctions screening, PEP determination, risk categorisation, enhanced due diligence, ongoing monitoring and the filing of suspicious transaction reports with the Financial Intelligence Unit-India and other authorities, in accordance with the IFSCA AML/KYC Guidelines, the PMLA and its rules, and Valura's policies.</p>
    <p>6.2 <b>First-line role of the Introducing Broker.</b> Where the Introducing Broker collects initial Client information or documents, it shall do so accurately and transmit them promptly to Valura. Valura may, but is not obliged to, rely on such first-line information, and shall independently verify and complete KYC/CDD before onboarding. Valura's reliance does not transfer Valura's regulatory responsibility, nor does it relieve the Introducing Broker of its representations as to the accuracy of information it provides.</p>
    <p>6.3 <b>Prohibited and high-risk Clients.</b> Neither Party shall refer or onboard prohibited persons, shell banks or entities, or accounts for undisclosed beneficial owners. High-risk Clients and Accounts, or as Valura otherwise determines, are subject to enhanced due diligence by Valura.</p>
    <p>6.4 <b>Ongoing notification.</b> The Introducing Broker shall immediately notify Valura of any adverse information, sanctions or watchlist match, PEP status, regulatory or criminal action, or suspicious activity concerning any referred Client of which it becomes aware.</p>
    <p>6.5 <b>Additional information.</b> Valura may request additional Client information at any time, and the Introducing Broker shall provide it within ${n(T.additionalInfoHours + ' hours')}, or obtain it from the Client within ${n(T.additionalInfoDays)} Business Days.</p>
    <p>6.6 <b>Precedence of Valura policies.</b> In the event of any conflict between the Parties' AML/KYC policies concerning a Client or Account, Valura's policies prevail.</p>

    <h2 class="sec"><span class="no">7</span>Client ownership and non-circumvention</h2>
    <p>7.1 <b>Client relationship.</b> Once onboarded, Clients are the clients of Valura for the Global Access Services. This does not affect any independent relationship the Introducing Broker has with a Client outside the Global Access Services.</p>
    <p>7.2 <b>Non-circumvention.</b> During the term and for ${n(T.nonCircumventionMonths)} months thereafter, the Introducing Broker shall not, using Valura's Confidential Information, knowingly induce a referred Client to transfer away from Valura in breach of this Agreement, or solicit such Client for a competing global-access service. This does not restrict the Introducing Broker's ordinary business with its own clients outside the Global Access Services.</p>
    <p>7.3 <b>Data.</b> Client personal data is handled in accordance with Section 15.</p>
    ${VLR.Doc.foot(p, ent.legalName, `§5–§7 · ${T.version}`)}
  </section>`);

  /* -- 8 REVENUE SHARE · 9 WARRANTIES · 10 TERM -------------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.eyebrow('Revenue share · warranties · term')}
    <h2 class="sec"><span class="no">8</span>Revenue share, fees, taxes and payment</h2>
    <p>8.1 <b>Revenue Share.</b> Valura shall pay the Introducing Broker the Revenue Share set out in Schedule A, computed on the basis stated there. Revenue Share accrues in respect of Clients actually onboarded through the Introducing Broker who generate the relevant revenue. <b>Such entitlement is not conditional on this Agreement remaining in force:</b> it continues, on the same basis and at the same rates as set out in Schedule A, for so long as the relevant Client's assets remain invested through Valura, and irrespective of whether this Agreement has been terminated. The entitlement attaches to the Clients introduced and is payable on the revenue those Clients actually generate; it does not extend to any Client onboarded after the termination date, and it ceases in respect of a Client when that Client's assets are fully redeemed or transferred away from Valura, or as provided in Sections 8.4, 8.7 and 10.4.</p>
    <p>8.2 <b>Statement and payment cycle.</b> Valura shall provide a statement of Revenue Share by the ${n(T.statementBusinessDay + 'th')} Business Day of the following calendar month and shall pay undisputed amounts within ${n(T.paymentDays)} calendar days of the statement date to the Introducing Broker's designated bank account.</p>
    <p>8.3 <b>Taxes.</b> All amounts are exclusive of taxes. Applicable GST, TDS/TCS, withholding and other taxes shall be handled in accordance with Applicable Law; Valura may deduct or withhold as required and shall issue any applicable certificates. Each Party bears its own income tax. Unless stated otherwise in Schedule A, taxes are excluded from the base on which the Revenue Share is computed.</p>
    <p>8.4 <b>Set-off and clawback.</b> Valura may set off against the Revenue Share any amount owed by the Introducing Broker to Valura, including indemnity amounts and any clawback of referral compensation attributable to Clients later found to be fraudulent or to transactions that are reversed, cancelled or unpaid.</p>
    <p>8.5 <b>Disputed amounts.</b> The Introducing Broker may dispute any amount in good faith by written notice within ${n(T.disputeNoticeDays)} days of the statement, provided it pays undisputed amounts; the Parties shall seek to resolve the dispute within ${n(T.disputeResolveDays)} days before invoking the dispute-resolution provisions.</p>
    <p>8.6 <b>Changes.</b> Schedule A may be amended by mutual written agreement. Third-party, pass-through, regulatory and tax charges may change without re-execution of this Agreement and are incorporated automatically.</p>
    <p>8.7 <b>Conditions to payment.</b> No Revenue Share is payable in respect of any Referral obtained through misrepresentation, fraud or breach of Applicable Law, or where payment would be prohibited by Applicable Law.</p>

    <h2 class="sec"><span class="no">9</span>Representations and warranties</h2>
    <p>9.1 <b>Mutual.</b> Each Party represents and warrants, on the Effective Date and throughout the term, that: (i) it is duly organised, validly existing and in good standing; (ii) it has full power and authority to enter into and perform this Agreement, and the signatory is duly authorised; (iii) this Agreement is a legal, valid and binding obligation enforceable against it; (iv) its entry into and performance of this Agreement does not conflict with any law or agreement binding on it; (v) it complies with Applicable Law applicable to it and maintains, as applicable to its business, an AML programme reviewed at least annually; (vi) its personnel are qualified and not subject to any disqualification; (vii) it and its Clients are engaged only in lawful business using funds from legitimate sources; and (viii) it will promptly notify the other Party of any material inaccuracy in these warranties or any material breach.</p>
    <p>9.2 <b>Introducing Broker.</b> The Introducing Broker further represents and warrants that it has determined and holds all registrations and licences required for its referral activity in its jurisdiction, that it is solely responsible for compliance with laws applicable to it and its Clients including any exchange-control or remittance rules relevant to its Clients, and that it will not cause Valura to be in breach of Applicable Law.</p>
    <p>9.3 <b>Valura.</b> Valura further represents and warrants that it is registered with IFSCA as a Broker Dealer authorised to provide Global Access, that it will use reasonable efforts to maintain such registration during the term, and that it provides the Global Access Services in compliance with the IFSCA requirements applicable to it.</p>

    <h2 class="sec"><span class="no">10</span>Term and termination</h2>
    <p>10.1 <b>Term.</b> This Agreement takes effect on the Effective Date and continues in force perpetually, with no fixed term and no requirement for renewal, until terminated by mutual written agreement of the Parties or otherwise in accordance with this Section.</p>
    <p>10.2 <b>Termination for convenience.</b> Either Party may terminate this Agreement at any time on ${n(T.terminationNoticeDays)} calendar days' prior written notice.</p>
    <p>10.3 <b>Immediate termination.</b> Either Party may terminate immediately on written notice if the other: (i) becomes insolvent or subject to bankruptcy, receivership or an assignment for creditors; (ii) has any licence necessary for its business terminated, suspended or revoked; (iii) commits a material breach not cured within ${n(T.cureDays)} days of notice; (iv) fails to make a payment when due; or (v) breaches any AML, anti-bribery or sanctions obligation. Valura may also terminate on ${n(T.changeOfControlNoticeDays)} days' notice on a change of control of the Introducing Broker, or where continued dealing would in Valura's reasonable determination create material regulatory or reputational risk.</p>
    <p>10.4 <b>Effect of termination.</b> Accrued Revenue Share up to the termination date remains payable, and Revenue Share continues to accrue and be payable after termination in accordance with Section 8.1 for so long as the assets of Clients introduced by the Introducing Broker remain invested through Valura, in each case subject to set-off and clawback. Valura shall continue to provide statements under Section 8.2 in respect of such continuing Revenue Share. The Introducing Broker shall immediately cease soliciting Clients and using Valura's Marks and materials, and shall return or destroy Confidential Information. Clients remain Valura's Clients and continue to be serviced by Valura; termination of this Agreement does not terminate Valura's agreements with Clients. Sections 8.1 to 8.5 in respect of continuing Revenue Share, and the Sections concerning confidentiality, indemnification, limitation of liability, intellectual property, data protection and governing law, survive termination.</p>
    <p>10.5 <b>Transition.</b> The Parties shall cooperate in an orderly transition, and the Introducing Broker shall provide any records reasonably required for regulatory continuity.</p>
    ${VLR.Doc.foot(p, ent.legalName, `§8–§10 · ${T.version}`)}
  </section>`);

  /* -- 11-21 ------------------------------------------------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.eyebrow('Liability · indemnity · confidentiality · IP · data · law')}
    <h2 class="sec"><span class="no">11</span>Limitation of liability</h2>
    <p>11.1 <b>No indirect loss.</b> Neither Party shall be liable to the other for any indirect, consequential, special or incidental loss, or for any loss of profit, revenue, data or goodwill, even if advised of the possibility of such loss.</p>
    <p>11.2 <b>&ldquo;As is&rdquo;.</b> Except as expressly stated in this Agreement, all services, systems and information are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, and each Party disclaims all other warranties, including any implied warranty of merchantability or fitness for a particular purpose, and does not warrant uninterrupted or error-free operation.</p>
    <p>11.3 <b>Aggregate cap.</b> Subject to Section 11.4, the aggregate liability of each Party to the other under or in connection with this Agreement shall not exceed the total Revenue Share paid or payable under this Agreement in the ${n(T.liabilityCapMonths)} months preceding the event giving rise to the claim.</p>
    <p>11.4 <b>Carve-outs.</b> The exclusions and cap in this Section do not apply to: (i) fraud, wilful misconduct or gross negligence; (ii) the Introducing Broker's indemnification obligations under Section 12.2; (iii) breach of confidentiality under Section 13 or infringement of the other Party's intellectual property; or (iv) a Party's payment obligations.</p>
    <p>11.5 <b>Survival.</b> This Section survives termination of this Agreement.</p>

    <h2 class="sec"><span class="no">12</span>Indemnification</h2>
    <p>12.1 <b>Mutual.</b> Each Party (the &ldquo;Indemnifying Party&rdquo;) shall indemnify and hold harmless the other Party and its officers, directors, employees, affiliates and agents (the &ldquo;Indemnified Party&rdquo;) from and against all claims, losses, liabilities, damages, costs and expenses, including reasonable legal fees, arising from the Indemnifying Party's own gross negligence, wilful misconduct, fraud or breach of Applicable Law that has a material adverse effect on the Indemnified Party.</p>
    <p>12.2 <b>By the Introducing Broker.</b> In addition, the Introducing Broker shall indemnify and hold Valura harmless from and against all such risks arising from: (i) any misrepresentation to, or statement made to, a Client by the Introducing Broker; (ii) any Referral of a prohibited, fraudulent or ineligible Client; (iii) any breach by the Introducing Broker of its representations, warranties or duties under this Agreement; (iv) any activity by the Introducing Broker requiring a licence it does not hold; (v) any claim brought by a referred Client, or by the Introducing Broker's regulator, arising from the Introducing Broker's conduct, statements, technology or omissions; (vi) any failure in the Introducing Broker's first-line KYC/AML collection; and (vii) any cyber-security incident originating from the Introducing Broker's systems.</p>
    <p>12.3 <b>By Valura.</b> Valura shall indemnify and hold the Introducing Broker harmless from and against risks arising from: (i) Valura's material breach of its agreements with Clients; (ii) Valura's gross negligence or wilful violation of the IFSCA laws applicable to it; (iii) any cyber-security incident originating within Valura and not attributable to the Introducing Broker or a Client; and (iv) claims arising directly from the provision of the Global Access Services — execution, clearing, custody — except to the extent caused by the Introducing Broker or a Client.</p>
    <p>12.4 <b>Procedure.</b> The Indemnified Party shall promptly notify the Indemnifying Party of any claim; the Indemnifying Party may assume the defence with counsel reasonably acceptable to the Indemnified Party; neither Party shall settle a claim in a manner that imposes any liability or admission on the other without its prior written consent, not to be unreasonably withheld. Failure to give prompt notice relieves the Indemnifying Party only to the extent it is prejudiced.</p>
    <p>12.5 <b>Risk allocation and survival.</b> The Parties acknowledge that the Revenue Share and fees reflect the allocation of risk in this Agreement. This Section survives termination and applies to risks whenever arising, for a period of ${n(T.indemnitySurvivalYears)} years after termination.</p>

    <h2 class="sec"><span class="no">13</span>Confidentiality and non-disclosure</h2>
    <p>13.1 <b>Definition.</b> &ldquo;Confidential Information&rdquo; means all non-public information disclosed by one Party to the other, in any form, including business, financial, technical, Client and pricing information, the terms of this Agreement, and any personal or private information of Clients.</p>
    <p>13.2 <b>Obligations.</b> The receiving Party shall use Confidential Information solely to perform this Agreement, shall protect it with at least the same degree of care it uses for its own confidential information and no less than reasonable care, and shall not disclose it except to its personnel, affiliates, regulators, auditors and the Execution &amp; Custody Partner on a need-to-know basis under equivalent obligations of confidence.</p>
    <p>13.3 <b>Exclusions.</b> The obligations do not apply to information that is or becomes public without breach, was lawfully known before disclosure, is independently developed, or is lawfully received from a third party without restriction.</p>
    <p>13.4 <b>Compelled disclosure.</b> A Party may disclose Confidential Information to the extent required by Applicable Law, court or regulator, and shall, where lawful and practicable, give the other Party prior notice.</p>
    <p>13.5 <b>This Agreement.</b> The terms of this Agreement are confidential and are the proprietary template of Valura; the Introducing Broker shall not replicate, share or reuse this Agreement or any term of it for any other party.</p>
    <p>13.6 <b>Remedies and survival.</b> The Parties acknowledge that breach may cause irreparable harm and that injunctive relief may be sought without proof of actual damage. This Section survives termination and continues for ${n(T.confidentialitySurvivalYears)} years thereafter, and in respect of Client personal data for so long as required by Applicable Law.</p>

    <h2 class="sec"><span class="no">14</span>Intellectual property and use of Marks</h2>
    <p>14.1 <b>Ownership.</b> Each Party retains all right, title and interest in its own intellectual property, systems, technology and Marks. Nothing in this Agreement transfers any such rights except for the limited licences expressly granted.</p>
    <p>14.2 <b>Licence to the Introducing Broker.</b> Valura grants the Introducing Broker a limited, non-exclusive, non-transferable, revocable licence to use Valura-approved Marks and materials solely for approved referral marketing during the term, strictly in accordance with Valura's guidelines. All goodwill arising from such use inures to Valura.</p>
    <p>14.3 <b>Licence to Valura.</b> The Introducing Broker grants Valura a licence to use the Introducing Broker's name and logo to describe the relationship in the ordinary course and for regulatory or compliance purposes.</p>
    <p>14.4 <b>Systems.</b> Valura's platform, APIs, technology and data remain Valura's exclusive property; the Introducing Broker is granted only the limited access needed for the referral process, and Section 4(o) applies.</p>

    <h2 class="sec"><span class="no">15</span>Data protection</h2>
    <p>15.1 <b>Compliance.</b> Each Party shall comply with applicable data-protection law, including India's Digital Personal Data Protection Act, 2023, in respect of Client personal data processed under this Agreement.</p>
    <p>15.2 <b>Consents.</b> The Introducing Broker shall obtain all consents and provide all notices necessary to enable it to share Client personal data with Valura and its Execution &amp; Custody Partner for onboarding, servicing and compliance, including any cross-border transfer to the extent permitted.</p>
    <p>15.3 <b>Safeguards.</b> Each Party shall process Client personal data on a need-to-know basis, implement reasonable technical and organisational safeguards, assist the other with data-subject and regulatory requests, and notify the other promptly of any personal-data breach relevant to the Global Access Services.</p>

    <h2 class="sec"><span class="no">16</span>Force majeure</h2>
    <p>16.1 A Party is excused from non-performance, other than payment obligations already accrued, caused by an event beyond its reasonable control, including natural disaster, war, pandemic, labour disturbance, governmental act, or failure of power or communications systems. The affected Party shall notify the other within ${n(T.forceMajeureNoticeDays)} calendar days, mitigate the effect, and, if the event continues for more than ${n(T.forceMajeureTerminationDays)} calendar days, either Party may terminate this Agreement.</p>

    <h2 class="sec"><span class="no">17</span>Notices</h2>
    <p>17.1 Notices shall be in writing and delivered to the addresses in the Parties table, marked for the attention of the Chief Executive Officer, and may be given by hand, reputable courier, registered post or electronic means. Notice is deemed given on delivery if by hand, or on receipt if by courier, post or electronic means. A Party may change its notice details on ${n(T.noticeChangeDays)} calendar days' prior written notice.</p>

    <h2 class="sec"><span class="no">18</span>Assignment</h2>
    <p>18.1 Neither Party may assign or delegate this Agreement without the other's prior written consent, except that a Party may assign to a successor on a merger or change of control on prior notice. Any assignment is subject to any required regulatory approval. The Introducing Broker may not assign to a competitor of Valura without Valura's written consent. Any assignment in breach is void, and no assignment grants the Introducing Broker any right to terminate.</p>

    <h2 class="sec"><span class="no">19</span>Electronic communications and e-signature</h2>
    <p>19.1 The Parties consent to communicate by electronic means in the ordinary course, and acknowledge the associated risks. This Agreement may be signed electronically under the Information Technology Act, 2000, and in counterparts, each of which is an original and all of which together form one agreement. This Agreement becomes binding on exchange of signed counterparts, subject to any approval required by IFSCA or NSE IFSC.</p>

    <h2 class="sec"><span class="no">20</span>Miscellaneous</h2>
    <p>20.1 <b>Entire agreement.</b> This Agreement, with its Schedules, is the entire agreement between the Parties on its subject matter and supersedes all prior understandings.</p>
    <p>20.2 <b>Amendment.</b> Except for changes to Applicable Law, taxes and third-party pass-through charges, which are incorporated automatically, and changes to Schedule A made by mutual written agreement, this Agreement may be amended only in writing signed by both Parties. Amendments may be subject to IFSCA or NSE IFSC approval where required.</p>
    <p>20.3 <b>Severability.</b> If any provision is held invalid or unenforceable, the remaining provisions continue in full force, and the invalid provision shall be read down to the minimum extent necessary.</p>
    <p>20.4 <b>No waiver.</b> No failure or delay in exercising any right operates as a waiver, and no single or partial exercise precludes any further exercise.</p>
    <p>20.5 <b>Independent advice.</b> Each Party has had the opportunity to take independent legal advice and enters into this Agreement exercising its own judgement.</p>
    <p>20.6 <b>No third-party beneficiaries.</b> This Agreement confers no rights on any third party, including Clients.</p>
    <p>20.7 <b>Independent contractors; survival.</b> The Parties are independent contractors. Provisions that by their nature are intended to survive shall survive termination.</p>

    <h2 class="sec"><span class="no">21</span>Governing law, arbitration and jurisdiction</h2>
    <p>21.1 <b>Governing law.</b> This Agreement is governed by the laws of India as applicable to an IFSCA-regulated entity, and by the regulations, circulars and directions issued by IFSCA, without regard to conflict-of-laws principles.</p>
    <p>21.2 <b>Arbitration.</b> Any dispute shall be finally resolved by arbitration by a sole arbitrator appointed jointly by the Parties, seated at GIFT City IFSC, India, or such other seat as the Parties may agree in writing, conducted in English under the Arbitration and Conciliation Act, 1996, or the arbitration framework then applicable to a Global Access or Broker Dealer entity registered with IFSCA. The award is final and binding.</p>
    <p>21.3 <b>Jurisdiction.</b> Subject to arbitration, the courts of competent jurisdiction having territorial jurisdiction over Valura's registered office shall have exclusive jurisdiction over matters arising under this Agreement.</p>
    ${VLR.Doc.foot(p, ent.legalName, `§11–§21 · ${T.version}`)}
  </section>`);

  /* -- SCHEDULE A · PART A ----------------------------------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: 'Schedule A · Part A', cobrand: false,
      title: `Revenue share — <em>direct business</em>`,
      stand: `Client-facing charges are set by Valura under its schedule of charges. Valura's standard revenue share is 50 / 50; the shares below are what is extended to the Introducing Broker.`,
      meta: [['Effective', p.effectiveDate ? VLR.fmt.date(p.effectiveDate) : '—'], ['Settlement', 'Monthly'], ['Currency', 'INR / USD']] })}

    <h2 class="sec"><span class="no">A.1</span>Revenue share by product</h2>
    <p>Every product carries a cost and a fixed amount Valura retains. The Introducing Broker's share is a mark-up applied on top of both, computed as
      <span class="mono">IB earns = Valura retains &times; split &divide; (1 &minus; split)</span>.
      Raising the split raises what the Client pays; the amount Valura retains does not change.</p>
    ${(() => {
      const pr = VLR.Econ.pricingFor(p);
      const bps = x => `${Number(x).toFixed(Number(x) % 1 === 0 ? 0 : 1)} bps`;
      const row = (l, per) => `<tr${l.split !== C.pricing.defaultSplit ? ' class="hl"' : ''}>
        <td>${VLR.fmt.esc(l.label)}</td>
        <td class="num">${bps(l.costBps)}</td>
        <td class="num">${bps(l.valuraKeepsBps)}</td>
        <td class="num">${v(VLR.fmt.pct(l.split, 0), 'split_' + l.key)}</td>
        <td class="num"><b>${bps(l.partnerEarnsBps)}</b></td>
        <td class="num">${bps(l.clientPaysBps)}${per ? ' ' + per : ''}</td></tr>`;
      return `<table class="dt">
        <thead><tr><th>Product</th><th class="num">Cost</th><th class="num">Valura retains</th>
          <th class="num">IB split</th><th class="num">IB earns</th><th class="num">Client pays</th></tr></thead>
        <tbody>
          <tr><td colspan="6" style="background:var(--paper-2);font-family:var(--font-mono);font-size:7.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-muted)">Brokerage — per trade on the amount transacted</td></tr>
          ${pr.brokerage.map(l => row(l)).join('')}
          <tr><td colspan="6" style="background:var(--paper-2);font-family:var(--font-mono);font-size:7.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-muted)">Platform fee — per year on assets held</td></tr>
          ${row(pr.platform, 'p.a.')}
          <tr><td colspan="6" style="background:var(--paper-2);font-family:var(--font-mono);font-size:7.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-muted)">Placement — pre-IPO and private markets</td></tr>
          ${row(pr.placement, 'per deal')}
        </tbody>
      </table>`;
    })()}
    <p class="fine">GIFT City funds are exempt from the platform fee and no platform-fee share arises on them. Custody charges are levied under Valura's schedule of charges and are not revenue-shareable. Float income, where announced by Valura, is shared 80% to the Introducing Broker and 20% to Valura.</p>

    <div class="callout"><b>Waived, not deferred.</b> Platform access, client-driven events at USD 2 per client and market data at USD 1,000 a year are listed in Valura's schedule and are not charged to the Introducing Broker. They are part of the infrastructure Valura carries; they are stated here so that what is absorbed is visible rather than silently assumed.</div>

    <div class="callout"><b>Three lines above are waived, not billed.</b> Platform access, client-driven events at USD 2 per client, and market data at USD 1,000 are listed so that what Valura absorbs is visible, not so that it can be charged later. They are part of ${VLR.fmt.usdShort(VLR.Econ.valuraBorne().annualInr / C.ops.fxUsdInr)} a year of infrastructure Valura carries that never reaches the Introducing Broker's cost sheet.</div>

    <h2 class="sec"><span class="no">A.2</span>Direct pass-through costs</h2>
    <p class="fine" style="margin-top:-4px">Illustrative, applied at cost.</p>
    <table class="dt">
      <thead><tr><th>Cost</th><th class="num">Rate</th><th>Notes</th></tr></thead>
      <tbody>${T.passThrough.map(r => `<tr>
        <td>${VLR.fmt.esc(r.cost)}</td><td class="num">${VLR.fmt.esc(r.rate)}</td><td>${VLR.fmt.esc(r.note)}</td></tr>`).join('')}
      </tbody>
    </table>

    <h2 class="sec"><span class="no">A.3</span>What that blends to, at this partner's asset mix</h2>
    ${(() => {
      const br = VLR.Econ.blendedFromPricing(p);
      return `<table class="dt">
        <thead><tr><th>Asset class</th><th class="num">% of portfolio</th><th class="num">Platform</th><th class="num">Brokerage</th><th class="num">Placement</th><th class="num">Your rate p.a.</th><th class="num">Share of earnings</th></tr></thead>
        <tbody>${br.rows.map(r => `<tr>
          <td>${VLR.fmt.esc(r.label)}</td>
          <td class="num">${VLR.fmt.pct(r.weight, 0)}</td>
          <td class="num">${VLR.fmt.pct(r.platformRate)}</td>
          <td class="num">${VLR.fmt.pct(r.brokerageRate)}</td>
          <td class="num">${r.placementRate ? VLR.fmt.pct(r.placementRate) : '—'}</td>
          <td class="num"><b>${VLR.fmt.pct(r.rate)}</b></td>
          <td class="num">${VLR.fmt.pct(r.shareOfEarnings, 1)}</td></tr>`).join('')}
          <tr class="tot"><td>Blended</td><td class="num">100%</td><td class="num" colspan="3"></td>
            <td class="num">${VLR.fmt.pct(br.blended)}</td><td class="num">100%</td></tr>
        </tbody>
      </table>
      <p class="fine">The blended rate is what the partner P&amp;L runs on, derived from the split agreed in A.1 rather than typed in. Placement fees on pre-IPO and private funds are one-time on deployment and are shown per annum on the convention that the allocation redeploys roughly once a year. Trail on distributed funds is paid by the manufacturer and is additional.</p>`;
    })()}
    ${VLR.Doc.foot(p, ent.legalName, `Schedule A · Part A · ${T.version}`)}
  </section>`);

  /* -- SCHEDULE A · PART B ----------------------------------------------- */
  pages.push(`
  <section class="pg a4">
    ${VLR.Doc.band(p, { label: 'Schedule A · Part B', cobrand: false,
      title: `Multi-tier revenue share — <em>the anchor structure</em>`,
      stand: `Part A applies where the Introducing Broker sources and services the Client directly. This Part B applies where it is appointed as an Anchor Partner and builds a distribution network beneath it. Part B is supplemental to Part A; where the two conflict on sub-distributed business, Part B prevails.`,
      meta: [['Cascade stops at', 'Level 2'], ['Valura retains', '40–50%'], ['Settlement', 'Direct with each party']] })}

    <h2 class="sec"><span class="no">B.1</span>Revenue share table</h2>
    <table class="dt">
      <thead><tr><th>Scenario</th><th>Who sources the End Client</th><th class="num">Level-2</th><th class="num">Sub-Distributor</th><th class="num">Anchor</th><th class="num">Valura</th></tr></thead>
      <tbody>${T.cascade.map(r => `<tr>
        <td><b>${VLR.fmt.esc(r.scenario)}</b></td>
        <td>${VLR.fmt.esc(r.sourcedBy)}</td>
        <td class="num">${r.level2 == null ? 'n/a' : VLR.fmt.pct(r.level2, 0)}</td>
        <td class="num">${r.subDist == null ? 'n/a' : VLR.fmt.pct(r.subDist, 0)}</td>
        <td class="num"><b>${VLR.fmt.pct(r.anchor, 0)}</b></td>
        <td class="num">${VLR.fmt.pct(r.valura, 0)}</td></tr>`).join('')}
      </tbody>
    </table>
    <p class="fine">All percentages are of the Shareable Fee defined in Part A. Each row totals 100% of the Shareable Fee.</p>

    <h2 class="sec"><span class="no">B.2</span>Derivation of the Anchor Partner's share</h2>
    <table class="dt">
      <thead><tr><th>Scenario</th><th>How the Anchor Partner's share is derived</th><th class="num">Valura retains</th></tr></thead>
      <tbody>${T.cascade.map(r => `<tr>
        <td>${VLR.fmt.esc(r.scenario.split('—')[0].trim())}</td>
        <td>${VLR.fmt.esc(r.derivation)}</td>
        <td class="num">${VLR.fmt.pct(r.valura, 0)}</td></tr>`).join('')}
      </tbody>
    </table>

    <h2 class="sec"><span class="no">B.3</span>Flow of the shareable fee</h2>
    <p>In every case Valura settles the Shareable Fee directly with each party in the chain, on that party's own account. <b>No party in the chain collects on behalf of, or pays down to, any other party.</b></p>
    ${(() => {
      const bar = r => {
        const segs = [
          { k: 'Level-2', v: r.level2, c: 'var(--navy)' },
          { k: 'Sub-Distributor', v: r.subDist, c: 'var(--violet)' },
          { k: 'Anchor', v: r.anchor, c: 'var(--brand)' },
          { k: 'Valura', v: r.valura, c: 'var(--ink)' }
        ].filter(s => s.v);
        return `<div style="margin:12px 0 16px">
          <div style="font-size:9.5px;font-weight:700;margin-bottom:6px">${VLR.fmt.esc(r.scenario)}</div>
          <div style="display:flex;height:26px;border-radius:var(--r-sm);overflow:hidden;border:1px solid var(--rule)">
            ${segs.map(s => `<div style="width:${s.v * 100}%;background:${s.c};display:grid;place-items:center;
              font-family:var(--font-mono);font-size:8px;color:#fff;letter-spacing:.06em">${Math.round(s.v * 100)}%</div>`).join('')}
          </div>
          <div style="display:flex;gap:14px;margin-top:5px;flex-wrap:wrap">
            ${segs.map(s => `<span style="font-family:var(--font-mono);font-size:7.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted)">
              <span style="display:inline-block;width:6px;height:6px;background:${s.c};margin-right:4px"></span>${s.k}</span>`).join('')}
          </div>
        </div>`;
      };
      return T.cascade.map(bar).join('');
    })()}

    <h2 class="sec"><span class="no">B.4</span>Operating conditions</h2>
    <ul style="font-size:9.5px;line-height:1.65">
      <li>The Shareable Fee is the fee base defined in Part A — brokerage, AUM fee, other financial products and float income, as applicable. All percentages in this Part B are expressed as a percentage of that Shareable Fee.</li>
      <li>The party that introduces the End Client is paid first. Each upstream introducer in the chain is then paid out of Valura's remaining share.</li>
      <li>Valura's retained share is 50% where the Anchor Partner sources the Client itself, and 40% in every case where the Client is sourced through a Sub-Distributor or a Level-2 introducer.</li>
      <li>Valura settles directly with each party. The Anchor Partner is paid its own share only, and is not responsible for collecting, holding or onward-paying any share due to a Sub-Distributor or a Level-2 introducer.</li>
      <li>Each Sub-Distributor and Level-2 introducer shall execute Valura's standard Introducing Broker Agreement, or an accession letter to it, before any Revenue Share accrues to it. Each such party contracts with Valura on its own account, invoices Valura for its own share, and is responsible for its own tax, withholding and regulatory obligations.</li>
      <li>The Anchor Partner introduces and supervises its Sub-Distributors, and each Sub-Distributor introduces and supervises its Level-2 introducers. The Anchor Partner shall procure that every party in its chain is appropriately licensed or exempt in its jurisdiction and is onboarded by Valura before it solicits any Client.</li>
      <li>The Anchor Partner's share under Cases 2 and 3 is consideration for the recruitment, training, supervision and ongoing support of its chain, and not for the introduction of the individual Client.</li>
      <li><b>The cascade stops at Level 2.</b> No Revenue Share is payable in respect of any tier below Level 2 without Valura's prior written consent.</li>
      <li>Each party's entitlement under this Part B continues after termination of its own agreement, on the same basis as Section 8.1, for so long as the assets of the Clients it introduced remain invested through Valura.</li>
      <li>Where a Client could be attributed to more than one chain, the chain that first submitted the completed onboarding application to Valura prevails.</li>
      <li>Termination of the Anchor Partner does not of itself terminate a Sub-Distributor or Level-2 introducer. On such termination the Anchor Partner's override ceases, and Valura may continue to deal with the remainder of the chain directly.</li>
    </ul>
    <p class="fine">All other terms of Schedule A, including pass-through costs and non-shareable custody charges, continue to apply unchanged.</p>
    ${VLR.Doc.foot(p, ent.legalName, `Schedule A · Part B · ${T.version}`)}
  </section>`);

  /* -- EXECUTION --------------------------------------------------------- */
  if (o.esign) {
    const eqSplit = VLR.Econ.pricingFor(p).brokerage[0].split;
    pages.push(VLR.Doc.executionSheet(p, {
      label: 'Execution',
      title: `Signed, and <em>one instrument</em>.`,
      recital: `This page is executed as part of, and forms one instrument with, the ${T.version} dated ${VLR.fmt.date(p.effectiveDate)} between ${ent.legalName} and ${p.legalName || d.displayName}, together with Schedule A, Parts A and B.`,
      meta: [
        ['Effective date', VLR.fmt.date(p.effectiveDate)],
        ['Introducing Broker', d.displayName],
        ['Revenue share', VLR.fmt.pct(eqSplit, 0) + ' on equity'],
        ['Entity', ent.short]
      ],
      footer: T.version,
      esignClause: 'Clause 19.1'
    }));
  } else {
    pages.push(`
    <section class="pg a4">
      ${VLR.Doc.eyebrow('Execution')}
      <h2 class="sec"><span class="no">22</span>Execution</h2>
      <p>IN WITNESS WHEREOF, the Parties have executed this Agreement by their duly authorised representatives as of the Effective Date.</p>
      <div class="sign-grid">
        <div class="sign-box">
          <div class="who">For ${VLR.fmt.esc(ent.legalName)}</div>
          <div class="line"></div>
          <div class="f">Name: ${VLR.fmt.esc(ent.signatory.name)}<br>Title: ${VLR.fmt.esc(ent.signatory.title)}<br>Date: ______________________</div>
        </div>
        <div class="sign-box">
          <div class="who">For the Introducing Broker<br>${v(p.legalName, 'ib_legal_name')}</div>
          <div class="line"></div>
          <div class="f">Name: ${v(p.signatoryName, 'signatory_name')}<br>Title: ${v(p.signatoryTitle, 'signatory_title')}<br>Date: ______________________</div>
        </div>
      </div>
      <div class="callout" style="margin-top:26px"><b>Attached and forming part of this Agreement:</b> Schedule A Part A — revenue share, direct business · Schedule A Part B — multi-tier revenue share.</div>
      ${VLR.Doc.foot(p, ent.legalName, `Execution · ${T.version}`)}
    </section>`);
  }

  return pages.join('');
};
