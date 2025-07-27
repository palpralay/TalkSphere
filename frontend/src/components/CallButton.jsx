import { VideoIcon } from "lucide-react";

const CallButton = ({ handleVideoCall, isCallActive = false }) => {
  return (
    <div className="p-3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0">
      <button 
        onClick={handleVideoCall} 
        className={`btn btn-sm text-white transition-colors ${
          isCallActive ? 'btn-error' : 'btn-success'
        }`}
        aria-label={isCallActive ? "End video call" : "Start video call"}
        disabled={!handleVideoCall}
      >
        <VideoIcon className="size-6" />
        <span className="sr-only">
          {isCallActive ? "End call" : "Start video call"}
        </span>
      </button>
    </div>
  );
};

export default CallButton;
