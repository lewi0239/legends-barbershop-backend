import type { Request, Response, NextFunction } from "express";
import type { DecodedIdToken } from "firebase-admin/auth";
import { verifyFirebaseToken } from "../services/firebase.js";
import { UserModel } from "../models/user.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName?: string;
    picture?: string;
    dbUser?: InstanceType<typeof UserModel>;
  };
  firebaseToken?: DecodedIdToken;
}

export async function firebaseAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const idToken = authHeader.split("Bearer ")[1];

  if (!idToken) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    // DEV ONLY: Accept dev tokens for testing (format: "dev:<uid>")
    if (process.env.NODE_ENV === "development" && idToken.startsWith("dev:")) {
      const uid = idToken.slice(4);
      const dbUser = await UserModel.findOne({ firebaseUid: uid });

      if (!dbUser || !dbUser.isActive) {
        res.status(401).json({ error: "User not found or inactive" });
        return;
      }

      req.user = {
        uid,
        email: dbUser.email,
        emailVerified: dbUser.emailVerified ?? false,
        displayName: dbUser.displayName ?? undefined,
        picture: dbUser.profilePic ?? undefined,
        dbUser,
      };

      next();
      return;
    }

    const decodedToken = await verifyFirebaseToken(idToken);

    // Find user in database
    const dbUser = await UserModel.findOne({ firebaseUid: decodedToken.uid });

    if (!dbUser || !dbUser.isActive) {
      res.status(401).json({ error: "User not found or inactive" });
      return;
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      emailVerified: decodedToken.email_verified || false,
      displayName: decodedToken.name,
      picture: decodedToken.picture,
      dbUser,
    };
    req.firebaseToken = decodedToken;

    next();
  } catch (error) {
    console.error("Firebase auth error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireRole(...roles: string[]) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user?.dbUser) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const userRole = req.user.dbUser.role || "client";

    if (!roles.includes(userRole)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
}
