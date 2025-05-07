'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBlock } from '@/features/blocks/hooks/useBlocks';
import BlockForm from '@/features/blocks/components/BlockForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EditBlockPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const { block, loading, error, updateBlock, refreshBlock } = useBlock(id);

  useEffect(() => {
    if (id) {
      refreshBlock();
    }
  }, [id, refreshBlock]);

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
          Edit Block
        </h1>
      </div>

      <p className='text-gray-600'>Update your content block details below.</p>

      {loading && !block ? (
        <div className='flex justify-center items-center h-64 bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-katalyx-primary mx-auto mb-4'></div>
            <p className='text-gray-500'>Loading block data...</p>
          </div>
        </div>
      ) : error ? (
        <div className='bg-red-50 text-red-600 p-6 rounded-lg shadow-sm border border-red-200'>
          <p className='font-medium mb-2'>Error</p>
          <p>{error}</p>
          <button
            onClick={() => router.push('/blocks')}
            className='mt-4 text-sm text-blue-600 hover:underline flex items-center'
          >
            <ArrowLeftIcon className='h-4 w-4 mr-1' /> Back to Blocks
          </button>
        </div>
      ) : !block ? (
        <div className='bg-amber-50 text-amber-800 p-6 rounded-lg shadow-sm border border-amber-200'>
          <p className='font-medium mb-2'>Block Not Found</p>
          <p>
            The block you're looking for could not be found. It may have been
            deleted or you don't have access.
          </p>
          <button
            onClick={() => router.push('/blocks')}
            className='mt-4 text-sm text-blue-600 hover:underline flex items-center'
          >
            <ArrowLeftIcon className='h-4 w-4 mr-1' /> Back to Blocks
          </button>
        </div>
      ) : (
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <BlockForm initialData={block} onSubmit={updateBlock} isNew={false} />
        </div>
      )}
    </div>
  );
}
