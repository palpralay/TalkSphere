import { LoaderIcon } from 'lucide-react';

const ChatLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <LoaderIcon className="animate-spin size-8 text-primary" />
        <p className="text-base-content opacity-70">Loading chat...</p>
      </div>
    </div>
  );
};

export default ChatLoader;