'use client';

import { Block } from '@/features/blocks/types/Block';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import Dialog from '@/components/ui/Dialog';

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

  // Dialog actions
  const dialogActions = (
    <>
      <button
        onClick={() => setShowDeleteConfirm(false)}
        className='px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all'
        disabled={isDeleting}
      >
        Cancel
      </button>
      <button
        onClick={handleDelete}
        className={`px-5 py-2.5 bg-linear-to-r from-katalyx-error to-red-500 text-white rounded-xl hover:shadow-lg transition-all ${
          isDeleting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </>
  );

  return (
    <div className='group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-gray-100 relative'>
      {/* Decorative accent */}
      <div className='h-2 bg-gradient-primary w-full'></div>

      <div className='p-6'>
        <div className='flex justify-between items-start mb-3'>
          <h3 className='text-lg font-sora font-bold text-gray-800 truncate'>
            {block.title}
          </h3>
          <div
            className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
              block.isPublic
                ? 'bg-katalyx-success/15 text-katalyx-success'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {block.isPublic ? 'Public' : 'Private'}
          </div>
        </div>

        <p className='text-gray-600 text-sm mb-4 h-12 overflow-hidden'>
          {truncatedContent}
        </p>

        <div className='grid grid-cols-2 gap-3 mb-4'>
          <div className='bg-katalyx-secondary/5 p-3 rounded-xl'>
            <p className='text-xs text-katalyx-secondary mb-1'>Duration</p>
            <p className='font-medium'>{block.estimatedDuration} days</p>
          </div>
          <div className='bg-katalyx-primary/5 p-3 rounded-xl'>
            <p className='text-xs text-katalyx-primary mb-1'>Price</p>
            <p className='font-medium'>{formattedPrice}</p>
          </div>
        </div>

        {block.categories.length > 0 && (
          <div className='mb-4'>
            <div className='flex flex-wrap gap-1.5'>
              {block.categories.map((category, index) => (
                <span
                  key={index}
                  className='bg-katalyx-tertiary/10 text-katalyx-tertiary px-2 py-0.5 rounded-full text-xs'
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

        <div className='flex justify-between space-x-3'>
          <button
            onClick={() => onEdit(block.id)}
            className='flex-1 px-4 py-2.5 bg-katalyx-secondary/10 text-katalyx-secondary rounded-xl hover:bg-katalyx-secondary/20 transition-all flex items-center justify-center shadow-secondary-button'
          >
            <PencilIcon className='h-4 w-4 mr-2' />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className='flex-1 px-4 py-2.5 bg-katalyx-error/10 text-katalyx-error rounded-xl hover:bg-katalyx-error/20 transition-all flex items-center justify-center'
          >
            <TrashIcon className='h-4 w-4 mr-2' />
            Delete
          </button>
        </div>
      </div>

      {/* Using the reusable Dialog component */}
      <Dialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title='Delete Block'
        actions={dialogActions}
        size='sm'
      >
        <p className='text-gray-600'>
          Are you sure you want to delete{' '}
          <span className='font-medium text-katalyx-text'>{block.title}</span>?
          This action cannot be undone.
        </p>
      </Dialog>
    </div>
  );
}
