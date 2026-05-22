export default async function handler(req, res) {
  // CORS ヘッダー設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS プリフライト対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // MTR サーバーの /arrivals に転送（クエリ文字列をそのまま渡す）
    const url = new URL(req.url, `https://${req.headers.host}`);
    const queryString = url.search || '';
    const targetUrl = `http://118.27.228.27:8888/arrivals${queryString}`;
    
    const response = await fetch(targetUrl, { 
      headers: { 'Accept': 'application/json' },
      cache: 'no-store' 
    });
    
    const text = await response.text();
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(response.status).send(text);
    
  } catch (error) {
    console.error('[Arrivals Proxy Error]', error.message);
    res.status(500).json({ error: 'Proxy failed', details: error.message });
  }
}
