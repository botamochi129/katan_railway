// transit/api/data.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const targetUrl = 'http://118.27.228.27:8888/data';
    const response = await fetch(targetUrl, { 
      headers: { 'Accept': 'application/json' },
      cache: 'no-store' 
    });
    const text = await response.text();
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(response.status).send(text);
    
  } catch (error) {
    console.error('[Data Proxy Error]', error.message);
    res.status(500).json({ error: 'Proxy failed', details: error.message });
  }
}
