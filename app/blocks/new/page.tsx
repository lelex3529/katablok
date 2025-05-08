'use client';

import { useBlock } from '@/features/blocks/hooks/useBlocks';
import BlockForm from '@/features/blocks/components/BlockForm';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function NewBlockPage() {
  const router = useRouter();
  const { createBlock, error } = useBlock();

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
            <h1 className='text-3xl font-sora font-bold bg-clip-text text-transparent bg-gradient-to-r from-katalyx-primary to-katalyx-primary-light'>
              Create New Block
            </h1>
            <p className='text-gray-600 mt-2'>
              Create a new reusable content block for your commercial proposals.
            </p>
          </div>
        </div>

        <div className='hidden md:flex items-center px-4 py-2 bg-white rounded-xl shadow-sm text-sm text-gray-600 border border-gray-100'>
          <PlusIcon className='h-4 w-4 mr-1.5 text-katalyx-primary' />
          Adding new content block
        </div>
      </div>

      {error && (
        <div className='bg-katalyx-error/10 text-katalyx-error p-5 rounded-xl border border-katalyx-error/20 shadow-sm'>
          <p className='font-medium'>Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className='bg-white p-8 rounded-2xl shadow-card border border-gray-100'>
        <BlockForm onSubmit={createBlock} isNew={true} />
      </div>
    </div>
  );
}
