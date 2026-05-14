/**
 * Morphism API Service
 *
 * All backend communication goes through this file.
 * To switch from mock server to real Flask backend,
 * change BASE_URL to your production URL.
 *
 * Mock server:  http://localhost:5001  (run: node mock-server/server.js)
 * Hosted backend: https://jarichooo-morphism.hf.space
 *
 * API contract from documentation/api.md:
 *   POST /api/process
 *   Request:  { text: string }
 *   Response: { corrected: string, detected_errors: [], latency: float, accuracy: float }
 */

import axios from "axios";

const BASE_URL = "https://jarichooo-morphism.hf.space";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 120000,
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
  const response = await client.post("/api/process", { text });
  const data = response.data || {};

  if (Array.isArray(data.detected_errors)) {
    const filtered = data.detected_errors.filter((item) => {
      const original = (item.original || "").trim();
      const corrected = (item.corrected || "").trim();
      return original && corrected && original !== corrected;
    });

    return {
      ...data,
      detected_errors: filtered,
    };
  }

  const correctedText = data.corrected || "";
  const changed = Array.isArray(data.changed_words) ? data.changed_words : [];

  const detectedErrors = changed
    .map((item) => {
    const corrected = item.corrected || "";
    const original = item.original || "";
    const position = corrected
      ? correctedText.toLowerCase().indexOf(corrected.toLowerCase())
      : -1;

    return {
      original,
      corrected,
      category: item.category || "Correction",
      position: position < 0 ? 0 : position,
    };
    })
    .filter((item) => {
      const original = item.original.trim();
      const corrected = item.corrected.trim();
      return original && corrected && original !== corrected;
    });

  return {
    corrected: correctedText,
    detected_errors: detectedErrors,
    mixed_kept: data.mixed_kept || [],
    latency: data.latency || 0,
    accuracy: data.accuracy || 0,
  };
}
