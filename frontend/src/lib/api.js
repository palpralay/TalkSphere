// Option 1: Change the import in api.js (RECOMMENDED)
// frontend/src/lib/api.js
import axiosInstance from "./axios";  // Default import instead of named import

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  
  // Store the token in localStorage if it exists in the response
  if (response.data.token) {
    localStorage.setItem('jwt', response.data.token);
  }
  
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  
  // Store the token in localStorage if it exists in the response
  if (response.data.token) {
    localStorage.setItem('jwt', response.data.token);
  }
  
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  
  // Clear the token from localStorage
  localStorage.removeItem('jwt');
  
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    console.log(res.data);
    return res.data;

    
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}