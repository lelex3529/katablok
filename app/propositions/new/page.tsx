'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ProposalBuilder from '@/features/proposals/components/ProposalBuilder';
import { createProposal } from '@/features/proposals/services/proposalService';
import { Proposal } from '@/features/proposals/types/Proposal';

export default function NewProposalPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [introText, setIntroText] = useState<string>('');
  const [contextData, setContextData] = useState<any>(null);

  // Load any AI-generated introduction from session storage
  useEffect(() => {
    // Get introduction text
    const storedIntro = sessionStorage.getItem('proposal_introduction');
    if (storedIntro) {
      setIntroText(storedIntro);
    }

    // Get structured context
    const storedContext = sessionStorage.getItem('proposal_context');
    if (storedContext) {
      try {
        const contextObj = JSON.parse(storedContext);
        setContextData(contextObj);
      } catch (e) {
        console.error('Failed to parse context data from session storage', e);
      }
    }

    // Optional: clear sessionStorage after retrieving
    // sessionStorage.removeItem('proposal_introduction');
    // sessionStorage.removeItem('proposal_context');
  }, []);

  // Handle proposal save
  const handleSaveProposal = async (
    proposalData: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    try {
      setError(null);
      setIsSubmitting(true);

      const savedProposal = await createProposal(proposalData);

      // Redirect to the proposal list after successful save
      setTimeout(() => {
        router.push('/propositions');
      }, 1000);

      return savedProposal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save proposal');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get initial title and client name from context if available
  const initialTitle = contextData?.projectName
    ? `${contextData.projectName} Proposal`
    : '';
  const initialClientName = contextData?.clientName || '';

  return (
    <div className='space-y-8 pb-20'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center'>
          <button
            onClick={() => router.push('/propositions')}
            className='mr-4 p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all'
            aria-label='Back to proposals'
          >
            <ArrowLeftIcon className='h-5 w-5 text-gray-700' />
          </button>
          <div>
            <h1 className='text-3xl font-sora font-bold bg-clip-text text-transparent bg-gradient-to-r from-katalyx-primary to-katalyx-primary-light'>
              Create New Proposal
            </h1>
            <p className='text-gray-600 mt-2'>
              Design a structured commercial proposal by adding and customizing
              content blocks
            </p>
          </div>
        </div>

        {/* AI Introduction Button */}
        <button
          onClick={() => router.push('/propositions/new/introduction')}
          className='flex items-center px-5 py-2.5 border-2 border-katalyx-secondary text-katalyx-secondary rounded-xl hover:bg-katalyx-secondary/5 transition-colors'
        >
          <SparklesIcon className='h-5 w-5 mr-2' />
          New AI Introduction
        </button>
      </div>

      {/* AI-generated intro badge */}
      {introText && (
        <div className='bg-katalyx-secondary/10 text-katalyx-secondary p-4 rounded-xl border border-katalyx-secondary/20 flex items-start space-x-3'>
          <SparklesIcon className='h-5 w-5 mt-0.5' />
          <div>
            <h3 className='font-medium'>AI-generated introduction added</h3>
            <p className='text-sm'>
              An introduction paragraph has been generated and added as the
              first section of your proposal.
            </p>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className='bg-katalyx-error/10 text-katalyx-error p-5 rounded-xl border border-katalyx-error/20 shadow-sm'>
          <p className='font-medium'>Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Proposal builder */}
      <div className='bg-white p-8 rounded-2xl shadow-card border border-gray-100'>
        <ProposalBuilder
          onSave={handleSaveProposal}
          isSubmitting={isSubmitting}
          introductionText={introText}
          initialClientName={initialClientName}
          initialTitle={initialTitle}
        />
      </div>

      {/* Instructions */}
      <div className='bg-katalyx-off-white p-6 rounded-xl border border-gray-100 shadow-sm'>
        <h2 className='font-medium text-lg mb-3'>
          Tips for creating effective proposals
        </h2>
        <ul className='space-y-2 text-gray-700'>
          <li className='flex items-start'>
            <span className='text-katalyx-primary mr-2'>•</span>
            <span>
              Structure your proposal with clear sections (Introduction, Scope,
              Timeline, etc.)
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-katalyx-primary mr-2'>•</span>
            <span>
              Reuse content blocks to save time and ensure consistency
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-katalyx-primary mr-2'>•</span>
            <span>
              Customize block content to match the client&apos;s specific
              requirements
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-katalyx-primary mr-2'>•</span>
            <span>
              Use keyboard shortcuts to speed up your workflow (Alt+N for new
              section, Ctrl/Cmd+S to save)
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
