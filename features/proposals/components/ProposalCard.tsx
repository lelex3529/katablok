'use client';

import { Proposal } from '../types/Proposal';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DocumentTextIcon,
  ChevronRightIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface ProposalCardProps {
  proposal: Proposal;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export default function ProposalCard({
  proposal,
  onDelete,
  onDuplicate,
}: ProposalCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculate total price and duration
  const totalPrice = proposal.sections.reduce((total, section) => {
    return (
      total +
      section.blocks.reduce((sectionTotal, block) => {
        const price =
          block.overrideUnitPrice !== undefined
            ? block.overrideUnitPrice
            : block.overrides?.unitPrice !== undefined
              ? block.overrides.unitPrice
              : block.block?.unitPrice || 0;

        return sectionTotal + price;
      }, 0)
    );
  }, 0);

  const totalDuration = proposal.sections.reduce((total, section) => {
    return (
      total +
      section.blocks.reduce((sectionTotal, block) => {
        const duration =
          block.overrideDuration !== undefined
            ? block.overrideDuration
            : block.overrides?.estimatedDuration !== undefined
              ? block.overrides.estimatedDuration
              : block.block?.estimatedDuration || 0;

        return sectionTotal + duration;
      }, 0)
    );
  }, 0);

  const totalBlocks = proposal.sections.reduce(
    (total, section) => total + section.blocks.length,
    0,
  );

  const handleViewProposal = () => {
    router.push(`/propositions/${proposal.id}`);
  };

  const handleEditProposal = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/propositions/${proposal.id}/edit`);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (showDeleteConfirm) {
      if (onDelete) {
        setIsDeleting(true);
        try {
          await onDelete(proposal.id);
        } finally {
          setIsDeleting(false);
          setShowDeleteConfirm(false);
        }
      }
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDuplicate) {
      onDuplicate(proposal.id);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className='bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer'
      onClick={handleViewProposal}
    >
      <div className='p-6'>
        <div className='flex justify-between items-start'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-katalyx-primary/10 rounded-lg'>
              <DocumentTextIcon className='h-6 w-6 text-katalyx-primary' />
            </div>
            <div>
              <h3 className='text-lg font-medium text-gray-900 hover:text-katalyx-primary transition-colors'>
                {proposal.title}
              </h3>
              <p className='text-sm text-gray-600'>{proposal.clientName}</p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            {proposal.status === 'approved' && (
              <span className='flex items-center text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full'>
                <CheckCircleIcon className='h-3 w-3 mr-1' />
                Approved
              </span>
            )}

            {proposal.status === 'draft' && (
              <span className='text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-full'>
                Draft
              </span>
            )}

            {proposal.status === 'sent' && (
              <span className='text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full'>
                Sent
              </span>
            )}

            <ChevronRightIcon className='h-5 w-5 text-gray-400' />
          </div>
        </div>

        <div className='mt-6 grid grid-cols-3 gap-4 text-sm'>
          <div>
            <span className='text-gray-500 block'>Sections</span>
            <span className='font-medium text-gray-700'>
              {proposal.sections.length}
            </span>
          </div>

          <div>
            <span className='text-gray-500 block'>Blocks</span>
            <span className='font-medium text-gray-700'>{totalBlocks}</span>
          </div>

          <div>
            <span className='text-gray-500 block'>Duration</span>
            <span className='font-medium text-gray-700'>
              {totalDuration} days
            </span>
          </div>
        </div>

        <div className='mt-4 pt-4 border-t border-gray-100 flex justify-between items-center'>
          <div className='flex items-baseline'>
            <span className='text-2xl font-sora font-bold text-katalyx-primary'>
              €{totalPrice.toLocaleString()}
            </span>
            <span className='text-gray-500 text-sm ml-2'>Total</span>
          </div>

          <div className='text-xs text-gray-500'>
            Created {formatDate(proposal.createdAt)}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className='px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-end'>
        {showDeleteConfirm ? (
          <div className='flex items-center space-x-3 text-sm'>
            <span className='text-gray-700'>Delete this proposal?</span>
            <button
              onClick={handleCancelDelete}
              className='px-3 py-1 border border-gray-300 rounded hover:bg-gray-100'
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteClick}
              className='px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700'
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Confirm'}
            </button>
          </div>
        ) : (
          <div className='flex space-x-2'>
            <button
              onClick={handleDeleteClick}
              className='p-1.5 text-gray-500 hover:text-katalyx-error hover:bg-gray-100 rounded'
              title='Delete proposal'
            >
              <TrashIcon className='h-4 w-4' />
            </button>
            <button
              onClick={handleDuplicateClick}
              className='p-1.5 text-gray-500 hover:text-katalyx-primary hover:bg-gray-100 rounded'
              title='Duplicate proposal'
            >
              <DocumentDuplicateIcon className='h-4 w-4' />
            </button>
            <button
              onClick={handleEditProposal}
              className='p-1.5 text-gray-500 hover:text-katalyx-primary hover:bg-gray-100 rounded'
              title='Edit proposal'
            >
              <PencilIcon className='h-4 w-4' />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
