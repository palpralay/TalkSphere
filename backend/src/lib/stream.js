import { StreamChat } from "stream-chat";
import "dotenv/config";


const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error(
    "STREAM_API_KEY and STREAM_API_SECRET must be set in environment variables"
  );
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret); // ✅ Capital C!

export const upsertStreamUser = async (userData) => {
  try {
    const user = await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
    throw error;
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIDStr= userId.toString();
    return streamClient.createToken(userIDStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
    throw error;
  } 
  
};

export default streamClient;
