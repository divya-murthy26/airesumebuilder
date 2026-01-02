import React from 'react';
import { Sparkles } from 'lucide-react';

const AIEnhanceButton = ({ onClick, loading = false, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full 
        bg-violet-50 text-violet-600 border border-violet-100
        hover:bg-violet-100 hover:border-violet-200 hover:shadow-sm
        active:scale-95 transition-all duration-200 ease-in-out
        disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100
        text-sm font-medium
      `}
    >
      <Sparkles className={`size-4 ${loading ? 'animate-pulse' : ''}`} />
      <span>{loading ? 'Enhancing...' : 'AI Enhance'}</span>
    </button>
  );
};

export default AIEnhanceButton;