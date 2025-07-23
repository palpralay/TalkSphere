import User from "../models/User.js";


export const getRecommendedUsers = async (req, res) => {

    try {
        const currentUserID = req.user.id; // Assuming req.user is set by protectRoute middleware
        const currentUser = req.user; // Get the current user from the request
        const recommendedUsers = await User.find({ $and: [{
            _id: { $ne: currentUserID }, 
            id: { $nin: currentUser.friends },
            isOnboarded: true 
        }]});
        res.status(200).json({ success: true, recommendedUsers });    
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const getMyFriends = async(req, res) => {
  

try {
   const user = await User.findById(req.user.id).select("friends").populate("friends", "fullname profilePicture nativeLanguage learningLanguage ");

} catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
}








};
