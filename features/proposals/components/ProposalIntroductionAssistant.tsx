'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';

interface ProposalIntroductionAssistantProps {
  onIntroductionGenerated: (introduction: string, context: any) => void;
  onSkip?: () => void;
}

interface GeneratedContent {
  introduction: string;
  structuredContext: {
    clientName: string;
    projectName: string;
    objectives: string[];
    tone: string;
  };
}

export default function ProposalIntroductionAssistant({
  onIntroductionGenerated,
  onSkip,
}: ProposalIntroductionAssistantProps) {
  const [userText, setUserText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  // Remove a file from the list
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Trigger file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!userText && files.length === 0) {
      setError(
        'Please enter some text or upload files to generate an introduction.',
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('text', userText);

      // Add all files to the request
      files.forEach((file) => {
        formData.append('files', file);
      });

      // Send request to API
      const response = await fetch('/api/proposals/introduction', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate introduction');
      }

      const data = await response.json();
      setGeneratedContent(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while generating the introduction',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Use generated content and proceed
  const handleUseIntroduction = () => {
    if (generatedContent) {
      onIntroductionGenerated(
        generatedContent.introduction,
        generatedContent.structuredContext,
      );
    }
  };

  // Get file type icon
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return (
          <div className='bg-red-100 p-1.5 rounded-md'>
            <DocumentTextIcon className='h-4 w-4 text-red-700' />
          </div>
        );
      case 'doc':
      case 'docx':
        return (
          <div className='bg-blue-100 p-1.5 rounded-md'>
            <DocumentTextIcon className='h-4 w-4 text-blue-700' />
          </div>
        );
      case 'txt':
        return (
          <div className='bg-gray-100 p-1.5 rounded-md'>
            <DocumentTextIcon className='h-4 w-4 text-gray-700' />
          </div>
        );
      default:
        return (
          <div className='bg-purple-100 p-1.5 rounded-md'>
            <DocumentTextIcon className='h-4 w-4 text-purple-700' />
          </div>
        );
    }
  };

  // Render generated content or form
  return (
    <div className='bg-white p-8 rounded-2xl shadow-card border border-gray-100'>
      <h2 className='text-xl font-medium mb-6'>
        Proposal Introduction Assistant
      </h2>

      {generatedContent ? (
        // Show generated content
        <div className='space-y-8'>
          <div>
            <h3 className='text-md font-medium mb-3'>Generated Introduction</h3>
            <div className='bg-gray-50 p-6 rounded-xl border border-gray-200'>
              <div className='prose prose-gray max-w-none'>
                <ReactMarkdown>{generatedContent.introduction}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-md font-medium mb-3'>Structured Context</h3>
            <div className='bg-gray-50 p-6 rounded-xl border border-gray-200'>
              <pre className='overflow-auto text-sm font-mono text-gray-700 p-4 bg-gray-100 rounded-lg'>
                {JSON.stringify(generatedContent.structuredContext, null, 2)}
              </pre>
            </div>
          </div>

          <div className='flex justify-end space-x-4 pt-4'>
            <button
              onClick={() => setGeneratedContent(null)}
              className='px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50'
            >
              Generate Again
            </button>
            <button
              onClick={handleUseIntroduction}
              className='px-6 py-2.5 bg-gradient-primary text-white rounded-xl hover:shadow-button-hover transition-shadow flex items-center'
            >
              <CheckIcon className='h-5 w-5 mr-2' />
              Use This Introduction
            </button>
          </div>
        </div>
      ) : (
        // Show form to input text and files
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='text'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Project Description
            </label>
            <textarea
              id='text'
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder='Describe your project, client needs, or provide a brief. The more context, the better the generated introduction will be.'
              rows={6}
              className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Upload Files (Optional)
            </label>

            <div
              className='border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-katalyx-primary hover:bg-katalyx-primary/5 transition-colors'
              onClick={handleFileInputClick}
            >
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className='hidden'
                accept='.pdf,.doc,.docx,.txt'
              />
              <ArrowUpTrayIcon className='h-8 w-8 mx-auto text-gray-400' />
              <p className='mt-2 text-sm text-gray-600'>
                Click to upload, or drag and drop
              </p>
              <p className='text-xs text-gray-500'>
                PDF, DOCX, TXT (Max 5MB each)
              </p>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className='mt-4 space-y-2'>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className='flex items-center bg-gray-50 p-2 rounded-lg text-sm'
                  >
                    {getFileIcon(file.name)}
                    <span className='ml-2 flex-1 truncate'>{file.name}</span>
                    <button
                      type='button'
                      onClick={() => handleRemoveFile(index)}
                      className='p-1 text-gray-400 hover:text-red-500'
                    >
                      <XMarkIcon className='h-5 w-5' />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className='bg-red-50 text-red-700 p-4 rounded-xl border border-red-200'>
              <p>{error}</p>
            </div>
          )}

          <div className='flex justify-end space-x-4 pt-4'>
            {onSkip && (
              <button
                type='button'
                onClick={onSkip}
                className='px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50'
              >
                Skip
              </button>
            )}
            <button
              type='submit'
              disabled={isLoading}
              className={`px-6 py-2.5 bg-gradient-primary text-white rounded-xl transition-shadow flex items-center ${
                isLoading
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:shadow-button-hover'
              }`}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className='h-5 w-5 mr-2 animate-spin' />
                  Generating...
                </>
              ) : (
                <>Generate Introduction</>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Instructions */}
      {!generatedContent && (
        <div className='mt-8 bg-gray-50 p-4 rounded-xl border border-gray-200'>
          <h3 className='text-sm font-medium mb-2'>How it works</h3>
          <ul className='text-xs text-gray-600 space-y-1'>
            <li className='flex items-start'>
              <span className='text-katalyx-primary mr-1.5'>•</span>
              <span>
                Enter a description of your project, client needs, or paste a
                brief
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-katalyx-primary mr-1.5'>•</span>
              <span>Optionally upload relevant files (RFPs, briefs, etc.)</span>
            </li>
            <li className='flex items-start'>
              <span className='text-katalyx-primary mr-1.5'>•</span>
              <span>
                AI will generate a professional introduction paragraph and
                extract key project context
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-katalyx-primary mr-1.5'>•</span>
              <span>
                The structured context can be reused in future AI-assisted
                blocks
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
