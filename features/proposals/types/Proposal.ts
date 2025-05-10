// Proposal type definitions
import { Block } from '@/features/blocks/types/Block';

export interface PaymentTerm {
  label: string;
  percent: number;
  trigger: string;
}

export interface ProposalBlock {
  id: string;
  blockId: string; // refers to a Block
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
  order: number; // for sorting within a proposal
  proposalId?: string;
  blocks: ProposalBlock[];
  createdAt?: Date;
  updatedAt?: Date;
  expectedDeliveryStart?: number; // in weeks from project start
  expectedDeliveryEnd?: number; // in weeks from project start
}

export interface Proposal {
  id: string;
  title: string;
  clientName: string;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
  sections: ProposalSection[];
  paymentTerms?: PaymentTerm[];
  introduction?: string; // Optional introduction paragraph
  context?: string; // Optional project context
}

export interface ProposalStructuredContext {
  clientName: string;
  projectName: string;
  objectives: string[];
  tone: string;
}
