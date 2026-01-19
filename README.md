# Legends Barbershop

## Find barbers or local clients in your area!

## Authentication

This backend uses Firebase Authentication. The frontend signs users in with Google via Firebase Client SDK, then sends the Firebase ID token to the backend for verification.

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/verify` | Token in body | Verify Firebase token, create/return user |
| GET | `/auth/me` | Bearer token | Get current user |
| PATCH | `/auth/me` | Bearer token | Update profile |
| DELETE | `/auth/me` | Bearer token | Deactivate account |
| POST | `/auth/logout` | Bearer token | Revoke tokens |

### Production Usage

```bash
# 1. Frontend gets Firebase ID token after Google Sign-In
const idToken = await firebase.auth().currentUser.getIdToken();

# 2. Verify token and create/get user
curl -X POST http://localhost:8080/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"idToken": "your-firebase-id-token"}'

# 3. Use the Firebase ID token for authenticated requests
curl http://localhost:8080/auth/me \
  -H "Authorization: Bearer your-firebase-id-token"
```

## Dev Testing Flow

In development mode (`NODE_ENV=development`), you can test authentication without a real Firebase token.

### 1. Create a Test User

```bash
curl -X POST http://localhost:8080/auth/dev/test-login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

Response:
```json
{
  "user": {
    "id": "...",
    "firebaseUid": "test-user-1234567890",
    "email": "test@example.com",
    "emailVerified": true,
    "provider": "google",
    "role": "client",
    "firstName": "Test",
    "lastName": "User",
    "displayName": "Test User",
    "profilePic": "https://via.placeholder.com/150",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  },
  "devToken": "dev:test-user-1234567890",
  "note": "Use devToken as Bearer token for testing"
}
```

### 2. Use the Dev Token for Authenticated Requests

```bash
# Get user profile
curl http://localhost:8080/auth/me \
  -H "Authorization: Bearer dev:test-user-1234567890"

# Update profile
curl -X PATCH http://localhost:8080/auth/me \
  -H "Authorization: Bearer dev:test-user-1234567890" \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Updated", "lastName": "Name"}'

# Deactivate account
curl -X DELETE http://localhost:8080/auth/me \
  -H "Authorization: Bearer dev:test-user-1234567890"
```

### Notes

- Dev tokens only work when `NODE_ENV=development`
- The `/auth/logout` endpoint requires a real Firebase user (won't work with test users)
- Dev endpoints return 404 in production
