'use client';

import { useState, useEffect } from 'react';
import { Block } from '@/features/blocks/types/Block';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

type BlockFormProps = {
  initialData?: Partial<Block>;
  onSubmit: (
    data: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<Block | null>;
  isNew?: boolean;
};

export default function BlockForm({
  initialData,
  onSubmit,
  isNew = false,
}: BlockFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [estimatedDuration, setEstimatedDuration] = useState(
    initialData?.estimatedDuration?.toString() || '',
  );
  const [unitPrice, setUnitPrice] = useState(
    initialData?.unitPrice?.toString() || '',
  );
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? true);
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState<string[]>(
    initialData?.categories || [],
  );

  // Add a new category
  const handleAddCategory = () => {
    if (categoryInput.trim() === '') return;

    if (!categories.includes(categoryInput.trim())) {
      setCategories([...categories, categoryInput.trim()]);
    }

    setCategoryInput('');
  };

  // Remove a category
  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validate form
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    const duration = parseInt(estimatedDuration);
    if (isNaN(duration) || duration <= 0) {
      setError('Estimated duration must be a positive number');
      return;
    }

    const price = parseFloat(unitPrice);
    if (isNaN(price) || price < 0) {
      setError('Unit price must be a non-negative number');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const blockData = {
        title: title.trim(),
        content: content.trim(),
        estimatedDuration: duration,
        unitPrice: price,
        isPublic,
        categories,
      };

      const result = await onSubmit(blockData);

      if (result) {
        setSuccess(
          isNew ? 'Block created successfully!' : 'Block updated successfully!',
        );

        // In case of a new block, reset the form after 1 second
        if (isNew) {
          setTimeout(() => {
            setTitle('');
            setContent('');
            setEstimatedDuration('');
            setUnitPrice('');
            setIsPublic(true);
            setCategories([]);
            setSuccess(null);
          }, 1000);
        } else {
          // For edit, navigate back to the blocks list after 1 second
          setTimeout(() => {
            router.push('/blocks');
          }, 1000);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while saving the block',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle key press in the category input
  const handleCategoryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCategory();
    }
  };

  // Toggle between edit and preview
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {error && (
        <div className='bg-red-50 text-red-600 p-4 rounded-md mb-4'>
          {error}
        </div>
      )}

      {success && (
        <div className='bg-green-50 text-green-600 p-4 rounded-md mb-4'>
          {success}
        </div>
      )}

      <div>
        <label
          htmlFor='title'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Title <span className='text-red-500'>*</span>
        </label>
        <input
          type='text'
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
          placeholder='Enter block title'
          required
        />
      </div>

      <div>
        <div className='flex justify-between items-center mb-1'>
          <label
            htmlFor='content'
            className='block text-sm font-medium text-gray-700'
          >
            Content <span className='text-red-500'>*</span>
          </label>
          <button
            type='button'
            onClick={togglePreview}
            className='text-sm text-primary hover:text-primary-dark'
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>

        {showPreview ? (
          <div className='w-full px-3 py-2 border border-gray-300 rounded-md min-h-[200px] prose prose-sm max-w-none'>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            id='content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='Enter block content (markdown supported)'
            required
          />
        )}
        <p className='mt-1 text-xs text-gray-500'>
          Markdown formatting is supported (headings, lists, bold, italic, etc.)
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label
            htmlFor='estimatedDuration'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Estimated Duration (days) <span className='text-red-500'>*</span>
          </label>
          <input
            type='number'
            id='estimatedDuration'
            value={estimatedDuration}
            onChange={(e) => setEstimatedDuration(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='e.g., 5'
            min='1'
            required
          />
        </div>

        <div>
          <label
            htmlFor='unitPrice'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Unit Price (€) <span className='text-red-500'>*</span>
          </label>
          <input
            type='number'
            id='unitPrice'
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='e.g., 1000'
            min='0'
            step='0.01'
            required
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Categories
        </label>
        <div className='flex'>
          <input
            type='text'
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            onKeyPress={handleCategoryKeyPress}
            className='flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='Add a category'
          />
          <button
            type='button'
            onClick={handleAddCategory}
            className='bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark'
          >
            Add
          </button>
        </div>

        {categories.length > 0 && (
          <div className='mt-2 flex flex-wrap gap-2'>
            {categories.map((category, index) => (
              <div
                key={index}
                className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center'
              >
                <span className='mr-1'>{category}</span>
                <button
                  type='button'
                  onClick={() => handleRemoveCategory(category)}
                  className='text-gray-500 hover:text-gray-700'
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className='flex items-center'>
          <input
            type='checkbox'
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className='h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded'
          />
          <span className='ml-2 text-sm text-gray-700'>
            Make this block public
          </span>
        </label>
      </div>

      <div className='flex justify-end space-x-3'>
        <button
          type='button'
          onClick={() => router.push('/blocks')}
          className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={isSubmitting}
          className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Saving...' : isNew ? 'Create Block' : 'Update Block'}
        </button>
      </div>
    </form>
  );
}
