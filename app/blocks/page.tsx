'use client';

import { useEffect, useState } from 'react';
import BlockList from '@/features/blocks/components/BlockList';
import { useBlocks } from '@/features/blocks/hooks/useBlocks';
import { extractUniqueCategories } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function BlocksPage() {
  const router = useRouter();
  const { blocks, loading, error, deleteBlock } = useBlocks();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (blocks.length > 0) {
      setCategories(extractUniqueCategories(blocks));
    }
  }, [blocks]);

  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-sora font-bold bg-clip-text text-transparent bg-linear-to-r from-katalyx-primary to-katalyx-primary-light'>
            Content Blocks
          </h1>
          <p className='text-gray-600 mt-2'>
            Manage your reusable content blocks for commercial proposals.
          </p>
        </div>
        <button
          onClick={() => router.push('/blocks/new')}
          className='flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-xl shadow-button hover:shadow-button-hover transition-all duration-300'
        >
          <PlusIcon className='h-5 w-5' />
          <span>Add New Block</span>
        </button>
      </div>

      {error && (
        <div className='bg-katalyx-error/10 text-katalyx-error p-5 rounded-xl border border-katalyx-error/20 shadow-sm'>
          {error}
        </div>
      )}

      {loading && blocks.length === 0 ? (
        <div className='text-center py-16 bg-white rounded-2xl shadow-card border border-gray-100'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-katalyx-primary mx-auto mb-4'></div>
          <p className='text-gray-500'>Loading blocks...</p>
        </div>
      ) : (
        <BlockList
          blocks={blocks}
          onDelete={deleteBlock}
          categories={categories}
        />
      )}
    </div>
  );
}
