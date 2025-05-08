'use client';

import { useState, useEffect } from 'react';
import { ProposalBlock } from '../types/Proposal';
import ReactMarkdown from 'react-markdown';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';

interface ProposalBlockEditorProps {
  block: ProposalBlock;
  onUpdateBlock: (updates: Partial<Omit<ProposalBlock, 'id'>>) => void;
  onDeleteBlock: () => void;
  onDuplicateBlock: () => void;
}

export default function ProposalBlockEditor({
  block,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
}: ProposalBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Use either the override value or the original block value
  const blockTitle =
    block.overrides.title || block.overrideTitle || block.block?.title || '';
  const blockContent =
    block.overrides.content ||
    block.overrideContent ||
    block.block?.content ||
    '';
  const blockUnitPrice =
    block.overrides.unitPrice !== undefined
      ? block.overrides.unitPrice
      : block.overrideUnitPrice !== undefined
        ? block.overrideUnitPrice
        : block.block?.unitPrice || 0;
  const blockDuration =
    block.overrides.estimatedDuration !== undefined
      ? block.overrides.estimatedDuration
      : block.overrideDuration !== undefined
        ? block.overrideDuration
        : block.block?.estimatedDuration || 0;

  const [title, setTitle] = useState(blockTitle);
  const [content, setContent] = useState(blockContent);
  const [unitPrice, setUnitPrice] = useState(String(blockUnitPrice));
  const [estimatedDuration, setEstimatedDuration] = useState(
    String(blockDuration),
  );

  // Update local state when block changes
  useEffect(() => {
    setTitle(blockTitle);
    setContent(blockContent);
    setUnitPrice(String(blockUnitPrice));
    setEstimatedDuration(String(blockDuration));
  }, [blockTitle, blockContent, blockUnitPrice, blockDuration]);

  // Save changes when exiting edit mode
  const handleSave = () => {
    const updates: Partial<Omit<ProposalBlock, 'id'>> = {
      overrides: {
        title: title || undefined,
        content: content || undefined,
        unitPrice: unitPrice ? parseFloat(unitPrice) : undefined,
        estimatedDuration: estimatedDuration
          ? parseInt(estimatedDuration)
          : undefined,
      },
    };

    onUpdateBlock(updates);
    setIsEditing(false);
  };

  // Cancel editing and revert to original values
  const handleCancel = () => {
    setTitle(blockTitle);
    setContent(blockContent);
    setUnitPrice(String(blockUnitPrice));
    setEstimatedDuration(String(blockDuration));
    setIsEditing(false);
  };

  // Toggle between edit and preview mode
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className='border border-gray-200 rounded-xl overflow-hidden bg-white'>
      {/* Block header */}
      <div className='bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center'>
        <h4 className='font-medium text-gray-800'>{blockTitle}</h4>
        <div className='flex space-x-1'>
          <button
            onClick={() => setIsEditing(true)}
            className='p-1.5 rounded-lg text-gray-500 hover:text-katalyx-primary hover:bg-gray-100'
            title='Edit block'
          >
            <PencilIcon className='h-4 w-4' />
          </button>
          <button
            onClick={onDuplicateBlock}
            className='p-1.5 rounded-lg text-gray-500 hover:text-katalyx-primary hover:bg-gray-100'
            title='Duplicate block'
          >
            <DocumentDuplicateIcon className='h-4 w-4' />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='p-1.5 rounded-lg text-gray-500 hover:text-katalyx-primary hover:bg-gray-100'
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <ArrowsPointingOutIcon className='h-4 w-4' />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className='p-1.5 rounded-lg text-gray-500 hover:text-katalyx-error hover:bg-gray-100'
            title='Delete block'
          >
            <TrashIcon className='h-4 w-4' />
          </button>
        </div>
      </div>

      {/* Edit mode */}
      {isEditing ? (
        <div className='p-4 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Title
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-katalyx-primary focus:border-katalyx-primary'
              placeholder='Block title'
            />
          </div>

          <div>
            <div className='flex justify-between items-center mb-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Content
              </label>
              <button
                type='button'
                onClick={togglePreview}
                className='text-sm flex items-center text-katalyx-secondary hover:text-katalyx-secondary-light px-2 py-1 rounded-lg hover:bg-katalyx-secondary/10 transition-colors'
              >
                {showPreview ? (
                  <>
                    <PencilIcon className='h-4 w-4 mr-1' />
                    Edit
                  </>
                ) : (
                  <>
                    <EyeIcon className='h-4 w-4 mr-1' />
                    Preview
                  </>
                )}
              </button>
            </div>

            {showPreview ? (
              <div className='px-4 py-3 border border-gray-300 rounded-lg bg-white min-h-[100px] prose prose-sm max-w-none'>
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-katalyx-primary focus:border-katalyx-primary font-mono'
                placeholder='Block content (markdown supported)'
              />
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Estimated Duration (days)
              </label>
              <div className='relative'>
                <input
                  type='number'
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-katalyx-primary focus:border-katalyx-primary'
                  placeholder='e.g., 5'
                  min='1'
                  step='0.5'
                />
                <span className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 pointer-events-none'>
                  days
                </span>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Unit Price
              </label>
              <div className='relative'>
                <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none'>
                  €
                </span>
                <input
                  type='number'
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className='w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-katalyx-primary focus:border-katalyx-primary'
                  placeholder='e.g., 1000'
                  min='0'
                  step='0.01'
                />
              </div>
            </div>
          </div>

          <div className='flex justify-end space-x-3 pt-3'>
            <button
              onClick={handleCancel}
              className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className='px-4 py-2 bg-katalyx-primary text-white rounded-lg hover:bg-katalyx-primary-dark'
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        // View mode
        <div
          className={`p-4 ${isExpanded ? '' : 'max-h-[300px] overflow-hidden'}`}
        >
          {/* Display content */}
          <div className='prose prose-sm max-w-none mb-4'>
            <ReactMarkdown>{blockContent}</ReactMarkdown>
          </div>

          {/* Display pricing and duration */}
          <div className='flex justify-between mt-4 text-sm'>
            <div className='bg-katalyx-secondary/5 px-3 py-2 rounded-lg'>
              <span className='text-xs text-katalyx-secondary'>Duration:</span>
              <span className='ml-1 font-medium'>{blockDuration} days</span>
            </div>
            <div className='bg-katalyx-primary/5 px-3 py-2 rounded-lg'>
              <span className='text-xs text-katalyx-primary'>Price:</span>
              <span className='ml-1 font-medium'>
                €{blockUnitPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className='p-4 bg-katalyx-error/5 border-t border-katalyx-error/20'>
          <p className='text-katalyx-error text-sm mb-3'>
            Are you sure you want to delete this block?
          </p>
          <div className='flex justify-end space-x-3'>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className='px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDeleteBlock();
                setShowDeleteConfirm(false);
              }}
              className='px-3 py-1.5 text-sm bg-katalyx-error text-white rounded-lg hover:bg-katalyx-error-dark'
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
