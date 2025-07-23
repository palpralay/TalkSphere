import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getRecommendedUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest
} from "../controller/user.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/recommended", getRecommendedUsers);
router.post("/friend-request/:id", sendFriendRequest);
router.post("/friend-request/:id/accept", acceptFriendRequest);
router.post("/friend-request/:id/reject", rejectFriendRequest);

export default router;
