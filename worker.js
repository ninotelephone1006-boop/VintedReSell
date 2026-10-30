// Cloudflare Worker : proxy sécurisé entre le dashboard et l’API GitHub.
// Toujours en ligne via data.json — le dashboard fetch GET/PUT sur /data
// Secrets : GITHUB_TOKEN, APP_PASSWORD — Variables : REPO ("user/repo"), BRANCH ("main"), ORIGIN ("https://user.github.io")
const b64 = s => {
  const b = new TextEncoder().encode(s); let o = '';
  for (let i = 0; i < b.length; i += 32768) o += String.fromCharCode(...b.subarray(i, i+32768));
  return btoa(o);
};

export default {
  async fetch(req, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,X-Auth',
      'Access-Control-Allow-Credentials': 'false',
      'Vary': 'Origin',
    };
    const out = (body, status = 200, extra = {}) => new Response(body, { status, headers: { ...cors, 'Content-Type': 'application/json', ...extra } });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const urlObj = new URL(req.url);
    if (urlObj.pathname !== '/data') return out('{"error":"not found"}', 404);

    // Auth : si APP_PASSWORD est défini, on exige X-Auth pour GET et PUT
    if (env.APP_PASSWORD) {
      const got = req.headers.get('X-Auth') || '';
      if (got !== env.APP_PASSWORD) return out('{"error":"unauthorized"}', 401);
    }

    const branch = env.BRANCH || 'main';
    const apiUrl = `https://api.github.com/repos/${env.REPO}/contents/data.json`;
    const ghHeaders = { Authorization: `Bearer ${env.GITHUB_TOKEN}`, 'User-Agent': 'resell-dashboard', 'X-GitHub-Api-Version': '2022-11-28' };

    if (req.method === 'GET') {
      const r = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers: { ...ghHeaders, Accept: 'application/vnd.github.raw+json' } });
      if (r.status === 404) return out('{"settings":{"goal":0},"items":[]}');
      if (!r.ok) return out(`{"error":"github ${r.status}"}`, 502);
      const text = await r.text();
      // Valide que c'est du JSON
      try { JSON.parse(text); } catch { return out('{"settings":{"goal":0},"items":[]}'); }
      return out(text, 200, { 'Cache-Control': 'no-store' });
    }
    if (req.method === 'PUT') {
      const body = await req.text();
      try { JSON.parse(body); } catch { return out('{"error":"invalid json"}', 400); }
      // Récupère le sha actuel pour le PUT
      const meta = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers: ghHeaders });
      const sha = meta.ok ? (await meta.json()).sha : undefined;
      const r = await fetch(apiUrl, {
        method: 'PUT',
        headers: { ...ghHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Mise à jour data.json', content: b64(body), branch, sha }),
      });
      if (!r.ok) {
        const t = await r.text().catch(()=> '');
        return out(`{"error":"github ${r.status}","detail":${JSON.stringify(t)}}`, 502);
      }
      return out('{"ok":true}');
    }
    return out('{"error":"method not allowed"}', 405);
  },
};
