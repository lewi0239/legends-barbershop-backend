import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = verifyJwt(token);
    (req as any).auth = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
