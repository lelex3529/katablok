'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Block } from '@/features/blocks/types/Block';
import BlockCard from './BlockCard';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

type BlockListProps = {
  blocks: Block[];
  onDelete: (id: string) => Promise<void>;
  categories: string[];
};

export default function BlockList({
  blocks,
  onDelete,
  categories,
}: BlockListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Handle editing a block
  const handleEdit = (id: string) => {
    router.push(`/blocks/${id}`);
  };

  // Filter blocks based on search term and category
  const filteredBlocks = blocks.filter((block) => {
    const matchesSearch =
      searchTerm === '' ||
      block.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === '' || block.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Sort blocks by date
  const sortedBlocks = [...filteredBlocks].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();

    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className='space-y-8'>
      {/* Search and filter controls */}
      <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-card'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <label
              htmlFor='search'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Search
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
              </div>
              <input
                id='search'
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search by title or content...'
                className='w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary shadow-sm'
              />
            </div>
          </div>

          <div className='md:w-1/4'>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              <div className='flex items-center'>
                <AdjustmentsHorizontalIcon className='h-4 w-4 mr-1' />
                Category
              </div>
            </label>
            <select
              id='category'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-katalyx-primary shadow-sm appearance-none bg-white'
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1rem',
              }}
            >
              <option value=''>All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className='md:w-1/6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              <div className='flex items-center'>
                <ArrowsUpDownIcon className='h-4 w-4 mr-1' />
                Sort by
              </div>
            </label>
            <button
              onClick={() =>
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
              }
              className='w-full flex items-center justify-center px-4 py-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 text-gray-700 shadow-sm'
              aria-label={
                sortOrder === 'desc' ? 'Sort oldest first' : 'Sort newest first'
              }
            >
              <span>Date</span>
              <span className='ml-1.5'>{sortOrder === 'desc' ? '↓' : '↑'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Blocks grid */}
      {sortedBlocks.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {sortedBlocks.map((block) => (
            <BlockCard
              key={block.id}
              block={block}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className='text-center py-16 bg-white rounded-2xl shadow-card border border-gray-100'>
          <div className='bg-katalyx-off-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='h-10 w-10 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
              />
            </svg>
          </div>
          <p className='text-gray-600 mb-5 text-lg'>
            {blocks.length > 0
              ? 'No blocks match your search criteria.'
              : "You haven't created any blocks yet."}
          </p>
          {blocks.length === 0 && (
            <button
              onClick={() => router.push('/blocks/new')}
              className='px-6 py-3 bg-gradient-primary text-white rounded-xl shadow-button hover:shadow-button-hover transition-all duration-300'
            >
              Create Your First Block
            </button>
          )}
        </div>
      )}

      {/* Show block count */}
      {blocks.length > 0 && (
        <div className='bg-white px-4 py-2 rounded-lg text-sm text-gray-500 text-right shadow-sm border border-gray-100 inline-block ml-auto'>
          Showing {sortedBlocks.length} of {blocks.length} blocks
        </div>
      )}
    </div>
  );
}
