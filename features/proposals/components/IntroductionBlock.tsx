'use client';

import { useState } from 'react';
import { PencilIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';

interface IntroductionBlockProps {
  content: string;
  onUpdate: (newContent: string) => void;
  isEditable?: boolean;
}

export default function IntroductionBlock({
  content,
  onUpdate,
  isEditable = true,
}: IntroductionBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const router = useRouter();

  const handleEdit = () => {
    setEditContent(content);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(content);
  };

  const handleSave = () => {
    onUpdate(editContent);
    setIsEditing(false);
  };

  const handleGenerateNewIntro = () => {
    // Clear any existing introduction data in session storage
    sessionStorage.removeItem('proposal_introduction');
    sessionStorage.removeItem('proposal_context');

    // Navigate to the introduction generation page
    router.push('/propositions/new/introduction');
  };

  return (
    <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
      {/* Header */}
      <div className='bg-katalyx-secondary/10 px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
        <div className='flex items-center'>
          <SparklesIcon className='h-5 w-5 text-katalyx-secondary mr-2' />
          <h3 className='font-medium text-gray-900'>Introduction</h3>
        </div>
        {isEditable && (
          <div className='flex space-x-2'>
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className='p-1.5 text-gray-500 hover:text-katalyx-primary hover:bg-gray-100 rounded'
                  title='Edit introduction'
                >
                  <PencilIcon className='h-4 w-4' />
                </button>
                <button
                  onClick={handleGenerateNewIntro}
                  className='text-xs flex items-center px-2 py-1 bg-katalyx-secondary/20 text-katalyx-secondary rounded hover:bg-katalyx-secondary/30'
                  title='Generate new introduction with AI'
                >
                  <SparklesIcon className='h-3 w-3 mr-1' />
                  Generate New
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* Content */}
      <div className='p-6'>
        {isEditing ? (
          <div className='space-y-4'>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary min-h-[200px]'
              placeholder='Write your introduction here...'
            />
            <div className='flex justify-end space-x-3'>
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
          <div className='prose prose-gray max-w-none'>
            <ReactMarkdown>
              {content ||
                "No introduction yet. Click 'Generate New' to create one with AI."}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
