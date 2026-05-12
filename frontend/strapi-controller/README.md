# Bonus Step 16 — Strict Backend Policy

## What this fixes

Without this fix, a logged-in user can see other users' todos by manually
changing the `filters[users_permissions_user][id][$eq]` value in the API URL. This is a
security flaw.

With this controller override:
- `POST /api/todos` — the `users_permissions_user` field is always forced to
  the authenticated user from the JWT, no matter what the frontend sends in the body.
- `GET /api/todos` — the result is always filtered to only the authenticated
  user's todos and wildcard populate requests are ignored.

## How to apply

1. Copy `todo.js` from this folder into your Strapi project:

```
backend/src/api/todo/controllers/todo.js
```

2. Restart Strapi:

```bash
cd backend
npm run develop
```

That's it. No other changes needed.
