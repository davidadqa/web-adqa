// Utilidades compartidas por las herramientas de QA: servidor estático y navegador.
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const require = createRequire(import.meta.url);
export const { chromium } = require("playwright");

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8", ".json": "application/json",
};

// Sirve `dir` en un puerto libre. `prefix` simula la subcarpeta de GitHub Pages (p. ej. "/web-adqa/").
export async function serve(dir, prefix = "/") {
  const server = createServer(async (req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (!p.startsWith(prefix)) { res.writeHead(404); return res.end("not found"); }
    p = "/" + p.slice(prefix.length);
    let file = join(dir, p);
    try {
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
      const body = await readFile(file);
      res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404, { "content-type": "text/html" });
      res.end("<h1>404</h1>");
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${server.address().port}${prefix}`;
  return { base, close: () => new Promise((r) => server.close(r)) };
}

// Abre una página, hace scroll para disparar las animaciones y devuelve métricas básicas.
export async function inspect(browser, url, { width = 1440, height = 900, shot } = {}) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  const failed = [];
  page.on("response", (r) => { if (r.status() >= 400 && !r.url().includes("/recursos/")) failed.push(`${r.status()} ${r.url()}`); });
  const resp = await page.goto(url, { waitUntil: "networkidle" });
  const H = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 600) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(40); }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(1200);
  const info = await page.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth - innerWidth,
    h1: document.querySelectorAll("h1").length,
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content || "",
    jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
      try { JSON.parse(s.textContent); return "ok"; } catch (e) { return "ERROR: " + e.message; }
    }),
    links: [...document.querySelectorAll("a[href]")].map((a) => a.href),
    ids: [...document.querySelectorAll("[id]")].map((e) => e.id),
    text: document.querySelector("main")?.innerText || "",
  }));
  if (shot) await page.screenshot({ path: shot, fullPage: true });
  await page.close();
  return { status: resp ? resp.status() : 0, errors, failed, ...info };
}
