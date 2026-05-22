// transit/api/data.js
export default async function handler(req, res) {
  // CORS ヘッダー設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // プリフライトリクエスト対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const isArrivals = req.url.includes('arrivals');
    const endpoint = isArrivals ? 'arrivals' : 'data';
    const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    
    const targetUrl = `http://118.27.228.27:8888/${endpoint}${queryString}`;
    
    const response = await fetch(targetUrl, { 
      headers: { 'Accept': 'application/json' },
      cache: 'no-store' 
    });
    
    const text = await response.text();
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(response.status).send(text);
    
  } catch (error) {
    console.error('[MTR Proxy Error]', error.message);
    res.status(500).json({ error: 'Proxy failed', details: error.message });
  }
}
