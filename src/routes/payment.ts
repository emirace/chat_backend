import express from "express";
import { loginGuest } from "../controller/user";
import { authorize } from "../middleware/user";
const router = express.Router();

router.post("/", authorize(["Admin"]), loginGuest);

export default router;
