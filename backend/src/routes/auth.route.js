import express from "express";
import { signup, login, logout } from "../controller/auth.controller.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post('/onboarding', protectRoute, onboard);
router.get('/me', protectRoute, async (req, res) => {
    res.status(200).json({success: true, user: req.user});
});


export default router;
