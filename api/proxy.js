// Vercel serverless function
export default async function handler(req, res) {
  const backendBase = "http://46.62.232.61:8092"; // твой HTTP backend

  // создаём полный URL
  const url = `${backendBase}${req.url}`;

  // проксируем запрос
  const response = await fetch(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
  });

  const data = await response.text();
  res.status(response.status).send(data);
}
