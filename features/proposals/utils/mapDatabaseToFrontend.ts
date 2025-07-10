import { Proposal } from '@/features/proposals/types/Proposal';
import { Proposal as DbProposal } from '@prisma/client';
import {
  ProposalSection,
  ProposalBlock,
} from '@/features/proposals/types/Proposal';

// Transform database proposal to frontend format
export function mapDatabaseToFrontend(dbProposal: any): Proposal {
  return {
    ...dbProposal,
    sections: dbProposal.sections.map(
      (section: any): ProposalSection => ({
        ...section,
        blocks: section.blocks.map((block: any): ProposalBlock => {
          return {
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
              estimatedDuration: block.overrideDuration || undefined,
            },
            block: block.block
              ? {
                  ...block.block,
                  estimatedDuration: block.block.estimatedDuration || undefined,
                  unitPrice: block.block.unitPrice || undefined,
                  userId: 'userId' in block.block ? block.block.userId : '',
                }
              : undefined,
          };
        }),
      }),
    ),
  };
}
