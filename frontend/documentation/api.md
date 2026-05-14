# API Endpoints (Flask Connection)

- Base URL: `https://jarichooo-morphism.hf.space` (hosted backend)
- Mock URL: `http://localhost:5001` (mock server — run `node mock-server/server.js`)
- POST `/api/process`:
  - Request: `{ "text": string }`
  - Response: `{ "corrected": string, "detected_errors": [{ "original": string, "corrected": string, "category": string, "position": number }], "mixed_kept": string[], "latency": float, "accuracy": float }`
