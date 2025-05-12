'use client';

import { Proposal, ProposalBlock, TimelineItem } from '../types/Proposal';
import { formatDate } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';
import CoverPage from './preview/CoverPage';
import IntroductionPage from './preview/IntroductionPage';
import TableOfContents, {
  TocItem as TocComponentItem,
} from './preview/TableOfContents';
import SectionPage from './preview/SectionPage';
import TimelinePage from './preview/TimelinePage';
import BudgetPage from './preview/BudgetPage';
import PaymentTermsPage from './preview/PaymentTermsPage';
import FinalContactPage from './preview/FinalContactPage';
import KatalyxFooter from './preview/KatalyxFooter';
import ContentContainer from './preview/ContentContainer';
import PageBreakManager from './preview/PageBreakManager';

interface ProposalPreviewProps {
  proposal: Proposal;
  onClose: () => void;
}

// A4 page dimensions in pixels (assuming 96dpi)
const A4_WIDTH_PX = 794; // ~21cm at 96dpi
const A4_HEIGHT_PX = 1123; // ~29.7cm at 96dpi

export default function ProposalPreview({
  proposal,
  onClose,
}: ProposalPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tocItems, setTocItems] = useState<TocComponentItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Calculate totals
  const totalDuration = proposal.sections.reduce((total, section) => {
    return (
      total +
      section.blocks.reduce((sectionTotal, block) => {
        const duration =
          block.overrideDuration !== undefined
            ? block.overrideDuration
            : block.overrides?.estimatedDuration !== undefined
              ? block.overrides.estimatedDuration
              : block.block?.estimatedDuration;
        return (
          sectionTotal +
          (typeof duration === 'number' && !isNaN(duration) ? duration : 0)
        );
      }, 0)
    );
  }, 0);

  const totalPrice = proposal.sections.reduce((total, section) => {
    return (
      total +
      section.blocks.reduce((sectionTotal, block) => {
        const price =
          block.overrideUnitPrice !== undefined
            ? block.overrideUnitPrice
            : block.overrides?.unitPrice !== undefined
              ? block.overrides.unitPrice
              : block.block?.unitPrice;
        return (
          sectionTotal +
          (typeof price === 'number' && !isNaN(price) ? price : 0)
        );
      }, 0)
    );
  }, 0);

  // Get block content considering overrides
  const getBlockContent = (block: ProposalBlock) => {
    return (
      block.overrideContent ||
      block.overrides?.content ||
      block.block?.content ||
      ''
    );
  };

  // Get block title considering overrides
  const getBlockTitle = (block: ProposalBlock) => {
    return (
      block.overrideTitle || block.overrides?.title || block.block?.title || ''
    );
  };

  // Get block duration considering overrides
  const getBlockDuration = (block: ProposalBlock) => {
    return block.overrideDuration !== undefined
      ? block.overrideDuration
      : block.overrides?.estimatedDuration !== undefined
        ? block.overrides.estimatedDuration
        : block.block?.estimatedDuration;
  };

  // Get block price considering overrides
  const getBlockPrice = (block: ProposalBlock) => {
    return block.overrideUnitPrice !== undefined
      ? block.overrideUnitPrice
      : block.overrides?.unitPrice !== undefined
        ? block.overrides.unitPrice
        : block.block?.unitPrice;
  };

  // Format the proposal date
  const formattedDate = formatDate(
    proposal.createdAt || new Date().toISOString(),
  );

  // Build table of contents (now uses onClick for modular component)
  useEffect(() => {
    const items: TocComponentItem[] = [];
    const sortedSections = [...proposal.sections].sort(
      (a, b) => a.order - b.order,
    );
    sortedSections.forEach((section, sectionIndex) => {
      const sectionNumber = `${sectionIndex + 1}`;
      items.push({
        id: section.id,
        title: section.title,
        level: 1,
        number: sectionNumber,
        onClick: () => {
          const el = document.getElementById(`section-${section.id}`);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        },
      });
      const sortedBlocks = [...section.blocks].sort(
        (a, b) => a.order - b.order,
      );
      sortedBlocks.forEach((block, blockIndex) => {
        const blockNumber = `${sectionNumber}.${blockIndex + 1}`;
        items.push({
          id: block.id,
          title: getBlockTitle(block),
          level: 2,
          number: blockNumber,
          onClick: () => {
            const el = document.getElementById(`block-${block.id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          },
        });
      });
    });
    // Add special sections
    items.push({
      id: 'timeline',
      title: 'Chronologie du projet',
      level: 1,
      number: `${sortedSections.length + 1}`,
      onClick: () => {
        const el = document.getElementById('section-timeline');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    });
    items.push({
      id: 'budget',
      title: 'Détail du budget',
      level: 1,
      number: `${sortedSections.length + 2}`,
      onClick: () => {
        const el = document.getElementById('section-budget');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    });
    items.push({
      id: 'payment',
      title: 'Modalités de paiement',
      level: 1,
      number: `${sortedSections.length + 3}`,
      onClick: () => {
        const el = document.getElementById('section-payment');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    });
    setTocItems(items);
  }, [proposal.sections]);

  // Count pages for pagination
  useEffect(() => {
    // Base count of standard pages
    let baseCount = 3; // Cover, TOC, Introduction (if present)
    if (!proposal.introduction) baseCount--;

    // Count for sections and special pages
    const specialPagesCount = 4; // Timeline, Budget, Payment Terms, Final Contact

    // Total is base count + sections + special pages + any extra pages from overflow
    setTotalPages(baseCount + 1 + specialPagesCount);
  }, [proposal.sections, proposal.introduction]);

  // Handle download PDF
  const handleDownload = () => {
    if (!proposal.id || proposal.id === 'preview') {
      alert('Veuillez d\'abord enregistrer cette proposition avant de la télécharger.');
      return;
    }

    // Show loading UI
    setIsDownloading(true);

    // Create an invisible iframe to trigger the download
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `/api/proposals/${proposal.id}/pdf`;
    document.body.appendChild(iframe);

    // Clean up after download starts
    setTimeout(() => {
      document.body.removeChild(iframe);
      setIsDownloading(false);
    }, 2000);
  };

  // Calculate project timeline
  const calculateTimeline = () => {
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
      .filter(Boolean);
  };

  // Page count to track current page number
  let currentPageNumber = 1;

  return (
    <div
      className={`bg-white ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : 'rounded-xl shadow-xl'}`}
      ref={containerRef}
    >
      {/* Preview header with controls */}
      <div className='sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center'>
        <div>
          <h2 className='font-medium text-gray-900'>
            Aperçu de la proposition
          </h2>
          <p className='text-sm text-gray-500'>
            Aperçu de la proposition telle que votre client la verra
          </p>
        </div>
        <div className='flex items-center space-x-3'>
          <button
            onClick={handleDownload}
            className='px-4 py-2 flex items-center text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50'
          >
            <ArrowDownTrayIcon className='h-4 w-4 mr-2' />
            Télécharger en PDF
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className='p-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50'
            title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
          >
            <ArrowsPointingOutIcon className='h-4 w-4' />
          </button>
          <button
            onClick={onClose}
            className='p-2 text-gray-500 hover:text-katalyx-error hover:bg-gray-50 rounded-lg'
            title={"Fermer l'aperçu"}
          >
            <XMarkIcon className='h-5 w-5' />
          </button>
        </div>
      </div>

      <div
        className='mx-auto py-10 px-4 md:px-0'
        style={{ maxWidth: `${A4_WIDTH_PX}px` }}
      >
        <div className='bg-white shadow-lg mx-auto border border-gray-200'>
          {/* Cover page is always its own page */}
          <div className='a4-page'>
            <CoverPage
              title={proposal.title}
              clientName={proposal.clientName}
              proposalId={proposal.id || ''}
              formattedDate={formattedDate}
            />
            <div className='footer-container'>
              <KatalyxFooter page={currentPageNumber++} total={totalPages} />
            </div>
          </div>

          {/* Table of Contents - always its own page */}
          <div className='a4-page page-break-before'>
            <TableOfContents
              tocItems={tocItems}
              proposalId={proposal.id || ''}
            />
            <div className='footer-container'>
              <KatalyxFooter page={currentPageNumber++} total={totalPages} />
            </div>
          </div>

          {/* Introduction if available */}
          {proposal.introduction && proposal.introduction.trim() && (
            <div className='a4-page page-break-before'>
              <ContentContainer proposalId={proposal.id || ''}>
                <div className='mt-6 prose prose-gray max-w-none'>
                  <h2 className='text-2xl font-sora font-bold mb-6'>
                    Introduction
                  </h2>
                  <IntroductionPage
                    introduction={proposal.introduction}
                    proposalId={proposal.id || ''}
                  />
                </div>
              </ContentContainer>
              <div className='footer-container'>
                <KatalyxFooter page={currentPageNumber++} total={totalPages} />
              </div>
            </div>
          )}

          {/* Content pages - now using PageBreakManager for automatic page breaks */}
          <PageBreakManager
            proposalId={proposal.id || ''}
            pageNumber={currentPageNumber++}
            totalPages={totalPages}
          >
            {proposal.sections
              .sort((a, b) => a.order - b.order)
              .map((section, sectionIndex) => (
                <SectionPage
                  key={section.id}
                  section={section}
                  sectionIndex={sectionIndex}
                  proposalId={proposal.id || ''}
                  getBlockTitle={getBlockTitle}
                  getBlockContent={getBlockContent}
                  getBlockDuration={getBlockDuration}
                  getBlockPrice={getBlockPrice}
                />
              ))}
          </PageBreakManager>

          {/* Special sections - each gets its own page */}
          <div className='a4-page page-break-before'>
            <ContentContainer
              proposalId={proposal.id || ''}
              id='section-timeline'
            >
              <TimelinePage
                timeline={calculateTimeline().filter(Boolean) as TimelineItem[]}
                totalDuration={totalDuration}
                proposalId={proposal.id || ''}
              />
            </ContentContainer>
            <div className='footer-container'>
              <KatalyxFooter page={currentPageNumber++} total={totalPages} />
            </div>
          </div>

          <div className='a4-page page-break-before'>
            <ContentContainer
              proposalId={proposal.id || ''}
              id='section-budget'
            >
              <BudgetPage
                sections={proposal.sections}
                getBlockTitle={getBlockTitle}
                getBlockPrice={getBlockPrice}
                totalPrice={totalPrice}
                proposalId={proposal.id || ''}
              />
            </ContentContainer>
            <div className='footer-container'>
              <KatalyxFooter page={currentPageNumber++} total={totalPages} />
            </div>
          </div>

          {/* Payment Terms page with PageBreakManager since it can be very long */}
          <PageBreakManager
            proposalId={proposal.id || ''}
            pageNumber={currentPageNumber++}
            totalPages={totalPages}
          >
            <div id='section-payment'>
              <PaymentTermsPage
                paymentTerms={proposal.paymentTerms || []}
                totalPrice={totalPrice}
              />
            </div>
          </PageBreakManager>

          {/* Contact page - always its own page */}
          <div className='a4-page page-break-before'>
            <ContentContainer proposalId={proposal.id || ''}>
              <FinalContactPage />
            </ContentContainer>
            <div className='footer-container'>
              <KatalyxFooter page={currentPageNumber++} total={totalPages} />
            </div>
          </div>
        </div>
      </div>

      {/* CSS for page styling */}
      <style jsx>{`
        .a4-page {
          width: ${A4_WIDTH_PX}px;
          min-height: ${A4_HEIGHT_PX}px;
          position: relative;
          padding: 0;
          overflow: hidden;
          page-break-after: always;
        }

        .page-break-before {
          page-break-before: always;
          border-top: 1px dashed #e5e7eb;
          padding-top: 30px;
          margin-top: 30px;
          position: relative;
        }

        .page-break-before::before {
          content: '✂';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 0 10px;
          color: #9ca3af;
        }

        .footer-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding-bottom: 20px;
        }

        @media print {
          .page-break-before {
            border-top: none;
            padding-top: 0;
            margin-top: 0;
          }
          .page-break-before::before {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
