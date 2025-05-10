'use client';

import React, { ReactNode } from 'react';

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

export default function Dialog({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
}: DialogProps) {
  if (!isOpen) return null;

  // Prevent clicks inside the dialog from closing it
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
  };

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl p-8 mx-4 shadow-xl max-h-[80vh] bordrp border-gray-100 ${sizeClasses[size]}`}
        onClick={stopPropagation}
      >
        <h3 className='text-xl font-bold mb-4 text-katalyx-text'>{title}</h3>
        <div className='mb-6 max-h-[70vh] overflow-y-scroll'>{children}</div>
        {actions && <div className='flex justify-end space-x-3'>{actions}</div>}
      </div>
    </div>
  );
}
