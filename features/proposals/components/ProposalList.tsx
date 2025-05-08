'use client';

import { useState, useEffect } from 'react';
import { Proposal } from '../types/Proposal';
import ProposalCard from './ProposalCard';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { deleteProposal } from '../services/proposalService';

interface ProposalListProps {
  proposals: Proposal[];
  onRefresh?: () => Promise<void>;
}

type SortOption = 'date-desc' | 'date-asc' | 'price-desc' | 'price-asc';

export default function ProposalList({
  proposals: initialProposals,
  onRefresh,
}: ProposalListProps) {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setProposals(initialProposals);
  }, [initialProposals]);

  // Filter and sort proposals
  const filteredProposals = proposals
    .filter((proposal) => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          proposal.title.toLowerCase().includes(query) ||
          proposal.clientName.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((proposal) => {
      // Filter by status
      if (statusFilter) {
        return proposal.status === statusFilter;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort based on selected option
      switch (sortOption) {
        case 'date-desc':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'date-asc':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case 'price-desc':
          return calculateTotalPrice(b) - calculateTotalPrice(a);
        case 'price-asc':
          return calculateTotalPrice(a) - calculateTotalPrice(b);
        default:
          return 0;
      }
    });

  // Calculate total price for a proposal (for sorting)
  const calculateTotalPrice = (proposal: Proposal): number => {
    return proposal.sections.reduce((total, section) => {
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
  };

  // Handle refreshing the proposals list
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  // Handle deleting a proposal
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await deleteProposal(id);
      // Update local state
      setProposals(proposals.filter((proposal) => proposal.id !== id));
      // Refresh list from server
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
      // Could add toast notification here
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle duplicating a proposal
  const handleDuplicate = (id: string) => {
    // This would be implemented with an API call to duplicate
    console.log('Duplicate proposal:', id);
  };

  return (
    <div className='space-y-6'>
      {/* Filters and search */}
      <div className='flex flex-col sm:flex-row justify-between gap-4'>
        <div className='relative sm:max-w-md w-full'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search proposals...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary'
          />
        </div>

        <div className='flex space-x-3'>
          <div className='relative'>
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className='pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary bg-white'
            >
              <option value=''>All statuses</option>
              <option value='draft'>Draft</option>
              <option value='sent'>Sent</option>
              <option value='approved'>Approved</option>
            </select>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FunnelIcon className='h-5 w-5 text-gray-400' />
            </div>
            <div className='absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none'>
              <svg
                className='h-5 w-5 text-gray-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          </div>

          <div className='relative'>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className='pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary bg-white'
            >
              <option value='date-desc'>Newest first</option>
              <option value='date-asc'>Oldest first</option>
              <option value='price-desc'>Highest price</option>
              <option value='price-asc'>Lowest price</option>
            </select>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <svg
                className='h-5 w-5 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12'
                />
              </svg>
            </div>
            <div className='absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none'>
              <svg
                className='h-5 w-5 text-gray-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title='Refresh proposals'
          >
            <ArrowPathIcon
              className={`h-5 w-5 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Proposal cards */}
      {filteredProposals.length > 0 ? (
        <div className='grid grid-cols-1 gap-6'>
          {filteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      ) : (
        <div className='text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No proposals found
          </h3>
          <p className='text-gray-600 mb-6'>
            {searchQuery || statusFilter
              ? 'Try changing your search criteria or filters'
              : 'Create your first proposal to get started'}
          </p>
        </div>
      )}
    </div>
  );
}
