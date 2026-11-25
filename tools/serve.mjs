import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { hashTtsKey } from "../js/audio/tts-hash.js";

const PORT = Number(process.env.PORT || 4173);
const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, ".cache", "tts");
const PYTHON_BIN = process.env.PYTHON || "python";
const TTS_HELPER = path.join(ROOT, "tools", "tts_helper.py");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg"
};

const inFlight = new Map();

function synthesizeToCache(text, lang, outFile) {
  const key = `${lang}|${outFile}`;
  if (inFlight.has(key)) return inFlight.get(key);

  const job = (async () => {
    await fs.promises.mkdir(CACHE_DIR, { recursive: true });
    const tmpFile = `${outFile}.${process.pid}.${Date.now()}.tmp`;
    await new Promise((resolve, reject) => {
      const child = spawn(PYTHON_BIN, [TTS_HELPER], { stdio: ["pipe", "ignore", "pipe"] });
      let stderr = "";
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(stderr.trim() || `tts_helper exited with code ${code}`));
      });
      child.stdin.end(JSON.stringify({ text, lang, out: tmpFile }), "utf8");
    });
    const stat = await fs.promises.stat(tmpFile);
    if (stat.size === 0) {
      await fs.promises.unlink(tmpFile).catch(() => {});
      throw new Error("Empty audio produced");
    }
    await fs.promises.rename(tmpFile, outFile);
  })().finally(() => {
    inFlight.delete(key);
  });

  inFlight.set(key, job);
  return job;
}

async function handleTts(reqUrl, res) {
  const lang = reqUrl.searchParams.get("lang") === "ja" ? "ja" : "vi";
  const text = (reqUrl.searchParams.get("text") || "").normalize("NFC").trim();
  if (!text || text.length > 400) {
    res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Invalid text" }));
    return;
  }

  const hash = hashTtsKey(lang, text);
  const staticFile = path.join(ROOT, "assets", "audio", lang, `${hash}.mp3`);
  const cacheFile = path.join(CACHE_DIR, `${lang}_${hash}.mp3`);

  for (const candidate of [staticFile, cacheFile]) {
    try {
      const data = await fs.promises.readFile(candidate);
      if (data.length > 0) {
        res.writeHead(200, {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=31536000"
        });
        res.end(data);
        return;
      }
    } catch {
      // not found yet
    }
  }

  try {
    await synthesizeToCache(text, lang, cacheFile);
    const data = await fs.promises.readFile(cacheFile);
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000"
    });
    res.end(data);
  } catch (err) {
    console.warn("[TTS]", err?.message || err);
    res.writeHead(503, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "TTS unavailable" }));
  }
}

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  if (reqUrl.pathname === "/api/tts") {
    handleTts(reqUrl, res);
    return;
  }

  const rel = reqUrl.pathname === "/" ? "index.html" : reqUrl.pathname.replace(/^\/+/, "");
  const filePath = path.resolve(ROOT, rel);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": ext === ".mp3" ? "public, max-age=31536000" : "no-store"
    });
    res.end(data);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`MathZoo running at http://127.0.0.1:${PORT}`);
});
