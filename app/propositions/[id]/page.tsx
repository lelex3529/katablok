'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ProposalBuilder from '@/features/proposals/components/ProposalBuilder';
import {
  getProposal,
  updateProposal,
} from '@/features/proposals/services/proposalService';
import { Proposal } from '@/features/proposals/types/Proposal';

export default function EditProposalPage() {
  const router = useRouter();
  const params = useParams();
  const proposalId = params.id as string;

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch proposal data
  useEffect(() => {
    async function fetchProposal() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProposal(proposalId);
        setProposal(data);
      } catch (err) {
        console.error('Error fetching proposal:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load proposal',
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (proposalId) {
      fetchProposal();
    }
  }, [proposalId]);

  // Handle proposal update
  const handleUpdateProposal = async (
    proposalData: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    try {
      setError(null);
      setIsSubmitting(true);

      const updatedProposal = await updateProposal(proposalId, proposalData);
      setProposal(updatedProposal);

      // Briefly stay on page to show success state before redirecting
      setTimeout(() => {
        router.push('/propositions');
      }, 1000);

      return updatedProposal;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update proposal',
      );
      throw err;
    } finally {
      setIsSubmitting(false);
    }
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
              Edit Proposal
            </h1>
            <p className='text-gray-600 mt-2'>
              Update the proposal content, structure, and details
            </p>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className='flex justify-center items-center py-16'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-katalyx-primary'></div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className='bg-katalyx-error/10 text-katalyx-error p-5 rounded-xl border border-katalyx-error/20 shadow-sm'>
          <p className='font-medium'>Error</p>
          <p>{error}</p>
          <button
            onClick={() => router.push('/propositions')}
            className='mt-3 text-sm px-4 py-1.5 border border-katalyx-error rounded-lg hover:bg-katalyx-error/5'
          >
            Return to Proposals
          </button>
        </div>
      )}

      {/* Proposal builder */}
      {!isLoading && !error && proposal && (
        <div className='bg-white p-8 rounded-2xl shadow-card border border-gray-100'>
          <ProposalBuilder
            onSave={handleUpdateProposal}
            initialProposal={proposal}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Tips section */}
      {!isLoading && !error && proposal && (
        <div className='bg-katalyx-off-white p-6 rounded-xl border border-gray-100 shadow-sm'>
          <h2 className='font-medium text-lg mb-3'>Editing tips</h2>
          <ul className='space-y-2 text-gray-700'>
            <li className='flex items-start'>
              <span className='text-katalyx-primary mr-2'>•</span>
              <span>
                Drag and drop sections or blocks to reorder your proposal
                structure
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-katalyx-primary mr-2'>•</span>
              <span>
                Use the duplicate button to quickly create similar sections or
                blocks
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-katalyx-primary mr-2'>•</span>
              <span>
                Preview your changes before saving to see how the final proposal
                will look
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-katalyx-primary mr-2'>•</span>
              <span>
                Remember to save your changes when you&apos;re done editing
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
