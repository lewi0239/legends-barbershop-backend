console.log("✅ auth.routes loaded");
import { Router } from "express";
import { startGoogle, googleCallback } from "../controllers/auth.controller";

const router = Router();

router.get("/_debug", (_req, res) => {
  res.json({
    ok: true,
    message: "Auth routes are working",
    path: "/api/auth/_debug",
  });
});
router.get("/google", (_req, res) => {
  res.type("text/plain").send("HIT /api/auth/google");
});
router.get("/google", startGoogle);
router.get("/google/callback", googleCallback);
export default router;
// at top/bottom of the file
router.get("/_debug", (_req, res) =>
  res.json({ ok: true, where: "/api/auth/_debug" })
);
