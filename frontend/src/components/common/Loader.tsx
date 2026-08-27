import React from 'react';

interface LoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({ text = 'Cargando información...', size = 'md' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div
        className={`${sizes[size]} rounded-full border-blue-600 border-t-transparent animate-spin`}
      />
      {text && <p className="text-xs text-slate-500 font-medium">{text}</p>}
    </div>
  );
};
