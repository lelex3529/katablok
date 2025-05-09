import { Proposal, ProposalBlock, ProposalSection } from '../types/Proposal';

// Database model types based on Prisma schema
interface DbProposal {
  id: string;
  title: string;
  clientName: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  sections: DbProposalSection[];
}

interface DbProposalSection {
  id: string;
  title: string;
  order: number;
  proposalId: string;
  createdAt: Date;
  updatedAt: Date;
  blocks: DbProposalBlock[];
}

interface DbProposalBlock {
  id: string;
  order: number;
  blockId: string;
  sectionId: string;
  overrideTitle?: string | null;
  overrideContent?: string | null;
  overrideUnitPrice?: number | null;
  overrideDuration?: number | null;
  createdAt: Date;
  updatedAt: Date;
  block?: {
    id: string;
    title: string;
    content: string;
    categories: string[];
    estimatedDuration?: number | null;
    unitPrice?: number | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Transform database proposal to frontend format
function mapDatabaseToFrontend(dbProposal: DbProposal): Proposal {
  return {
    ...dbProposal,
    sections: dbProposal.sections.map((section: DbProposalSection): ProposalSection => ({
      ...section,
      blocks: section.blocks.map((block: DbProposalBlock): ProposalBlock => {
        // Create a clean version of the block with nulls converted to undefined
        const cleanBlock: ProposalBlock = {
          id: block.id,
          blockId: block.blockId,
          order: block.order,
          sectionId: block.sectionId || undefined,
          overrideTitle: block.overrideTitle || undefined,
          overrideContent: block.overrideContent || undefined,
          overrideUnitPrice: block.overrideUnitPrice || undefined,
          overrideDuration: block.overrideDuration || undefined,
          createdAt: block.createdAt,
          updatedAt: block.updatedAt,
          overrides: {
            title: block.overrideTitle || undefined,
            content: block.overrideContent || undefined,
            unitPrice: block.overrideUnitPrice || undefined,
            estimatedDuration: block.overrideDuration || undefined
          },
          block: block.block ? {
            ...block.block,
            estimatedDuration: block.block.estimatedDuration || undefined,
            unitPrice: block.block.unitPrice || undefined
          } : undefined
        };
        
        return cleanBlock;
      })
    }))
  };
}

/**
 * Fetches all proposals
 */
export async function getProposals(): Promise<Proposal[]> {
  const response = await fetch('/api/proposals', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch proposals');
  }

  const proposals = await response.json();
  return proposals.map(mapDatabaseToFrontend);
}

/**
 * Fetches a single proposal by ID
 */
export async function getProposal(id: string): Promise<Proposal> {
  const response = await fetch(`/api/proposals/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch proposal');
  }

  const proposal = await response.json();
  return mapDatabaseToFrontend(proposal);
}

/**
 * Creates a new proposal
 */
export async function createProposal(proposalData: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Proposal> {
  const response = await fetch('/api/proposals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(proposalData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create proposal');
  }

  const proposal = await response.json();
  return mapDatabaseToFrontend(proposal);
}

/**
 * Updates an existing proposal
 */
export async function updateProposal(
  id: string,
  proposalData: Partial<Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Proposal> {
  const response = await fetch(`/api/proposals/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(proposalData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update proposal');
  }

  const proposal = await response.json();
  return mapDatabaseToFrontend(proposal);
}

/**
 * Deletes a proposal
 */
export async function deleteProposal(id: string): Promise<void> {
  const response = await fetch(`/api/proposals/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete proposal');
  }
}