export default async function handler(req, res) {
  const backendBase = "http://46.62.232.61:8092";

  // req.query для query-параметров, req.method и req.body уже есть
  // req.url содержит путь после /api/
  const path = req.url; // здесь уже без /api благодаря catch-all

  const url = `${backendBase}${path}`;

  const response = await fetch(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
  });

  // возвращаем JSON
  const data = await response.json();
  res.status(response.status).json(data);
}
