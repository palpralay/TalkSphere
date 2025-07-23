import express from "express";
import { protectRoute } from "../controller/auth.controller";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getRecommendedUsers,
  getMyFriends,
} from "../controller/user.controller.js";
import { sendFriendRequest } from "../controller/friend.controller.js";
import { acceptFriendRequest } from "../controller/friend.controller.js";




const router = express.Router();

router.use(protectRoute); // Apply protectRoute middleware to all user routes
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.post('/friend-request/:id', protectRoute, sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
router.get('/friend-requests', getFriendRequests);


export default router;



