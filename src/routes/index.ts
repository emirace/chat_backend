import express from "express";
const router = express.Router();
import message from "./message";
import user from "./user";
import image from "./image";
import payment from "./payment"

router.use("/messages", message);
router.use("/users", user);
router.use("/images", image);
router.use("/payments",payment);

export default router;
