import React, { ReactNode, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ContentContainerProps {
  children: ReactNode;
  proposalId?: string;
  showHeader?: boolean;
  id?: string;
  onContentOverflow?: (isOverflowing: boolean, height: number) => void;
  maxHeight?: number;
}

/**
 * ContentContainer component that represents content that can flow between pages
 * This component handles the common header with logo and reference number
 * and monitors content overflow to trigger page breaks when needed
 */
export default function ContentContainer({
  children,
  proposalId,
  showHeader = true,
  id,
  onContentOverflow,
  maxHeight = 980, // Default height that fits on A4 with margins and footer
}: ContentContainerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Monitor content height to detect overflow
  useEffect(() => {
    if (contentRef.current && onContentOverflow) {
      const checkOverflow = () => {
        const contentHeight = contentRef.current?.scrollHeight || 0;
        const isOverflowing = contentHeight > maxHeight;
        onContentOverflow(isOverflowing, contentHeight);
      };

      // Check initially
      checkOverflow();

      // Set up mutation observer to detect content changes
      const observer = new MutationObserver(checkOverflow);
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      // Clean up
      return () => observer.disconnect();
    }
  }, [maxHeight, onContentOverflow]);

  return (
    <div className='content-container px-10 py-6' id={id}>
      {showHeader && (
        <div className='h-20 flex justify-between items-center mb-6'>
          <div className='flex items-center'>
            <Image
              src='/katalyx-logo.png'
              alt='Katalyx Logo'
              width={120}
              height={40}
              className='object-contain'
              priority
            />
          </div>
          <div className='text-sm text-gray-500'>
            <p>
              Reference:{' '}
              {proposalId
                ? `PROP-${proposalId.slice(-6).toUpperCase()}`
                : 'Contact'}
            </p>
          </div>
        </div>
      )}
      <div className='content-body' ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
