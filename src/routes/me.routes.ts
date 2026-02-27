console.log("✅ me.routes loaded");
import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { User } from "../models/user.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const { uid } = (req as any).auth as { uid: string };
  const user = await UserModel.findById(uid);
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({
    uid: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isMember: user.isMember,
    profilePic: user.profilePic,
  });
});

export default router;
