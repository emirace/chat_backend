import express from "express";
const router = express.Router();
import message from "./message";
import user from "./user";
import image from "./image";

router.use("/messages", message);
router.use("/users", user);
router.use("/images", image);

export default router;
