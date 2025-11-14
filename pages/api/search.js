import querystring from 'querystring';

async function fetchGoogle(q) {
  const key = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;
  if (!key || !cx) throw new Error('Google API key or CX not configured');
  const url = `https://www.googleapis.com/customsearch/v1?${querystring.stringify({ key, cx, q })}`;
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Google API error: ${txt}`);
  }
  const json = await res.json();
  const items = (json.items || []).map((it) => ({ title: it.title, link: it.link, snippet: it.snippet || it.htmlSnippet || '' }));
  return items;
}

async function fetchSerpApi(q) {
  const key = process.env.SERPAPI_KEY;
  if (!key) throw new Error('SerpApi key not configured');
  const url = `https://serpapi.com/search.json?${querystring.stringify({ q, api_key: key })}`;
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`SerpApi error: ${txt}`);
  }
  const json = await res.json();
  const items = (json.organic_results || json.organic_results || []).map((it) => ({ title: it.title, link: it.link || it.source || '', snippet: it.snippet || it.snippet || '' }));
  return items;
}

export default async function handler(req, res) {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Missing q parameter' });

  try {
    let items = [];
    if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_CX) {
      items = await fetchGoogle(q);
    } else if (process.env.SERPAPI_KEY) {
      items = await fetchSerpApi(q);
    } else {
      return res.status(500).json({ error: 'No search provider configured. Set GOOGLE_API_KEY+GOOGLE_CX or SERPAPI_KEY.' });
    }

    return res.status(200).json({ items });
  } catch (err) {
    console.error('search error', err);
    return res.status(500).json({ error: err.message || 'Search error' });
  }
}
