import express from "express";
import { protectRoute } from "../controller/auth.controller";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getRecommendedUsers,
  getMyFriends,
} from "../controller/user.controller.js";


const router = express.Router();

router.use(protectRoute); // Apply protectRoute middleware to all user routes
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

export default router;
