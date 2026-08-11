/* ============================================================================
   Zoho Sign — OAuth and the two-step send.
   ----------------------------------------------------------------------------
   Sending is two calls, not one:
     1. POST /api/v1/requests            multipart: the PDF + a JSON `data` part
        → returns request_id, document_ids and an action_id per recipient
     2. POST /api/v1/requests/{id}/submit  the same actions, now carrying the
        field positions, which is what actually dispatches the emails
   Every action other than a VIEW must carry at least one field, so step 2 is
   where the signature and date boxes are placed.
   ==========================================================================*/

/* Zoho runs separate data centres. The account, the accounts server and the
   Sign API must all be the same one — a token minted in India will not
   authenticate against sign.zoho.com.                                       */
const DC = {
  com: { accounts: 'https://accounts.zoho.com',    sign: 'https://sign.zoho.com'    },
  eu:  { accounts: 'https://accounts.zoho.eu',     sign: 'https://sign.zoho.eu'     },
  in:  { accounts: 'https://accounts.zoho.in',     sign: 'https://sign.zoho.in'     },
  au:  { accounts: 'https://accounts.zoho.com.au', sign: 'https://sign.zoho.com.au' },
  jp:  { accounts: 'https://accounts.zoho.jp',     sign: 'https://sign.zoho.jp'     },
  ca:  { accounts: 'https://accounts.zohocloud.ca', sign: 'https://sign.zohocloud.ca' },
  sa:  { accounts: 'https://accounts.zoho.sa',     sign: 'https://sign.zoho.sa'     }
};

function hosts() {
  const key = (process.env.ZOHO_SIGN_DC || 'com').toLowerCase().trim();
  const h = DC[key];
  if (!h) throw new HubError(500, `ZOHO_SIGN_DC is "${key}" — expected one of ${Object.keys(DC).join(', ')}.`);
  return h;
}

export class HubError extends Error {
  constructor(status, message, detail) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

/* Access tokens last an hour. A warm lambda reuses one; a cold one mints a
   new one. Refresh tokens do not expire unless revoked.                     */
let cached = { token: null, expiresAt: 0 };

export async function accessToken() {
  if (cached.token && Date.now() < cached.expiresAt - 60_000) return cached.token;

  const { ZOHO_SIGN_CLIENT_ID, ZOHO_SIGN_CLIENT_SECRET, ZOHO_SIGN_REFRESH_TOKEN } = process.env;
  const missing = Object.entries({ ZOHO_SIGN_CLIENT_ID, ZOHO_SIGN_CLIENT_SECRET, ZOHO_SIGN_REFRESH_TOKEN })
    .filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) throw new HubError(500, `Zoho Sign is not configured — missing ${missing.join(', ')}.`);

  const body = new URLSearchParams({
    refresh_token: ZOHO_SIGN_REFRESH_TOKEN,
    client_id: ZOHO_SIGN_CLIENT_ID,
    client_secret: ZOHO_SIGN_CLIENT_SECRET,
    grant_type: 'refresh_token'
  });

