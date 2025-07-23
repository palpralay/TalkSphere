import { generateStreamToken } from '../lib/stream.js';

export const getStreamToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const token = await generateStreamToken(userId);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating stream token:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
