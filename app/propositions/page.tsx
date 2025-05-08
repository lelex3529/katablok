'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProposalList from '@/features/proposals/components/ProposalList';
import { getProposals } from '@/features/proposals/services/proposalService';
import { Proposal } from '@/features/proposals/types/Proposal';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function PropositionsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await getProposals();
      setProposals(data);
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError('Failed to load proposals. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleCreateNew = () => {
    router.push('/propositions/new');
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-sora font-bold bg-clip-text text-transparent bg-gradient-to-r from-katalyx-primary to-katalyx-primary-light'>
            Proposals
          </h1>
          <p className='text-gray-600 mt-2'>
            Create, manage, and track all your client proposals
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className='flex items-center px-5 py-2.5 bg-gradient-primary text-white rounded-xl hover:shadow-button-hover transition-shadow'
        >
          <PlusIcon className='h-5 w-5 mr-2' />
          New Proposal
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className='bg-katalyx-error/10 text-katalyx-error p-5 rounded-xl border border-katalyx-error/20 shadow-sm'>
          <p className='font-medium'>Error</p>
          <p>{error}</p>
          <button
            onClick={fetchProposals}
            className='mt-3 text-sm px-4 py-1.5 border border-katalyx-error rounded-lg hover:bg-katalyx-error/5'
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className='flex justify-center items-center py-16'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-katalyx-primary'></div>
        </div>
      )}

      {/* Empty state - only shown when not loading and no error */}
      {!isLoading && !error && proposals.length === 0 && (
        <div className='bg-white p-16 rounded-2xl border border-gray-100 shadow-card text-center'>
          <div className='mx-auto w-16 h-16 bg-katalyx-primary/10 rounded-full flex items-center justify-center mb-6'>
            <DocumentTextIcon className='h-8 w-8 text-katalyx-primary' />
          </div>

          <h2 className='text-2xl font-sora font-medium mb-3'>
            No proposals yet
          </h2>
          <p className='text-gray-600 max-w-md mx-auto mb-8'>
            Create your first proposal to start building structured documents
            for your clients.
          </p>

          <button
            onClick={handleCreateNew}
            className='px-8 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-button-hover transition-shadow'
          >
            Create Your First Proposal
          </button>
        </div>
      )}

      {/* Proposals list */}
      {!isLoading && !error && proposals.length > 0 && (
        <ProposalList proposals={proposals} onRefresh={fetchProposals} />
      )}
    </div>
  );
}
