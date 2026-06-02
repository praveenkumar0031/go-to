# Backend API Contract

## Base URLs
- Auth Routes: `/api/goto`
- URL Routes: `/api/goto/urls`
- Redirect & Logs Routes: `/goto`

## Authentication
Token is sent via `Authorization: Bearer <token>` header.

## Routes

### 1. Auth (`/api/goto`)
- **POST `/signup`**
  - **Body:** `{ username, email, password, role }`
  - **Response (201):** `{ message: "User registered successfully" }`
- **POST `/login`**
  - **Body:** `{ email, password }`
  - **Response (200):** `{ token }`
- **GET `/user`**
  - **Headers:** Auth required
  - **Response (200):** User object `{ _id, email, name, username, role, ... }`
- **POST `/auth/google`**
  - **Body:** `{ code }`
  - **Response (200):** `{ token, user }`

### 2. URLs (`/api/goto/urls`)
- **POST `/`**
  - **Headers:** Auth required
  - **Body:** `{ originalUrl, customAlias? }`
  - **Response (201/200):** URL object `{ _id, originalUrl, shortCode, userId, createdAt }`
- **GET `/`**
  - **Headers:** Auth required
  - **Response (200):** `{ success: true, count, urls: [{ _id, originalUrl, shortCode, userId, createdAt }] }`
- **PUT `/:shortCode`**
  - **Headers:** Auth required
  - **Body:** `{ originalUrl?, customAlias? }`
  - **Response (200):** Updated URL object
- **DELETE `/:shortCode`**
  - **Headers:** Auth required
  - **Response (200):** `{ message: "URL and associated analytics successfully deleted." }`

### 3. Analytics & Logs (`/goto`)
- **GET `/:shortCode`**
  - **Action:** Redirects to `originalUrl` and logs the visit.
- **GET `/:shortCode/analytics`**
  - **Headers:** Auth required
  - **Response (200):** 
    ```json
    {
      "originalUrl": "...",
      "shortCode": "...",
      "createdAt": "...",
      "totalClicks": 0,
      "lastVisitedAt": "...",
      "recentVisits": [
        {
          "_id": "...",
          "urlId": "...",
          "ipAddress": "...",
          "userAgent": "...",
          "browser": "...",
          "os": "...",
          "deviceType": "...",
          "country": "...",
          "createdAt": "...",
          "updatedAt": "..."
        }
      ]
    }
    ```
- **GET `/logs/all`**
  - **Headers:** Auth required
  - **Response (200):**
    ```json
    {
      "success": true,
      "count": 0,
      "logs": [
        { "shortCode": "...", "ipAddress": "...", "userAgent": "...", "visitedAt": "..." }
      ]
    }
    ```
- **GET `/logs/today`**
  - **Headers:** Auth required
  - **Response (200):**
    ```json
    {
      "success": true,
      "todayClicks": 0,
      "hourlyTraffic": [
        { "hour": "00:00", "clicks": 0 },
        ...
      ],
      "recentLogs": [...]
    }
    ```