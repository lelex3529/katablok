import React from 'react';
import Image from 'next/image';
import { LinkIcon } from '@heroicons/react/24/outline';

export interface TocItem {
  id: string;
  title: string;
  level: number;
  number: string;
  onClick: () => void;
}

interface TableOfContentsProps {
  tocItems: TocItem[];
  proposalId: string;
}

export default function TableOfContents({
  tocItems,
  proposalId,
}: TableOfContentsProps) {
  return (
    <div className='relative' style={{ width: 794, height: 1123 }}>
      <div className='absolute inset-0 p-10 flex flex-col'>
        <div className='h-20 flex justify-between items-center'>
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
            <p>Reference: PROP-{proposalId.slice(-6).toUpperCase()}</p>
          </div>
        </div>
        <div className='flex-grow overflow-hidden'>
          <div className='mt-6 space-y-2'>
            <h2 className='text-2xl font-sora font-bold mb-6'>
              Table des matières
            </h2>
            {tocItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center cursor-pointer hover:text-katalyx-primary ${item.level === 1 ? 'font-medium' : 'pl-6 text-sm'}`}
                onClick={item.onClick}
              >
                <span className='mr-2'>{item.number}</span>
                <span className='flex-grow'>{item.title}</span>
                <span className='border-b border-dashed border-gray-300 flex-grow mx-2'></span>
                <LinkIcon className='h-3 w-3 mr-1' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
