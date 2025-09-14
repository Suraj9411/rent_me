import express from "express";
import { login, logout, register, verifyToken } from "../controllers/auth.controller.js";
import { verifyToken as verifyTokenMiddleware } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verifyTokenMiddleware, verifyToken);

export default router;