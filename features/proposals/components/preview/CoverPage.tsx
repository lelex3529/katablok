import React from 'react';
import Image from 'next/image';

interface CoverPageProps {
  title: string;
  clientName: string;
  proposalId: string;
  formattedDate: string;
}

export default function CoverPage({
  title,
  clientName,
  proposalId,
  formattedDate,
}: CoverPageProps) {
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
        <div className='flex flex-col items-center justify-center flex-grow'>
          <h1 className='text-4xl font-sora font-bold mb-4 text-center'>
            {title}
          </h1>
          <p className='text-xl text-gray-600 mb-8 text-center'>
            Commercial Proposal for {clientName}
          </p>
          <div className='w-20 h-1 bg-katalyx-primary my-8'></div>
          <div className='text-gray-600 text-center'>
            <p>Created on {formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
