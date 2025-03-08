import express from "express";
import { loginGuest } from "../controller/user";
const router = express.Router();

router.post("/login-guest", loginGuest);

export default router;
