// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { googleClient } from "../utils/googleClient";
import { handleGoogleCode } from "../services/auth";

// ---------- config / helpers ----------
const COOKIE_SECURE =
  String(process.env.COOKIE_SECURE ?? "false").toLowerCase() === "true";
const ACCESS_TTL_MIN = Number(process.env.ACCESS_TTL_MIN ?? 15);
const REFRESH_TTL_DAYS = Number(process.env.REFRESH_TTL_DAYS ?? 30);
const WEB_URL = process.env.WEB_URL ?? "http://localhost:5173";

function getCookieDomain() {
  const d = process.env.COOKIE_DOMAIN;
  // For localhost, domain must be undefined or it won't set
  return d === "localhost" || !d ? undefined : d;
}

// ---------- controllers ----------
export const startGoogle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Allow optional ?redirect=/some/path to flow through OAuth via state
    const redirect =
      typeof req.query.redirect === "string" ? req.query.redirect : "";
    const state = redirect ? encodeURIComponent(redirect) : undefined;

    const url = googleClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "email", "profile"],
      ...(state ? { state } : {}),
    });

    console.log("[auth] startGoogle → redirect:", url);
    return res.redirect(url);
  } catch (err) {
    console.error("[auth] startGoogle error:", err);
    return next(err);
  }
};

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const code =
      typeof req.query.code === "string" ? req.query.code : undefined;
    if (!code) return res.status(400).send("Missing code");

    // Optional state passthrough (see startGoogle)
    const state =
      typeof req.query.state === "string"
        ? decodeURIComponent(req.query.state)
        : "";

    const { access, refresh } = await handleGoogleCode(code);

    res
      .cookie("access_token", access, {
        httpOnly: true,
        sameSite: COOKIE_SECURE ? ("none" as const) : ("lax" as const), // SameSite=None when secure
        secure: COOKIE_SECURE,
        maxAge: ACCESS_TTL_MIN * 60 * 1000,
        domain: getCookieDomain(),
      })
      .cookie("refresh_token", refresh, {
        httpOnly: true,
        sameSite: COOKIE_SECURE ? ("none" as const) : ("lax" as const),
        secure: COOKIE_SECURE,
        maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
        domain: getCookieDomain(),
      });

    const finalRedirect = state
      ? `${WEB_URL}${state.startsWith("/") ? state : `/${state}`}`
      : `${WEB_URL}/auth/success`;

    console.log("[auth] googleCallback → redirect:", finalRedirect);
    return res.redirect(finalRedirect);
  } catch (err) {
    console.error("[auth] googleCallback error:", err);
    return next(err);
  }
};

// Optional: quick logout helper (clear cookies)
export const logout = (_req: Request, res: Response) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      sameSite: COOKIE_SECURE ? ("none" as const) : ("lax" as const),
      secure: COOKIE_SECURE,
      domain: getCookieDomain(),
    })
    .clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: COOKIE_SECURE ? ("none" as const) : ("lax" as const),
      secure: COOKIE_SECURE,
      domain: getCookieDomain(),
    })
    .status(204)
    .end();
};
