'use client';

import { useBlock } from '@/features/blocks/hooks/useBlocks';
import BlockForm from '@/features/blocks/components/BlockForm';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewBlockPage() {
  const router = useRouter();
  const { createBlock, error, loading } = useBlock();

  return (
    <div className='space-y-6'>
      <div className='flex items-center mb-6'>
        <button
          onClick={() => router.push('/blocks')}
          className='mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors'
          aria-label='Back to blocks'
        >
          <ArrowLeftIcon className='h-5 w-5 text-gray-700' />
        </button>
        <h1 className='text-3xl font-sora font-bold text-gray-800'>
          Create New Block
        </h1>
      </div>

      <p className='text-gray-600'>
        Create a new reusable content block for your commercial proposals.
      </p>

      {error && (
        <div className='bg-red-50 text-red-600 p-4 rounded-md border border-red-200'>
          <p className='font-medium'>Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
        <BlockForm onSubmit={createBlock} isNew={true} />
      </div>
    </div>
  );
}
