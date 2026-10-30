// Cloudflare Worker : proxy sécurisé entre le dashboard et l’API GitHub.
// Secrets : GITHUB_TOKEN, APP_PASSWORD — Variables : REPO ("user/repo"), BRANCH ("main"), ORIGIN ("https://user.github.io")
const b64 = s => {
  const b = new TextEncoder().encode(s); let o = '';
  for (let i = 0; i < b.length; i += 32768) o += String.fromCharCode(...b.subarray(i, i + 32768));
  return btoa(o);
};

export default {
  async fetch(req, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,X-Auth',
    };
    const out = (body, status = 200) => new Response(body, { status, headers: { ...cors, 'Content-Type': 'application/json' } });
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (new URL(req.url).pathname !== '/data') return out('{"error":"not found"}', 404);
    if (!env.APP_PASSWORD || req.headers.get('X-Auth') !== env.APP_PASSWORD) return out('{"error":"unauthorized"}', 401);

    const branch = env.BRANCH || 'main';
    const url = `https://api.github.com/repos/${env.REPO}/contents/data.json`;
    const h = { Authorization: `Bearer ${env.GITHUB_TOKEN}`, 'User-Agent': 'resell-dashboard', 'X-GitHub-Api-Version': '2022-11-28' };

    if (req.method === 'GET') {
      const r = await fetch(`${url}?ref=${branch}`, { headers: { ...h, Accept: 'application/vnd.github.raw+json' } });
      if (r.status === 404) return out('{}');
      return r.ok ? out(await r.text()) : out(`{"error":"github ${r.status}"}`, 502);
    }
    if (req.method === 'PUT') {
      const body = await req.text();
      try { JSON.parse(body); } catch { return out('{"error":"invalid json"}', 400); }
      const meta = await fetch(`${url}?ref=${branch}`, { headers: h });
      const sha = meta.ok ? (await meta.json()).sha : undefined;
      const r = await fetch(url, {
        method: 'PUT', headers: h,
        body: JSON.stringify({ message: 'Mise à jour data.json', content: b64(body), branch, sha }),
      });
      return r.ok ? out('{"ok":true}') : out(`{"error":"github ${r.status}"}`, 502);
    }
    return out('{"error":"method not allowed"}', 405);
  },
};
