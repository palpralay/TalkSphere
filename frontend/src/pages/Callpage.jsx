import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData, error: tokenError } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    retry: 3,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
        // Navigate back after error
        setTimeout(() => navigate(-1), 2000);
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    // Cleanup function
    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      if (client) {
        client.disconnectUser().catch(console.error);
      }
    };
  }, [tokenData, authUser, callId, navigate]);

  // Handle token error
  if (tokenError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>Failed to get call token. Please try again.</span>
        </div>
        <button 
          className="btn btn-primary mt-4" 
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isLoading || isConnecting) return <PageLoader message="Connecting to call..." />;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-base-300">
      <div className="relative w-full h-full">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="alert alert-warning max-w-md">
              <span>Could not initialize call. Please refresh or try again later.</span>
            </div>
            <button 
              className="btn btn-primary mt-4" 
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  if (callingState === CallingState.LEFT) return null;

  return (
    <StreamTheme>
      <div className="h-screen flex flex-col">
        <div className="flex-1">
          <SpeakerLayout />
        </div>
        <div className="p-4 bg-base-200">
          <CallControls />
        </div>
      </div>
    </StreamTheme>
  );
};

export default CallPage;