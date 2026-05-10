/**
 * Mock Server for Morphism Frontend
 * Simulates the Flask backend API at http://localhost:5001
 *
 * Run: node mock-server/server.js
 * Endpoint: POST http://localhost:5001/api/process
 *
 * To switch to real backend: update BASE_URL in src/services/api.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5001;
const DB_PATH = path.join(__dirname, 'db.json');

function getDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

/**
 * Finds the best matching sample from db.json based on input text.
 * Falls back to first sample if no close match found.
 * In production, this is replaced by the real Flask NLP pipeline.
 */
function findMatch(inputText, samples) {
  const input = inputText.trim().toLowerCase();

  // Exact or substring match
  for (const s of samples) {
    if (s.input.toLowerCase() === input || s.input.toLowerCase().includes(input.substring(0, 20))) {
      return s;
    }
  }

  // Fallback: return the first sample
  return samples[0];
}

const server = http.createServer((req, res) => {
  // CORS headers — allow Vite dev server (port 5173) to call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/process') {
    let body = '';

    req.on('data', chunk => { body += chunk.toString(); });

    req.on('end', () => {
      try {
        const { text } = JSON.parse(body);

        if (!text || !text.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'text field is required' }));
          return;
        }

        const db = getDb();
        const match = findMatch(text, db.samples);

        // Simulate network latency (200–600ms)
        const delay = Math.floor(Math.random() * 400) + 200;
        setTimeout(() => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            corrected: match.corrected,
            detected_errors: match.detected_errors,
            mixed_kept: match.mixed_kept,
            latency: match.latency,
            accuracy: match.accuracy,
          }));
        }, delay);

      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });

    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`\n  Morphism Mock Server running at http://localhost:${PORT}`);
  console.log(`  POST /api/process  →  returns mock correction response`);
  console.log(`  Edit mock-server/db.json to add/modify sample inputs.\n`);
});
