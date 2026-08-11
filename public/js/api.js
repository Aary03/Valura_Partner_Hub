/* ============================================================================
   Client for the Hub's server routes.
   ----------------------------------------------------------------------------
   The Hub works with no server at all — every document renders and prints in
   the browser. The routes add three things a browser cannot do on its own:
   put a PDF out for signature, send a drafted email, and produce a PDF file
   without a print dialog.

   The Hub key is held in localStorage on the operator's machine. It is not a
   user credential; it is what stops an unauthenticated stranger who finds the
   deployment URL from sending documents under Valura's Zoho account.
   ==========================================================================*/

window.VLR = window.VLR || {};

VLR.Api = (function () {
  const KEY = 'vlr_hub_conn';
  let conn = { base: '', key: '' };

  try { Object.assign(conn, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}

  function save(next) {
    conn = Object.assign(conn, next || {});
    try { localStorage.setItem(KEY, JSON.stringify(conn)); } catch (e) {}
    return conn;
  }

  const get = () => ({ ...conn });

  /* Same-origin when served from the deployment; otherwise the operator
     points it at the deployed base URL (opening index.html from disk). */
  function url(path) {
    const base = (conn.base || '').replace(/\/$/, '');
    return base + path;
  }

  const configured = () => Boolean(conn.key);

  async function call(path, { method = 'GET', json, raw } = {}) {
    if (!configured()) {
      throw new Error('No Hub API key set. Open Partner details → Connections and paste the HUB_API_KEY from the deployment.');
    }
    let res;
    try {
      res = await fetch(url(path), {
        method,
        headers: {
          'X-Hub-Key': conn.key,
          ...(json ? { 'Content-Type': 'application/json' } : {})
        },
        body: json ? JSON.stringify(json) : undefined
      });
    } catch (e) {
      throw new Error(`Could not reach the API at ${url(path)}. If the Hub is open from disk, set the deployment URL under Connections. (${e.message})`);
    }

    if (raw) {
      if (!res.ok) {
        const t = await res.text().catch(() => '');
        let msg = `HTTP ${res.status}`;
        try { msg = JSON.parse(t).error || msg; } catch (e) {}
        throw new Error(msg);
      }
      return { blob: await res.blob(), headers: res.headers };
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      const err = new Error(data.error || `HTTP ${res.status}`);
      err.detail = data.detail;
      throw err;
    }
    return data;
  }

  return {
    get, save, configured,
    health: () => call('/api/health'),
    sendForSignature: payload => call('/api/sign/send', { method: 'POST', json: payload }),
    signatureStatus: requestId => call(`/api/sign/status?requestId=${encodeURIComponent(requestId)}`),
    downloadExecuted: requestId => call(`/api/sign/download?requestId=${encodeURIComponent(requestId)}`, { raw: true }),
    sendEmail: payload => call('/api/email/send', { method: 'POST', json: payload }),
    pdf: payload => call('/api/pdf', { method: 'POST', json: payload, raw: true })
  };
})();
