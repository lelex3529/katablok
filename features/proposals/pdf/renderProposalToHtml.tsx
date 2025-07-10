import { Proposal } from '../types/Proposal';
import ReactDOMServer from 'react-dom/server';
import ProposalPdfDocument from '../components/pdf/ProposalPdfDocument';

/**
 * Renders a proposal to HTML string
 *
 * @param proposal The proposal to render to HTML
 * @returns HTML string representation of the proposal
 */
export function renderProposalToHtml(proposal: Proposal): string {
  // Use the React component to render the proposal
  const html = ReactDOMServer.renderToString(
    <ProposalPdfDocument proposal={proposal} />,
  );

  return html;
}
