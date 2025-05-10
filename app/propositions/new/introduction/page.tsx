'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ProposalIntroductionAssistant from '@/features/proposals/components/ProposalIntroductionAssistant';

export default function ProposalIntroductionPage() {
  const router = useRouter();

  // This function will be called when the introduction is generated and the user clicks "Use This Introduction"
  const handleIntroductionGenerated = (introduction: string, context: any) => {
    // Store the generated introduction in localStorage or sessionStorage
    // so we can retrieve it when creating the proposal
    sessionStorage.setItem('proposal_introduction', introduction);
    sessionStorage.setItem('proposal_context', JSON.stringify(context));

    // Navigate to the new proposal page
    router.push('/propositions/new');
  };

  // This function will be called if the user clicks "Skip"
  const handleSkip = () => {
    // Clear any existing introduction data
    sessionStorage.removeItem('proposal_introduction');
    sessionStorage.removeItem('proposal_context');

    // Navigate to the new proposal page
    router.push('/propositions/new');
  };

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
              Create Proposal Introduction
            </h1>
            <p className='text-gray-600 mt-2'>
              Start by generating an engaging opening paragraph for your
              proposal
            </p>
          </div>
        </div>
      </div>

      {/* Introduction Assistant */}
      <ProposalIntroductionAssistant
        onIntroductionGenerated={handleIntroductionGenerated}
        onSkip={handleSkip}
      />

      {/* Instructions */}
      <div className='bg-katalyx-off-white p-6 rounded-xl border border-gray-100 shadow-sm'>
        <h2 className='font-medium text-lg mb-3'>
          Why use AI for your proposal introduction?
        </h2>
        <ul className='space-y-2 text-gray-700'>
          <li className='flex items-start'>
            <span className='text-katalyx-primary mr-2'>•</span>
            <span>Craft a professional-sounding introduction in seconds</span>
          </li>
          <li className='flex items-start'>
            <span className='text-katalyx-primary mr-2'>•</span>
            <span>
              Extract key project details from existing briefs and RFPs
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-katalyx-primary mr-2'>•</span>
            <span>Set the right tone and focus for your entire proposal</span>
          </li>
          <li className='flex items-start'>
            <span className='text-katalyx-primary mr-2'>•</span>
            <span>
              Save time and ensure consistency across all your client
              communications
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