  const res = await fetch(`${hosts().accounts}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  const json = await res.json().catch(() => ({}));

  /* Zoho answers 200 with an `error` key rather than an HTTP error code. */
  if (!res.ok || json.error || !json.access_token) {
    throw new HubError(502,
      `Zoho refused the refresh token (${json.error || res.status}).`,
      json.error === 'invalid_client'
        ? 'Client id or secret does not match, or the app belongs to a different data centre than ZOHO_SIGN_DC.'
        : json.error === 'invalid_code'
        ? 'The refresh token has been revoked or was issued for different scopes. Mint a new one with ZohoSign.documents.ALL.'
        : json);
  }

  cached = { token: json.access_token, expiresAt: Date.now() + (json.expires_in || 3600) * 1000 };
  return cached.token;
}

async function signFetch(path, init = {}) {
  const token = await accessToken();
  const res = await fetch(`${hosts().sign}/api/v1${path}`, {
    ...init,
    headers: { Authorization: `Zoho-oauthtoken ${token}`, ...(init.headers || {}) }
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text.slice(0, 600) }; }

  /* Zoho Sign returns HTTP 200 with status:"failure" on business errors. */
  if (!res.ok || json.status === 'failure') {
    throw new HubError(res.ok ? 422 : res.status,
      json.message || `Zoho Sign rejected the request (HTTP ${res.status}).`,
      json);
  }
  return json;
}

/* -- Step 1 — upload the PDF and declare who signs ----------------------- */
export async function createRequest({ pdf, filename, requestName, actions, expiryDays, notes }) {
  const form = new FormData();
  form.append('file', new Blob([pdf], { type: 'application/pdf' }), filename);
  form.append('data', JSON.stringify({
    requests: {
      request_name: requestName,
      expiration_days: expiryDays || 15,
      is_sequential: true,          // Valura counter-signs, then the partner
      email_reminders: true,
      reminder_period: 5,
      notes: notes || '',
      actions: actions.map((a, i) => ({
        recipient_name: a.name,
        recipient_email: a.email,
        action_type: 'SIGN',
        signing_order: i,
        verify_recipient: false,
        private_notes: a.note || ''
      }))
    }
  }));

  const json = await signFetch('/requests', { method: 'POST', body: form });
  const req = json.requests || {};
  if (!req.request_id) throw new HubError(502, 'Zoho Sign accepted the upload but returned no request id.', json);
  return {
    requestId: String(req.request_id),
    documentIds: (req.document_ids || []).map(d => String(d.document_id)),
    actions: (req.actions || []).map(a => ({
      actionId: String(a.action_id),
      name: a.recipient_name,
      email: a.recipient_email
    }))
  };
}

/* -- Step 2 — place the fields and dispatch ------------------------------ */
export async function submitRequest({ requestId, documentId, actions }) {
  const form = new FormData();
  form.append('data', JSON.stringify({
    requests: {
      actions: actions.map(a => ({
        action_id: a.actionId,
        recipient_name: a.name,
        recipient_email: a.email,
        action_type: 'SIGN',
        verify_recipient: false,
        fields: a.fields.map(f => ({
          document_id: documentId,
          field_name: f.name,
          field_type_name: f.type,        // Signature | Date | Textfield
          field_label: f.label,
          field_category: f.type.toLowerCase(),
          is_mandatory: true,
          x_coord: String(Math.round(f.x)),
          y_coord: String(Math.round(f.y)),
          abs_width: String(Math.round(f.w)),
          abs_height: String(Math.round(f.h)),
          page_no: f.page
        }))
      }))
    }
  }));

  return signFetch(`/requests/${requestId}/submit`, { method: 'POST', body: form });
}

export async function getRequest(requestId) {
  const json = await signFetch(`/requests/${requestId}`);
  const r = json.requests || {};
  return {
    requestId: String(r.request_id || requestId),
    name: r.request_name,
    status: r.request_status,                    // inprogress | completed | declined | recalled | expired
    createdAt: r.created_time,
    expiresAt: r.expire_by,
    actions: (r.actions || []).map(a => ({
      name: a.recipient_name,
      email: a.recipient_email,
      status: a.action_status,                   // NOTSIGNED | SIGNED | VIEWED | DECLINED
      signedAt: a.signing_date,
      order: a.signing_order
    }))
  };
}

/* The executed copy, once every party has signed. */
export async function downloadRequest(requestId) {
  const token = await accessToken();
  const res = await fetch(`${hosts().sign}/api/v1/requests/${requestId}/pdf`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` }
  });
  if (!res.ok) throw new HubError(res.status, `Could not download the executed document (HTTP ${res.status}).`);
  return Buffer.from(await res.arrayBuffer());
}

export async function recallRequest(requestId) {
  return signFetch(`/requests/${requestId}/recall`, { method: 'POST' });
}
