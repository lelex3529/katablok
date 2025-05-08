'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBlock, useBlocks } from '@/features/blocks/hooks/useBlocks';
import BlockForm from '@/features/blocks/components/BlockForm';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { extractUniqueCategories } from '@/lib/utils';

export default function EditBlockPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const { block, loading, error, updateBlock, refreshBlock } = useBlock(id);
  const { blocks } = useBlocks();
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      refreshBlock();
    }
  }, [id, refreshBlock]);

  useEffect(() => {
    if (blocks.length > 0) {
      setAvailableCategories(extractUniqueCategories(blocks));
    }
  }, [blocks]);

  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center'>
          <button
            onClick={() => router.push('/blocks')}
            className='mr-4 p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all'
            aria-label='Back to blocks'
          >
            <ArrowLeftIcon className='h-5 w-5 text-gray-700' />
          </button>
          <div>
            <h1 className='text-3xl font-sora font-bold bg-clip-text text-transparent bg-linear-to-r from-katalyx-primary to-katalyx-primary-light'>
              Edit Block
            </h1>
            <p className='text-gray-600 mt-2'>
              Update your content block details below.
            </p>
          </div>
        </div>

        {block && (
          <div className='hidden md:flex items-center px-4 py-2 bg-white rounded-xl shadow-sm text-sm text-gray-600 border border-gray-100'>
            <PencilIcon className='h-4 w-4 mr-1.5 text-katalyx-secondary' />
            Editing: {block.title}
          </div>
        )}
      </div>

      {loading && block! ? (
        <div className='bg-white p-16 rounded-2xl shadow-card border border-gray-100 flex justify-center items-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-katalyx-primary mx-auto mb-4'></div>
            <p className='text-gray-500'>Loading block data...</p>
          </div>
        </div>
      ) : error ? (
        <div className='bg-katalyx-error/10 text-katalyx-error p-8 rounded-xl border border-katalyx-error/20 shadow-sm'>
          <p className='font-medium text-xl mb-2'>Error</p>
          <p className='mb-6'>{error}</p>
          <button
            onClick={() => router.push('/blocks')}
            className='px-5 py-2.5 bg-white rounded-xl shadow-sm flex items-center text-katalyx-primary hover:shadow-md transition-all'
          >
            <ArrowLeftIcon className='h-4 w-4 mr-2' /> Back to Blocks
          </button>
        </div>
      ) : block! ? (
        <div className='bg-katalyx-warning/10 text-katalyx-warning p-8 rounded-xl border border-katalyx-warning/20 shadow-sm'>
          <p className='font-medium text-xl mb-2'>Block Not Found</p>
          <p className='mb-6'>
            The block you&apos;re looking for could not be found. It may have
            been deleted or you don&apos;t have access.
          </p>
          <button
            onClick={() => router.push('/blocks')}
            className='px-5 py-2.5 bg-white rounded-xl shadow-sm flex items-center text-katalyx-primary hover:shadow-md transition-all'
          >
            <ArrowLeftIcon className='h-4 w-4 mr-2' /> Back to Blocks
          </button>
        </div>
      ) : (
        <div className='bg-white p-8 rounded-2xl shadow-card border border-gray-100'>
          <BlockForm
            initialData={block || undefined}
            onSubmit={updateBlock}
            isNew={false}
            availableCategories={availableCategories}
          />
        </div>
      )}
    </div>
  );
}
