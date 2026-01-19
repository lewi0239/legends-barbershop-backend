import { Router, type Request, type Response } from "express";
import {
  firebaseAuthMiddleware,
  type AuthenticatedRequest,
} from "../middlewares/firebaseAuth.js";
import { verifyFirebaseToken, getFirebaseAuth } from "../services/firebase.js";
import {
  findOrCreateUser,
  getUserByFirebaseUid,
  updateUserProfile,
  deactivateUser,
  logoutUser,
} from "../services/auth.js";

const router = Router();

// DEV ONLY: Create a custom token for testing
router.post("/dev/create-test-token", async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== "development") {
    res.status(404).json({ error: "Not found" });
    return;
  }
  try {
    const { uid = "test-user-123", email = "test@example.com" } = req.body;
    const auth = getFirebaseAuth();
    const customToken = await auth.createCustomToken(uid);

    res.json({
      message: "Custom token created. Exchange it for an ID token using Firebase REST API.",
      customToken,
      testUid: uid,
      testEmail: email,
      instructions: {
        step1: "Use Firebase Client SDK: signInWithCustomToken(auth, customToken)",
        step2: "Or use REST API to exchange for ID token (requires Web API key)",
      },
    });
  } catch (error) {
    console.error("Create test token error:", error);
    res.status(500).json({ error: "Failed to create test token" });
  }
});

// DEV ONLY: Simulate login by creating user directly (bypasses Firebase token verification)
router.post("/dev/test-login", async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== "development") {
    res.status(404).json({ error: "Not found" });
    return;
  }
  try {
    const {
      uid = "test-user-" + Date.now(),
      email = "test@example.com",
      name = "Test User"
    } = req.body;

    // Create a mock decoded token
    const mockDecodedToken = {
      uid,
      email,
      email_verified: true,
      name,
      picture: "https://via.placeholder.com/150",
      firebase: { sign_in_provider: "google.com" },
    } as any;

    const user = await findOrCreateUser(mockDecodedToken);

    res.json({
      user,
      devToken: `dev:${uid}`,
      note: "Use devToken as Bearer token for testing: Authorization: Bearer dev:<uid>"
    });
  } catch (error) {
    console.error("Test login error:", error);
    res.status(500).json({ error: "Failed to create test user" });
  }
});

// POST /auth/verify - Verify Firebase token and create/return user
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ error: "idToken is required" });
      return;
    }

    const decodedToken = await verifyFirebaseToken(idToken);
    const user = await findOrCreateUser(decodedToken);

    res.json({ user });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// GET /auth/me - Get current user
router.get(
  "/me",
  firebaseAuthMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user?.uid;

      if (!uid) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const user = await getUserByFirebaseUid(uid);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  }
);

// PATCH /auth/me - Update current user profile
router.patch(
  "/me",
  firebaseAuthMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user?.uid;

      if (!uid) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const { firstName, lastName, displayName, profilePic } = req.body;

      const user = await updateUserProfile(uid, {
        firstName,
        lastName,
        displayName,
        profilePic,
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

// DELETE /auth/me - Deactivate current user account
router.delete(
  "/me",
  firebaseAuthMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user?.uid;

      if (!uid) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const success = await deactivateUser(uid);

      if (!success) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ message: "Account deactivated successfully" });
    } catch (error) {
      console.error("Deactivate user error:", error);
      res.status(500).json({ error: "Failed to deactivate account" });
    }
  }
);

// POST /auth/logout - Revoke user tokens
router.post(
  "/logout",
  firebaseAuthMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user?.uid;

      if (!uid) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      await logoutUser(uid);

      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Failed to logout" });
    }
  }
);

export default router;
