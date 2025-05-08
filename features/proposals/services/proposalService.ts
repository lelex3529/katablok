import { Proposal, ProposalBlock, ProposalSection } from '../types/Proposal';

// Transform database proposal to frontend format
function mapDatabaseToFrontend(dbProposal: any): Proposal {
  return {
    ...dbProposal,
    sections: dbProposal.sections.map((section: any): ProposalSection => ({
      ...section,
      blocks: section.blocks.map((block: any): ProposalBlock => ({
        ...block,
        overrides: {
          title: block.overrideTitle,
          content: block.overrideContent,
          unitPrice: block.overrideUnitPrice,
          estimatedDuration: block.overrideDuration
        }
      }))
    }))
  };
}

// Transform frontend proposal to database format for creation
function mapFrontendToDatabase(proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>) {
  return {
    title: proposal.title,
    clientName: proposal.clientName,
    status: 'draft',
    sections: {
      create: proposal.sections.map((section: ProposalSection) => ({
        title: section.title,
        order: section.order,
        blocks: {
          create: section.blocks.map((block: ProposalBlock) => ({
            blockId: block.blockId,
            order: block.order,
            overrideTitle: block.overrides.title,
            overrideContent: block.overrides.content,
            overrideUnitPrice: block.overrides.unitPrice,
            overrideDuration: block.overrides.estimatedDuration
          }))
        }
      }))
    }
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