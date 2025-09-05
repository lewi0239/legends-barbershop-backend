import { Router } from "express";
import {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";

const router = Router();

router.get("/", getItems);
router.post("/", createItem);
router.put("/", updateItem);
router.delete("/", deleteItem);

export default router;
