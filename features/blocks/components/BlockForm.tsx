'use client';

import { useState } from 'react';
import { Block } from '@/features/blocks/types/Block';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import {
  XMarkIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

type BlockFormProps = {
  initialData?: Partial<Block>;
  onSubmit: (
    data: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<Block | null>;
  isNew?: boolean;
  availableCategories?: string[]; // Added for autocomplete suggestions
};

export default function BlockForm({
  initialData,
  onSubmit,
  isNew = false,
  availableCategories = [],
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

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

  // Handle category input change and filter suggestions
  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setCategoryInput(value);

    if (value.trim() === '') {
      setShowSuggestions(false);
      setSuggestions([]);
      return;
    }

    // Filter available categories that match the input
    const filtered = availableCategories.filter(
      (cat) =>
        cat.toLowerCase().includes(value.toLowerCase()) &&
        !categories.includes(cat),
    );

    setSuggestions(filtered);
    setShowSuggestions(true);
    setActiveSuggestionIndex(0);
  };

  // Handle keyboard navigation in suggestions
  const handleCategoryKeyDown = (e: React.KeyboardEvent) => {
    // If no suggestions or suggestions not shown, use the normal handler
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddCategory();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        selectSuggestion(suggestions[activeSuggestionIndex]);
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  // Handle selecting a suggestion
  const selectSuggestion = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
    setCategoryInput('');
    setShowSuggestions(false);
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

    // Parse duration - now optional
    let duration: number | undefined = undefined;
    if (estimatedDuration.trim() !== '') {
      duration = parseInt(estimatedDuration);
      if (isNaN(duration) || duration <= 0) {
        setError('If provided, estimated duration must be a positive number');
        return;
      }
    }

    // Parse price - now optional
    let price: number | undefined = undefined;
    if (unitPrice.trim() !== '') {
      price = parseFloat(unitPrice);
      if (isNaN(price) || price < 0) {
        setError('If provided, unit price must be a non-negative number');
        return;
      }
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

  // Toggle between edit and preview
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {error && (
        <div className='bg-katalyx-error/10 text-katalyx-error p-5 rounded-xl border border-katalyx-error/20 shadow-sm animate-pulse'>
          <p className='font-medium'>{error}</p>
        </div>
      )}

      {success && (
        <div className='bg-katalyx-success/10 text-katalyx-success p-5 rounded-xl border border-katalyx-success/20 shadow-sm animate-pulse'>
          <p className='font-medium'>{success}</p>
        </div>
      )}

      <div>
        <label
          htmlFor='title'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Title <span className='text-katalyx-error'>*</span>
        </label>
        <input
          type='text'
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary shadow-sm'
          placeholder='Enter block title'
          required
        />
      </div>

      <div>
        <div className='flex justify-between items-center mb-2'>
          <label
            htmlFor='content'
            className='block text-sm font-medium text-gray-700'
          >
            Content <span className='text-katalyx-error'>*</span>
          </label>
          <button
            type='button'
            onClick={togglePreview}
            className='text-sm flex items-center text-katalyx-secondary hover:text-katalyx-secondary-light px-3 py-1.5 rounded-lg hover:bg-katalyx-secondary/10 transition-colors'
          >
            {showPreview ? (
              <>
                <PencilIcon className='h-4 w-4 mr-1.5' />
                Edit
              </>
            ) : (
              <>
                <EyeIcon className='h-4 w-4 mr-1.5' />
                Preview
              </>
            )}
          </button>
        </div>

        {showPreview ? (
          <div className='w-full px-5 py-4 border border-gray-200 rounded-xl min-h-[200px] prose prose-sm max-w-none bg-katalyx-off-white shadow-sm overflow-y-auto'>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            id='content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary shadow-sm font-mono'
            placeholder='Enter block content (markdown supported)'
            required
          />
        )}
        <p className='mt-1.5 text-xs text-gray-500'>
          Markdown formatting is supported (headings, lists, bold, italic, etc.)
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label
            htmlFor='estimatedDuration'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Estimated Duration (days)
          </label>
          <div className='relative'>
            <input
              type='number'
              id='estimatedDuration'
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary shadow-sm'
              placeholder='e.g., 5'
              min='1'
            />
            <span className='absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 pointer-events-none'>
              days
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor='unitPrice'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Unit Price
          </label>
          <div className='relative'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none'>
              €
            </span>
            <input
              type='number'
              id='unitPrice'
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className='w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary shadow-sm'
              placeholder='e.g., 1000'
              min='0'
              step='0.01'
            />
          </div>
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Categories
        </label>
        <div className='flex'>
          <input
            type='text'
            value={categoryInput}
            onChange={handleCategoryInputChange}
            onKeyDown={handleCategoryKeyDown}
            className='flex-1 px-4 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary shadow-sm'
            placeholder='Add a category'
          />
          <button
            type='button'
            onClick={handleAddCategory}
            className='bg-gradient-primary text-white px-5 py-3 rounded-r-xl hover:shadow-button transition-all duration-300 flex items-center'
          >
            <PlusIcon className='h-5 w-5 mr-1' />
            Add
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <ul className='mt-2 bg-white border border-gray-200 rounded-xl shadow-sm max-h-40 overflow-y-auto'>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => selectSuggestion(suggestion)}
                className={`px-4 py-2 cursor-pointer ${
                  index === activeSuggestionIndex
                    ? 'bg-katalyx-primary/10 text-katalyx-primary'
                    : 'hover:bg-gray-100'
                }`}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        {categories.length > 0 && (
          <div className='mt-3 flex flex-wrap gap-2 p-3 bg-white border border-gray-100 rounded-xl shadow-sm'>
            {categories.map((category, index) => (
              <div
                key={index}
                className='bg-katalyx-tertiary/10 text-katalyx-tertiary px-3 py-1.5 rounded-full text-sm flex items-center'
              >
                <span className='mr-1.5'>{category}</span>
                <button
                  type='button'
                  onClick={() => handleRemoveCategory(category)}
                  className='text-katalyx-tertiary hover:text-katalyx-tertiary-light rounded-full hover:bg-katalyx-tertiary/20 p-0.5'
                >
                  <XMarkIcon className='h-4 w-4' />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='bg-white p-4 rounded-xl border border-gray-100 shadow-sm'>
        <label className='flex items-center'>
          <input
            type='checkbox'
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className='h-5 w-5 text-katalyx-primary focus:ring-katalyx-primary border-gray-300 rounded'
          />
          <span className='ml-3 text-sm text-gray-700'>
            Make this block public
          </span>
        </label>
      </div>

      <div className='flex justify-end space-x-4 pt-4'>
        <button
          type='button'
          onClick={() => router.push('/blocks')}
          className='px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={isSubmitting}
          className={`px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-button-hover transition-all duration-300 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : 'shadow-button'
          }`}
        >
          {isSubmitting ? 'Saving...' : isNew ? 'Create Block' : 'Update Block'}
        </button>
      </div>
    </form>
  );
}
