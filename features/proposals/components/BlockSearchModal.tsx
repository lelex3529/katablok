'use client';

import { useState, useEffect } from 'react';
import { Block } from '@/features/blocks/types/Block';
import Dialog from '@/components/ui/Dialog';
import { useBlocks } from '@/features/blocks/hooks/useBlocks';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils';

interface BlockSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlock: (block: Block) => void;
}

export default function BlockSearchModal({
  isOpen,
  onClose,
  onSelectBlock,
}: BlockSearchModalProps) {
  const { blocks, loading } = useBlocks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  // Extract unique categories from blocks
  useEffect(() => {
    if (blocks.length > 0) {
      const allCategories = blocks.flatMap((block) => block.categories);
      const uniqueCategories = Array.from(new Set(allCategories));
      setCategories(uniqueCategories);
    }
  }, [blocks]);

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

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title='Add Content Block'
      size='lg'
    >
      <div className='space-y-6'>
        <div className='flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4'>
          {/* Search */}
          <div className='flex-1'>
            <div className='relative'>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search blocks...'
                className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary shadow-sm'
              />
              <MagnifyingGlassIcon className='absolute left-3 top-3.5 h-5 w-5 text-gray-400' />
            </div>
          </div>

          {/* Category filter */}
          <div className='w-full md:w-1/3'>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary shadow-sm appearance-none bg-white'
            >
              <option value=''>All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className='max-h-[400px] overflow-y-auto'>
          {loading ? (
            <div className='text-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-katalyx-primary mx-auto mb-4'></div>
              <p className='text-gray-500'>Loading blocks...</p>
            </div>
          ) : filteredBlocks.length === 0 ? (
            <div className='text-center py-8 bg-white rounded-xl border border-gray-100 shadow-sm'>
              <p className='text-gray-500'>
                No blocks found matching your criteria.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {filteredBlocks.map((block) => (
                <div
                  key={block.id}
                  onClick={() => onSelectBlock(block)}
                  className='p-4 border border-gray-200 rounded-xl hover:border-katalyx-primary hover:shadow-md cursor-pointer transition-all bg-white'
                >
                  <div className='flex justify-between items-start'>
                    <h3 className='font-medium text-gray-800 truncate'>
                      {block.title}
                    </h3>
                    <div
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        block.isPublic
                          ? 'bg-katalyx-success/15 text-katalyx-success'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {block.isPublic ? 'Public' : 'Private'}
                    </div>
                  </div>

                  <p className='text-sm text-gray-600 mt-1 line-clamp-2'>
                    {block.content}
                  </p>

                  <div className='flex justify-between mt-3 text-xs text-gray-500'>
                    <span>Duration: {block.estimatedDuration} days</span>
                    <span>Price: €{block.unitPrice?.toLocaleString()}</span>
                  </div>

                  {block.categories.length > 0 && (
                    <div className='mt-2'>
                      <div className='flex flex-wrap gap-1'>
                        {block.categories.slice(0, 3).map((category, index) => (
                          <span
                            key={index}
                            className='bg-katalyx-tertiary/10 text-katalyx-tertiary px-1.5 py-0.5 rounded-full text-xs'
                          >
                            {category}
                          </span>
                        ))}
                        {block.categories.length > 3 && (
                          <span className='bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full text-xs'>
                            +{block.categories.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className='text-xs text-gray-400 mt-2'>
                    Last updated: {formatDate(block.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
