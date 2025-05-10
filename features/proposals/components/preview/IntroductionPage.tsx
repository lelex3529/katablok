import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

interface IntroductionPageProps {
  introduction: string;
  proposalId: string;
}

export default function IntroductionPage({
  introduction,
  proposalId,
}: IntroductionPageProps) {
  if (!introduction?.trim()) return null;
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
          <div className='prose prose-gray max-w-none'>
            <ReactMarkdown>{introduction}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
