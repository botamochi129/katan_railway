// transit/api/data.js
export default async function handler(req, res) {
  // CORS ヘッダー設定（すべてのレスポンスに付与）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS プリフライト対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // URL からエンドポイントを判定（/api/data または /api/arrivals）
    const url = new URL(req.url, `https://${req.headers.host}`);
    const pathname = url.pathname;
    
    let endpoint = null;
    if (pathname === '/api/data') {
      endpoint = 'data';
    } else if (pathname === '/api/arrivals') {
      endpoint = 'arrivals';
    } else {
      // 未定義のパスは404
      return res.status(404).json({ error: 'Not Found' });
    }

    // MTR サーバーに転送（クエリ文字列もそのまま渡す）
    const queryString = url.search || '';
    const targetUrl = `http://118.27.228.27:8888/${endpoint}${queryString}`;
    
    const response = await fetch(targetUrl, { 
      headers: { 'Accept': 'application/json' },
      cache: 'no-store' 
    });
    
    const text = await response.text();
    
    // JSON またはテキストをそのまま返す
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(response.status).send(text);
    
  } catch (error) {
    console.error('[MTR Proxy Error]', error.message);
    res.status(500).json({ error: 'Proxy failed', details: error.message });
  }
}
