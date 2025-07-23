import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

// FIXED: Changed all req.user.id to req.user._id
export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserID = req.user._id;

    // Get friends & pending requests
    const currentUser = await User.findById(currentUserID).select("friends");
    const sentRequests = await FriendRequest.find({
      sender: currentUserID,
      status: "pending",
    }).select("receiver");
    const receivedRequests = await FriendRequest.find({
      receiver: currentUserID,
      status: "pending",
    }).select("sender");

    // Build exclusion list
    const excludedUsers = [
      ...currentUser.friends.map((id) => id.toString()),
      ...sentRequests.map((r) => r.receiver.toString()),
      ...receivedRequests.map((r) => r.sender.toString()),
    ];

    const recommendedUsers = await User.find({
      _id: { $ne: currentUserID, $nin: excludedUsers },
      isOnboarded: true,
    }).select("fullname profilePicture nativeLanguage learningLanguage");

    res.status(200).json({ success: true, recommendedUsers });
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullname profilePicture nativeLanguage learningLanguage"
      );

    res.status(200).json({ success: true, friends: user.friends });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const myID = req.user._id;
    const { id: receiver } = req.params;

    // FIXED: Added toString() for proper comparison
    if (myID.toString() === receiver) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You cannot send a friend request to yourself.",
        });
    }

    const recipient = await User.findById(receiver);
    if (!recipient) {
      return res
        .status(404)
        .json({ success: false, message: "Recipient not found." });
    }

    // Already friends?
    if (recipient.friends.includes(myID)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You are already friends with this user.",
        });
    }

    // Existing pending request?
    const existingRequest = await FriendRequest.findOne({
      sender: myID,
      receiver,
      status: "pending",
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ success: false, message: "Friend request already sent." });
    }

    // Create new request
    const friendRequest = new FriendRequest({ sender: myID, receiver });
    await friendRequest.save();

    res.status(200).json({ success: true, message: "Friend request sent." });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestID } = req.params;
    const friendRequest = await FriendRequest.findById(requestID);

    // FIXED: Added toString() for proper comparison
    if (!friendRequest || friendRequest.receiver.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ success: false, message: "Friend request not found." });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each other as friends
    await User.findByIdAndUpdate(friendRequest.sender, {
      $push: { friends: friendRequest.receiver },
    });
    await User.findByIdAndUpdate(friendRequest.receiver, {
      $push: { friends: friendRequest.sender },
    });

    res
      .status(200)
      .json({ success: true, message: "Friend request accepted." });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ADDED: Missing rejectFriendRequest function
export const rejectFriendRequest = async (req, res) => {
  try {
    const { id: requestID } = req.params;
    const friendRequest = await FriendRequest.findById(requestID);

    if (!friendRequest || friendRequest.receiver.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ success: false, message: "Friend request not found." });
    }

    friendRequest.status = "rejected";
    await friendRequest.save();

    res
      .status(200)
      .json({ success: true, message: "Friend request rejected." });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export async function getFriendRequests(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      receiver: req.user._id,
      status: "pending",
    }).populate(
      "sender",
      "fullname profilePicture nativeLanguage learningLanguage"
    );

    const acceptedRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate(
      "receiver",
      "fullname profilePicture nativeLanguage learningLanguage"
    );

    res.status(200).json({
      success: true,
      incomingRequests,
      acceptedRequests,
    });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getOutgoingRequests(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate(
      "receiver",
      "fullname profilePicture nativeLanguage learningLanguage"
    );

    res.status(200).json({
      success: true,
      outgoingRequests,
    });
  } catch (error) {
    console.error("Error fetching outgoing friend requests:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}