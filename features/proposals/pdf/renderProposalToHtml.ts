import { Proposal, ProposalBlock, TimelineItem } from '../types/Proposal';
import { formatDate } from '@/lib/utils';
import ReactDOMServer from 'react-dom/server';
import ProposalPdfDocument from '../components/pdf/ProposalPdfDocument';

/**
 * Function to get block content considering overrides
 */
const getBlockContent = (block: ProposalBlock) => {
  return (
    block.overrideContent ||
    block.overrides?.content ||
    block.block?.content ||
    ''
  );
};

/**
 * Function to get block title considering overrides
 */
const getBlockTitle = (block: ProposalBlock) => {
  return (
    block.overrideTitle || block.overrides?.title || block.block?.title || ''
  );
};

/**
 * Function to get block duration considering overrides
 */
const getBlockDuration = (block: ProposalBlock) => {
  return block.overrideDuration !== undefined
    ? block.overrideDuration
    : block.overrides?.estimatedDuration !== undefined
      ? block.overrides.estimatedDuration
      : block.block?.estimatedDuration;
};

/**
 * Function to get block price considering overrides
 */
const getBlockPrice = (block: ProposalBlock) => {
  return block.overrideUnitPrice !== undefined
    ? block.overrideUnitPrice
    : block.overrides?.unitPrice !== undefined
      ? block.overrides.unitPrice
      : block.block?.unitPrice;
};

/**
 * Calculate timeline data based on sections
 */
const calculateTimeline = (proposal: Proposal) => {
  let currentWeek = 1;
  // Only include sections with a total duration > 0
  return proposal.sections
    .sort((a, b) => a.order - b.order)
    .map((section) => {
      const sectionDuration = section.blocks.reduce((total, block) => {
        const duration = getBlockDuration(block);
        return (
          total +
          (typeof duration === 'number' && !isNaN(duration) ? duration : 0)
        );
      }, 0);
      // Skip sections with no duration
      if (!sectionDuration) return null;
      const durationInWeeks = Math.ceil(sectionDuration / 5);
      const startWeek = section.expectedDeliveryStart || currentWeek;
      const endWeek =
        section.expectedDeliveryEnd || startWeek + durationInWeeks - 1;
      currentWeek = endWeek + 1;
      // Collect block titles for description
      const blockTitles = section.blocks
        .map(getBlockTitle)
        .filter(Boolean)
        .join(', ');
      return {
        name: section.title,
        description: blockTitles,
        startWeek,
        endWeek,
        duration: durationInWeeks,
        durationDays: sectionDuration,
      };
    })
    .filter(Boolean) as TimelineItem[];
};

/**
 * Renders a proposal to HTML string
 * 
 * @param proposal The proposal to render to HTML
 * @returns HTML string representation of the proposal
 */
export function renderProposalToHtml(proposal: Proposal): string {
  // Use the React component to render the proposal
  const html = ReactDOMServer.renderToString(
    <ProposalPdfDocument proposal={proposal} />
  );
  
  return html;
}