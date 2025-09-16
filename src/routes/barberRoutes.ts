import { Router } from "express";
import {
  createBarber,
  getAllBarbers,
  updateBarber,
  deleteBarber,
} from "../controllers/barberController.js";

const router = Router();

router.get("/", getAllBarbers);
router.post("/", createBarber);
router.put("/:id", updateBarber);
router.delete("/:id", deleteBarber);

export default router;
