import { LoaderIcon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore.js';

const PageLoader = ({ message = "Loading..." }) => {
  const { theme } = useThemeStore();
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      data-theme={theme}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <LoaderIcon 
          className="animate-spin size-10 text-primary" 
          aria-hidden="true"
        />
        <span className="text-base-content opacity-70">
          {message}
        </span>
        <span className="sr-only">Loading content, please wait...</span>
      </div>
    </div>
  );
};

export default PageLoader;