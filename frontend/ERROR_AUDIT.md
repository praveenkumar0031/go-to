# Error Audit Report

| # | File | Line | Error Type | Description | Severity | Status |
|---|------|------|------------|-------------|----------|--------|
| 1 | `frontend/src/components/user/Login.jsx` | 131, 153 | Accessibility / HTML | Missing `htmlFor` on `<label>` and missing `id` on corresponding `<input>` tags. | MEDIUM | ✅ FIXED |
| 2 | `frontend/src/components/user/Signup.jsx` | 74, 96, 118 | Accessibility / HTML | Missing `htmlFor` on `<label>` and missing `id` on corresponding `<input>` tags. | MEDIUM | ✅ FIXED |
| 3 | `frontend/src/pages/CreateUrl.jsx` | 173, 202 | Accessibility / HTML | Missing `htmlFor` on `<label>` and missing `id`/`name` on corresponding `<input>` tags. | MEDIUM | ✅ FIXED |
| 4 | `frontend/src/pages/Dashboard.jsx` | 109 | Accessibility / HTML | Search `<input>` is missing `id`, `name`, and an associated `<label>` or `aria-label`. | MEDIUM | ✅ FIXED |
| 5 | `frontend/src/pages/Analytics.jsx` | 215 | React Error | Missing or poor `key` prop when rendering the recent visits table row. Also wrapped visits map in safe `Array.isArray` check. | HIGH | ✅ FIXED |
| 6 | `frontend/src/components/layouts/AuthLayout.jsx` | 92 | React Error | Features `.map()` uses array index for `key`. | HIGH | ✅ FIXED |
| 7 | `frontend/src/api/api.js` | 3 | Env Var / Bug | `import.meta.env.VITE_BACKEND_API` missing standard fallback `VITE_API_BASE_URL`. Replaced with `VITE_API_BASE_URL`. | LOW | ✅ FIXED |
| 8 | `frontend/src/api/axios.js` | 3 | Env Var / Bug | Same standard env var fallback updated to `VITE_API_BASE_URL`. | LOW | ✅ FIXED |

## UNRESOLVED — NEEDS BACKEND CHANGE
- **GET /api/goto/urls Projection Bug**: The backend API (`backend/src/controllers/UrlController.js`, line 134) uses an invalid Mongoose projection `{ createdAt: -1 }`. Mongoose interprets this as an inclusion projection, meaning it **only** returns `_id` and `createdAt` and completely strips out `originalUrl` and `shortCode` from the response. Because I am constrained to not touch backend files, I cannot fix this API. I have updated the frontend `Dashboard.jsx` to render "Unknown URL" and disabled the Analytics/Delete buttons gracefully to prevent 404 crashes (like navigating to `/analytics/undefined`), but the backend controller must be fixed to return the full URL documents.