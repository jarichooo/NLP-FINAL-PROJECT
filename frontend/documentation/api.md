# API Endpoints (Flask Connection)

- Base URL: `http://localhost:5000`
- POST `/api/process`:
  - Request: `{ "text": string }`
  - Response: `{ "corrected": string, "detected_errors": [], "latency": float, "accuracy": float }`
