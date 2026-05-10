/**
 * Morphism API Service
 *
 * All backend communication goes through this file.
 * To switch from mock server to real Flask backend,
 * change BASE_URL to your production URL.
 *
 * Mock server:  http://localhost:5001  (run: node mock-server/server.js)
 * Real backend: http://localhost:5000  (your Flask server)
 *
 * API contract from documentation/api.md:
 *   POST /api/process
 *   Request:  { text: string }
 *   Response: { corrected: string, detected_errors: [], latency: float, accuracy: float }
 */

import axios from 'axios';

// ── Swap this URL to point to the real Flask server when ready ──
const BASE_URL = 'http://localhost:5001';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/**
 * POST /api/process
 * @param {string} text - The Taglish input text to correct.
 * @returns {Promise<{
 *   corrected: string,
 *   detected_errors: Array<{ original: string, corrected: string, category: string, position: number }>,
 *   mixed_kept: string[],
 *   latency: number,
 *   accuracy: number
 * }>}
 */
export async function processText(text) {
  const response = await client.post('/api/process', { text });
  return response.data;
}
