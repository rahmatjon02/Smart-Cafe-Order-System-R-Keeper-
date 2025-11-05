export default async function handler(req, res) {
  const backendBase = "http://46.62.232.61:8092";

  // убираем /api из пути
  const path = req.url.replace(/^\/api/, "");

  const url = `${backendBase}${path}`;

  const response = await fetch(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
  });

  const data = await response.text();
  res.status(response.status).send(data);
}
