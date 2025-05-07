'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Block } from '@/features/blocks/types/Block';
import BlockCard from './BlockCard';

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
    <div className='space-y-6'>
      {/* Search and filter controls */}
      <div className='flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm'>
        <div className='flex-1'>
          <label
            htmlFor='search'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Search
          </label>
          <input
            id='search'
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search by title or content...'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div className='md:w-1/4'>
          <label
            htmlFor='category'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Category
          </label>
          <select
            id='category'
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
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
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Sort by
          </label>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700'
            aria-label={
              sortOrder === 'desc' ? 'Sort oldest first' : 'Sort newest first'
            }
          >
            <span>Date</span>
            <span className='ml-1'>{sortOrder === 'desc' ? '↓' : '↑'}</span>
          </button>
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
        <div className='text-center py-12 bg-gray-50 rounded-lg border border-gray-200'>
          <p className='text-gray-500 mb-4'>
            {blocks.length > 0
              ? 'No blocks match your search criteria.'
              : "You haven't created any blocks yet."}
          </p>
          {blocks.length === 0 && (
            <button
              onClick={() => router.push('/blocks/new')}
              className='px-4 py-2 bg-katalyx-primary text-white rounded-md hover:bg-primary-dark transition-colors'
            >
              Create Your First Block
            </button>
          )}
        </div>
      )}

      {/* Show block count */}
      {blocks.length > 0 && (
        <div className='text-sm text-gray-500 text-right'>
          Showing {sortedBlocks.length} of {blocks.length} blocks
        </div>
      )}
    </div>
  );
}
