// src/utils/googleClient.ts
import { OAuth2Client } from "google-auth-library";

const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const redirectUri = process.env.GOOGLE_CALLBACK_URL!;

if (!clientId || !clientSecret || !redirectUri) {
  console.error("[googleClient] Missing Google OAuth env vars");
  throw new Error("Missing Google OAuth configuration");
}

export const googleClient = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri,
});
