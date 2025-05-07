'use client';

import { Block } from '@/features/blocks/types/Block';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

type BlockCardProps = {
  block: Block;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
};

export default function BlockCard({ block, onEdit, onDelete }: BlockCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Truncate content for display
  const truncatedContent =
    block.content.length > 100
      ? block.content.substring(0, 100) + '...'
      : block.content;

  // Format price with Euro symbol
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(block.unitPrice);

  // Handle delete with confirmation
  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await onDelete(block.id);
      // No need to close dialog as the component will unmount
    } catch (error) {
      console.error('Failed to delete block:', error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-card overflow-hidden border border-gray-200 transition-all hover:shadow-lg'>
      <div className='p-5'>
        <div className='flex justify-between items-start mb-3'>
          <h3 className='text-lg font-sora font-bold text-gray-800 truncate'>
            {block.title}
          </h3>
          <div
            className={`px-2 py-1 text-xs rounded-full ${block.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
          >
            {block.isPublic ? 'Public' : 'Private'}
          </div>
        </div>

        <p className='text-gray-600 text-sm mb-4 h-12 overflow-hidden'>
          {truncatedContent}
        </p>

        <div className='grid grid-cols-2 gap-2 mb-4'>
          <div className='bg-gray-50 p-2 rounded'>
            <p className='text-xs text-gray-500'>Duration</p>
            <p className='font-medium'>{block.estimatedDuration} days</p>
          </div>
          <div className='bg-gray-50 p-2 rounded'>
            <p className='text-xs text-gray-500'>Price</p>
            <p className='font-medium'>{formattedPrice}</p>
          </div>
        </div>

        {block.categories.length > 0 && (
          <div className='mb-4'>
            <div className='flex flex-wrap gap-1'>
              {block.categories.map((category, index) => (
                <span
                  key={index}
                  className='bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs'
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className='flex items-center justify-between text-xs text-gray-500 mb-4'>
          <span>Created: {formatDate(block.createdAt)}</span>
          {block.updatedAt !== block.createdAt && (
            <span>Updated: {formatDate(block.updatedAt)}</span>
          )}
        </div>

        <div className='flex justify-between space-x-2'>
          <button
            onClick={() => onEdit(block.id)}
            className='flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors'
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className='flex-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors'
          >
            Delete
          </button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg p-6 max-w-sm mx-4'>
            <h3 className='text-lg font-bold mb-2'>Delete Block</h3>
            <p className='mb-4'>
              Are you sure you want to delete{' '}
              <span className='font-medium'>{block.title}</span>? This action
              cannot be undone.
            </p>
            <div className='flex justify-end space-x-2'>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
