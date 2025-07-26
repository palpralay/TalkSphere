import React from 'react';
import { toast } from 'react-hot-toast';

const Chatpage = () => {
  return (
    <div>
      <button 
        className="btn btn-primary" 
        onClick={() => toast.success('Hello!')}
      >
        Show Toast
      </button>
    </div>
  );
};

export default Chatpage;
