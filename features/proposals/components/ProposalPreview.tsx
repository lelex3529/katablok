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

interface ProposalPreviewProps {
  proposal: Proposal;
  onClose: () => void;
}

// A4 page dimensions in pixels (assuming 96dpi)
const A4_WIDTH_PX = 794; // ~21cm at 96dpi

export default function ProposalPreview({
  proposal,
  onClose,
}: ProposalPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tocItems, setTocItems] = useState<TocComponentItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Handle download (placeholder for now)
  const handleDownload = () => {
    // This would be implemented with a PDF generation service
    alert('Download functionality will be implemented with PDF generation');
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

  // Calculate the number of pages for the preview
  const pages = [
    {
      key: 'cover',
      component: (
        <CoverPage
          title={proposal.title}
          clientName={proposal.clientName}
          proposalId={proposal.id || ''}
          formattedDate={formattedDate}
        />
      ),
    },
    ...(proposal.introduction && proposal.introduction.trim()
      ? [
          {
            key: 'intro',
            component: (
              <IntroductionPage
                introduction={proposal.introduction}
                proposalId={proposal.id || ''}
              />
            ),
          },
        ]
      : []),
    {
      key: 'toc',
      component: (
        <TableOfContents tocItems={tocItems} proposalId={proposal.id || ''} />
      ),
    },
    ...proposal.sections
      .sort((a, b) => a.order - b.order)
      .map((section, sectionIndex) => ({
        key: `section-${section.id}`,
        component: (
          <SectionPage
            section={section}
            sectionIndex={sectionIndex}
            proposalId={proposal.id || ''}
            getBlockTitle={getBlockTitle}
            getBlockContent={getBlockContent}
            getBlockDuration={getBlockDuration}
            getBlockPrice={getBlockPrice}
          />
        ),
      })),
    {
      key: 'timeline',
      component: (
        <TimelinePage
          timeline={calculateTimeline().filter(Boolean) as TimelineItem[]}
          totalDuration={totalDuration}
          proposalId={proposal.id || ''}
        />
      ),
    },
    {
      key: 'budget',
      component: (
        <BudgetPage
          sections={proposal.sections}
          getBlockTitle={getBlockTitle}
          getBlockPrice={getBlockPrice}
          totalPrice={totalPrice}
          proposalId={proposal.id || ''}
        />
      ),
    },
    {
      key: 'payment',
      component: (
        <PaymentTermsPage
          paymentTerms={proposal.paymentTerms || []}
          totalPrice={totalPrice}
          proposalId={proposal.id || ''}
        />
      ),
    },
    { key: 'contact', component: <FinalContactPage /> },
  ];
  const totalPages = pages.length;

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
          {pages.map((page, idx) => (
            <div key={page.key} className='relative'>
              {idx !== 0 && <div className='page-break'></div>}
              {page.component}
              <KatalyxFooter page={idx + 1} total={totalPages} />
            </div>
          ))}
        </div>
      </div>
      {/* CSS for page breaks */}
      <style jsx>{`
        .page-break {
          height: 30px;
          margin: 0;
          border-top: 1px dashed #e5e7eb;
          position: relative;
        }

        .page-break::after {
          content: '✂';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 0 10px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
