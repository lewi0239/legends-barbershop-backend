import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;
const ACCESS_MIN = Number(process.env.ACCESS_TTL_MIN || 15);
const REFRESH_DAYS = Number(process.env.REFRESH_TTL_DAYS || 30);

export const signAccess = (payload: object) =>
  jwt.sign(payload, SECRET, { expiresIn: `${ACCESS_MIN}m` });

export const signRefresh = (payload: object) =>
  jwt.sign(payload, SECRET, { expiresIn: `${REFRESH_DAYS}d` });

export const verifyJwt = <T = any>(token: string) =>
  jwt.verify(token, SECRET) as T;
