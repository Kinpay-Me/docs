---
id: api-auth
number: 1
title: Auth API
category: api-reference
categoryTitle: API Reference
---

## POST /auth/register

Register a new user account.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `full_name` | string | Yes | Display name |
| `email` | string | Yes | Must be unique |
| `password` | string | Yes | Min 8 chars, must include number and uppercase |
| `phone` | string | No | E.164 format (e.g. `+2348012345678`) |
| `country_code` | string | No | ISO-3166 alpha-2 |

**Response** — `201 Created`

Returns the [[link:data-architecture/users-entity|user]] object and a `{ access_token, refresh_token }` pair. The user must verify their email/phone via OTP before accessing protected routes.

---

## POST /auth/login

Authenticate with email/phone and password.

**Request body** — `identifier` (email or phone) + `password`

**Response** — `200 OK` with tokens. If the user has TOTP enabled, the response includes `requires_totp: true` and a short-lived `totp_session_token` instead of full tokens.

---

## POST /auth/verify-otp

Verify the OTP sent to email, SMS, or WhatsApp.

**Request body** — `identifier`, `otp`, `channel` (`email`, `sms`, `whatsapp`)

---

## POST /auth/totp/verify

Complete TOTP second-factor verification after login.

**Request body** — `totp_session_token`, `code` (6-digit TOTP code)

**Response** — Full `{ access_token, refresh_token }` pair.

---

## POST /auth/refresh

Exchange a refresh token for a new access token.

**Request body** — `refresh_token`

Refresh tokens are single-use. Each call rotates the token.

---

## POST /auth/forgot-password

Request a password reset OTP.

**Request body** — `identifier` (email or phone), `channel`

---

## POST /auth/reset-password

Set a new password using the OTP received.

**Request body** — `identifier`, `otp`, `new_password`

---

## POST /auth/logout

Invalidate the current refresh token.

**Request body** — `refresh_token`

---

## Authentication headers

All protected endpoints require:

```
Authorization: Bearer <access_token>
```

Access tokens expire after 15 minutes. Use `POST /auth/refresh` to get a new one before expiry.
