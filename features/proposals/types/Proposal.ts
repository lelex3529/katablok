// Proposal type definitions
import { Block } from "@/features/blocks/types/Block";

export interface ProposalBlock {
  id: string;
  blockId: string;  // refers to a Block
  order: number;
  sectionId?: string;
  block?: Block;
  overrides: {
    title?: string;
    content?: string;
    unitPrice?: number;
    estimatedDuration?: number;
  };
  // Fields directly from database
  overrideTitle?: string;
  overrideContent?: string;
  overrideUnitPrice?: number;
  overrideDuration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProposalSection {
  id: string;
  title: string;
  order: number;    // for sorting within a proposal
  proposalId?: string;
  blocks: ProposalBlock[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Proposal {
  id: string;
  title: string;
  clientName: string;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
  sections: ProposalSection[];
}