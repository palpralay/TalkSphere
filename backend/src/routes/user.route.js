import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getRecommendedUsers,
  getMyFriends,
  getFriendRequests,
  getOutgoingRequests,
  sendFriendRequest,
  acceptFriendRequest
} from "../controller/user.controller.js"; // keep all in one controller for simplicity

const router = express.Router();

router.use(protectRoute); // Apply protectRoute middleware to all user routes

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingRequests);
router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);

export default router;
