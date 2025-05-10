'use client';

import { Proposal, ProposalBlock } from '../types/Proposal';
import ReactMarkdown from 'react-markdown';
import { formatDate } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

// Katalyx company info for footer
const katalyxInfo = {
  name: 'KATALYX',
  address: '67 COURS MIRABEAU 13100 AIX-EN-PROVENCE',
  email: 'contact@katalyx.fr',
  phone: '06 60 84 82 81',
  siret: '94161492700015',
  tva: 'FR26941614927',
};

const KatalyxFooter: React.FC<{ pageNumber: number; totalPages: number }> = ({
  pageNumber,
  totalPages,
}) => (
  <footer className='h-14 text-xs text-gray-500 flex flex-col justify-center px-2 border-t border-gray-100 bg-white/80'>
    <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
      <span className='font-semibold'>{katalyxInfo.name}</span>
      <span>• {katalyxInfo.address}</span>
      <span>
        • Email:{' '}
        <a href={`mailto:${katalyxInfo.email}`} className='underline'>
          {katalyxInfo.email}
        </a>
      </span>
    </div>
    <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
      <span>Téléphone: {katalyxInfo.phone}</span>
      <span>• SIRET: {katalyxInfo.siret}</span>
      <span>• TVA Intracommunautaire: {katalyxInfo.tva}</span>
      <span className='ml-auto'>
        Page {pageNumber} of {totalPages}
      </span>
    </div>
  </footer>
);

interface ProposalPreviewProps {
  proposal: Proposal;
  onClose: () => void;
}

interface TocItem {
  id: string;
  title: string;
  level: number;
  number: string;
  ref: React.RefObject<HTMLElement>;
}

// A4 page dimensions in pixels (assuming 96dpi)
const A4_WIDTH_PX = 794; // ~21cm at 96dpi
const A4_HEIGHT_PX = 1123; // ~29.7cm at 96dpi

export default function ProposalPreview({
  proposal,
  onClose,
}: ProposalPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, React.RefObject<HTMLElement>>>(
    new Map(),
  );
  const blockRefs = useRef<Map<string, React.RefObject<HTMLElement>>>(
    new Map(),
  );

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

  // Build table of contents
  useEffect(() => {
    const items: TocItem[] = [];
    const sortedSections = [...proposal.sections].sort(
      (a, b) => a.order - b.order,
    );

    sortedSections.forEach((section, sectionIndex) => {
      const sectionNumber = `${sectionIndex + 1}`;
      const sectionRef = {
        current: document.getElementById(`section-${section.id}`),
      };
      sectionRefs.current.set(
        section.id,
        sectionRef as React.RefObject<HTMLElement>,
      );

      items.push({
        id: section.id,
        title: section.title,
        level: 1,
        number: sectionNumber,
        ref: sectionRef as React.RefObject<HTMLElement>,
      });

      const sortedBlocks = [...section.blocks].sort(
        (a, b) => a.order - b.order,
      );
      sortedBlocks.forEach((block, blockIndex) => {
        const blockNumber = `${sectionNumber}.${blockIndex + 1}`;
        const blockRef = {
          current: document.getElementById(`block-${block.id}`),
        };
        blockRefs.current.set(
          block.id,
          blockRef as React.RefObject<HTMLElement>,
        );

        items.push({
          id: block.id,
          title: getBlockTitle(block),
          level: 2,
          number: blockNumber,
          ref: blockRef as React.RefObject<HTMLElement>,
        });
      });
    });

    // Add special sections for Timeline, Budget, and Payment Terms
    items.push({
      id: 'timeline',
      title: 'Project Timeline',
      level: 1,
      number: `${sortedSections.length + 1}`,
      ref: {
        current: document.getElementById('section-timeline'),
      } as React.RefObject<HTMLElement>,
    });

    items.push({
      id: 'budget',
      title: 'Budget Breakdown',
      level: 1,
      number: `${sortedSections.length + 2}`,
      ref: {
        current: document.getElementById('section-budget'),
      } as React.RefObject<HTMLElement>,
    });

    items.push({
      id: 'payment',
      title: 'Payment Terms',
      level: 1,
      number: `${sortedSections.length + 3}`,
      ref: {
        current: document.getElementById('section-payment'),
      } as React.RefObject<HTMLElement>,
    });

    setTocItems(items);
  }, [proposal.sections]);

  // Handle download (placeholder for now)
  const handleDownload = () => {
    // This would be implemented with a PDF generation service
    alert('Download functionality will be implemented with PDF generation');
  };

  // Scroll to section when TOC item is clicked
  const scrollToItem = (item: TocItem) => {
    if (item.ref.current) {
      item.ref.current.scrollIntoView({ behavior: 'smooth' });
    }
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

  // Calculate total number of pages for pagination
  const totalPages = 7 + proposal.sections.length;

  return (
    <div
      className={`bg-white ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : 'rounded-xl shadow-xl'}`}
      ref={containerRef}
    >
      {/* Preview header with controls */}
      <div className='sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center'>
        <div>
          <h2 className='font-medium text-gray-900'>Proposal Preview</h2>
          <p className='text-sm text-gray-500'>
            Preview how your client will see this proposal
          </p>
        </div>
        <div className='flex items-center space-x-3'>
          <button
            onClick={handleDownload}
            className='px-4 py-2 flex items-center text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50'
          >
            <ArrowDownTrayIcon className='h-4 w-4 mr-2' />
            Download PDF
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className='p-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50'
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            <ArrowsPointingOutIcon className='h-4 w-4' />
          </button>
          <button
            onClick={onClose}
            className='p-2 text-gray-500 hover:text-katalyx-error hover:bg-gray-50 rounded-lg'
            title='Close preview'
          >
            <XMarkIcon className='h-5 w-5' />
          </button>
        </div>
      </div>

      <div
        className='mx-auto py-10 px-4 md:px-0'
        style={{ maxWidth: `${A4_WIDTH_PX}px` }}
      >
        {/* A4 Paper simulation */}
        <div className='bg-white shadow-lg mx-auto border border-gray-200'>
          {/* Cover page */}
          <div
            className='relative'
            style={{ width: `${A4_WIDTH_PX}px`, height: `${A4_HEIGHT_PX}px` }}
          >
            <div className='absolute inset-0 p-10 flex flex-col'>
              {/* Header */}
              <div className='h-20 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Image
                    src='/katalyx-logo.png'
                    alt='Katalyx Logo'
                    width={120}
                    height={40}
                    className='object-contain'
                    priority
                  />
                </div>
                <div className='text-sm text-gray-500'>
                  <p>Reference: PROP-{proposal.id?.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              {/* Cover content */}
              <div className='flex flex-col items-center justify-center flex-grow'>
                <h1 className='text-4xl font-sora font-bold mb-4 text-center'>
                  {proposal.title}
                </h1>
                <p className='text-xl text-gray-600 mb-8 text-center'>
                  Commercial Proposal for {proposal.clientName}
                </p>
                <div className='w-20 h-1 bg-katalyx-primary my-8'></div>
                <div className='text-gray-600 text-center'>
                  <p>Created on {formattedDate}</p>
                </div>
              </div>

              {/* Footer */}
              <KatalyxFooter pageNumber={1} totalPages={totalPages} />
            </div>
          </div>

          {/* Proposal Introduction (before ToC) */}
          {proposal.introduction && proposal.introduction.trim() && (
            <>
              <div className='page-break'></div>
              <div
                className='relative'
                style={{
                  width: `${A4_WIDTH_PX}px`,
                  height: `${A4_HEIGHT_PX}px`,
                }}
              >
                <div className='absolute inset-0 p-10 flex flex-col'>
                  {/* Header */}
                  <div className='h-20 flex justify-between items-center'>
                    <div className='flex items-center'>
                      <Image
                        src='/katalyx-logo.png'
                        alt='Katalyx Logo'
                        width={120}
                        height={40}
                        className='object-contain'
                        priority
                      />
                    </div>
                    <div className='text-sm text-gray-500'>
                      <p>
                        Reference: PROP-{proposal.id?.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='flex-grow overflow-hidden'>
                    <div className='prose prose-gray max-w-none'>
                      <ReactMarkdown>{proposal.introduction}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Footer */}
                  <KatalyxFooter pageNumber={2} totalPages={totalPages} />
                </div>
              </div>
            </>
          )}

          {/* Table of Contents (now after Introduction) */}
          <div className='page-break'></div>
          <div
            className='relative'
            style={{ width: `${A4_WIDTH_PX}px`, height: `${A4_HEIGHT_PX}px` }}
          >
            <div className='absolute inset-0 p-10 flex flex-col'>
              {/* Header */}
              <div className='h-20 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Image
                    src='/katalyx-logo.png'
                    alt='Katalyx Logo'
                    width={120}
                    height={40}
                    className='object-contain'
                    priority
                  />
                </div>
                <div className='text-sm text-gray-500'>
                  <p>Reference: PROP-{proposal.id?.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              {/* ToC content */}
              <div className='flex-grow overflow-hidden'>
                <div className='mt-6 space-y-2'>
                  {tocItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center cursor-pointer hover:text-katalyx-primary ${
                        item.level === 1 ? 'font-medium' : 'pl-6 text-sm'
                      }`}
                      onClick={() => scrollToItem(item)}
                    >
                      <span className='mr-2'>{item.number}</span>
                      <span className='flex-grow'>{item.title}</span>
                      <span className='border-b border-dashed border-gray-300 flex-grow mx-2'></span>
                      <LinkIcon className='h-3 w-3 mr-1' />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <KatalyxFooter pageNumber={3} totalPages={totalPages} />
            </div>
          </div>

          {/* Proposal sections */}
          <div
            className='relative proposal-sections'
            style={{ width: `${A4_WIDTH_PX}px` }}
          >
            {proposal.sections
              .sort((a, b) => a.order - b.order)
              .map((section, sectionIndex) => (
                <div
                  key={section.id}
                  id={`section-${section.id}`}
                  className={sectionIndex > 0 ? 'mt-12' : ''}
                >
                  <div className='p-10'>
                    {/* Header */}
                    <div className='h-20 flex justify-between items-center'>
                      <div className='flex items-center'>
                        <Image
                          src='/katalyx-logo.png'
                          alt='Katalyx Logo'
                          width={120}
                          height={40}
                          className='object-contain'
                          priority
                        />
                      </div>
                      <div className='text-sm text-gray-500'>
                        <p>
                          Reference: PROP-{proposal.id?.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Section content with blocks */}
                    <div>
                      {section.blocks
                        .sort((a, b) => a.order - b.order)
                        .map((block, blockIndex) => {
                          const blockDuration = getBlockDuration(block);
                          const blockPrice = getBlockPrice(block);

                          return (
                            <div
                              key={block.id}
                              className='mb-8'
                              id={`block-${block.id}`}
                            >
                              <h3 className='font-sora font-medium text-xl mb-4'>
                                {sectionIndex + 1}.{blockIndex + 1}{' '}
                                {getBlockTitle(block)}
                              </h3>
                              <div className='prose prose-gray max-w-none mb-6'>
                                <ReactMarkdown>
                                  {getBlockContent(block)}
                                </ReactMarkdown>
                              </div>

                              {(typeof blockDuration === 'number' &&
                                !isNaN(blockDuration)) ||
                              (typeof blockPrice === 'number' &&
                                !isNaN(blockPrice)) ? (
                                <div className='bg-gray-50 rounded-lg p-4 text-sm'>
                                  <div className='flex justify-between'>
                                    {typeof blockDuration === 'number' &&
                                      !isNaN(blockDuration) && (
                                        <div>
                                          <span className='text-gray-500'>
                                            Estimated Duration:
                                          </span>
                                          <span className='ml-2 font-medium'>
                                            {blockDuration} days
                                          </span>
                                        </div>
                                      )}
                                    {typeof blockPrice === 'number' &&
                                      !isNaN(blockPrice) && (
                                        <div>
                                          <span className='text-gray-500'>
                                            Cost:
                                          </span>
                                          <span className='ml-2 font-medium'>
                                            {blockPrice?.toLocaleString()}€
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                    </div>

                    {/* Footer */}
                    <KatalyxFooter
                      pageNumber={4 + sectionIndex}
                      totalPages={totalPages}
                    />
                  </div>
                </div>
              ))}
          </div>

          {/* Page break before project timeline */}
          <div className='page-break'></div>

          {/* Project Timeline */}
          <div
            className='relative'
            style={{
              width: `${A4_WIDTH_PX}px`,
              minHeight: `${A4_HEIGHT_PX}px`,
            }}
            id='section-timeline'
          >
            <div className='absolute inset-0 p-10 flex flex-col'>
              {/* Header */}
              <div className='h-20 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Image
                    src='/katalyx-logo.png'
                    alt='Katalyx Logo'
                    width={120}
                    height={40}
                    className='object-contain'
                    priority
                  />
                </div>
                <div className='text-sm text-gray-500'>
                  <p>Reference: PROP-{proposal.id?.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              {/* Timeline content */}
              <div className='flex-grow overflow-hidden'>
                <div className='mt-6'>
                  <p className='text-gray-600 mb-6'>
                    The following table outlines the estimated timeline for
                    completing each phase of the project:
                  </p>

                  <table className='w-full text-left border-collapse mb-6'>
                    <thead>
                      <tr className='border-b-2 border-gray-200'>
                        <th className='py-3 px-2 text-gray-700 font-medium'>
                          Phase
                        </th>
                        <th className='py-3 px-2 text-gray-700 font-medium'>
                          Start Week
                        </th>
                        <th className='py-3 px-2 text-gray-700 font-medium'>
                          End Week
                        </th>
                        <th className='py-3 px-2 text-gray-700 font-medium text-right'>
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculateTimeline()
                        .filter(
                          (item): item is NonNullable<typeof item> =>
                            item !== null,
                        )
                        .map((item, index) => (
                          <tr key={index} className='border-b border-gray-200'>
                            <td className='py-3 px-2 font-medium'>
                              {item.name}
                              {item.description && (
                                <div className='text-xs text-gray-500 font-normal mt-1'>
                                  {item.description}
                                </div>
                              )}
                            </td>
                            <td className='py-3 px-2'>Week {item.startWeek}</td>
                            <td className='py-3 px-2'>Week {item.endWeek}</td>
                            <td className='py-3 px-2 text-right'>
                              {item.duration}{' '}
                              {item.duration === 1 ? 'week' : 'weeks'} (
                              {item.durationDays} days)
                            </td>
                          </tr>
                        ))}
                      <tr className='font-medium bg-gray-50'>
                        <td className='py-3 px-2'>Total Project Duration</td>
                        <td className='py-3 px-2'>Week 1</td>
                        <td className='py-3 px-2'>
                          Week{' '}
                          {calculateTimeline().filter(Boolean).length > 0
                            ? calculateTimeline()
                                .filter(
                                  (item): item is NonNullable<typeof item> =>
                                    item !== null,
                                )
                                .slice(-1)[0]?.endWeek || 0
                            : 0}
                        </td>
                        <td className='py-3 px-2 text-right text-katalyx-primary'>
                          {Math.ceil(totalDuration / 5)} weeks ({totalDuration}{' '}
                          days)
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className='text-sm text-gray-600 mt-4'>
                    <p>
                      * This timeline is an estimate and may be adjusted based
                      on project requirements and dependencies.
                    </p>
                    <p>* Each week represents 5 business days.</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <KatalyxFooter
                pageNumber={4 + proposal.sections.length}
                totalPages={totalPages}
              />
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className='page-break'></div>
          <div
            className='relative'
            style={{ width: `${A4_WIDTH_PX}px`, height: `${A4_HEIGHT_PX}px` }}
            id='section-budget'
          >
            <div className='absolute inset-0 p-10 flex flex-col'>
              {/* Header */}
              <div className='h-20 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Image
                    src='/katalyx-logo.png'
                    alt='Katalyx Logo'
                    width={120}
                    height={40}
                    className='object-contain'
                    priority
                  />
                </div>
                <div className='text-sm text-gray-500'>
                  <p>Reference: PROP-{proposal.id?.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              {/* Budget content */}
              <div className='flex-grow overflow-hidden'>
                <div className='mt-6'>
                  <p className='text-gray-600 mb-6'>
                    The following table outlines the cost for each section of
                    the project:
                  </p>

                  <div className='bg-gray-50 rounded-xl p-6 mb-8'>
                    <table className='w-full text-left border-collapse'>
                      <thead>
                        <tr className='border-b-2 border-gray-200'>
                          <th className='py-3 px-2 text-gray-700 font-medium'>
                            Section
                          </th>
                          <th className='py-3 px-2 text-gray-700 font-medium'>
                            Description
                          </th>
                          <th className='py-3 px-2 text-gray-700 font-medium text-right'>
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {proposal.sections
                          .map((section) => {
                            const sectionPrice = section.blocks.reduce(
                              (total, block) => {
                                const blockPrice = getBlockPrice(block);
                                return (
                                  total +
                                  (typeof blockPrice === 'number' &&
                                  !isNaN(blockPrice)
                                    ? blockPrice
                                    : 0)
                                );
                              },
                              0,
                            );
                            if (!sectionPrice) return null;
                            const blockTitles = section.blocks
                              .map(getBlockTitle)
                              .filter(Boolean)
                              .join(', ');
                            return (
                              <tr
                                key={section.id}
                                className='border-b border-gray-200'
                              >
                                <td className='py-3 px-2 font-medium'>
                                  {section.title}
                                </td>
                                <td className='py-3 px-2 text-gray-500 text-sm'>
                                  {blockTitles}
                                </td>
                                <td className='py-3 px-2 text-right'>
                                  €{sectionPrice.toLocaleString()}
                                </td>
                              </tr>
                            );
                          })
                          .filter(Boolean)}
                        <tr className='font-medium bg-white border-t-2 border-gray-300'>
                          <td className='py-4 px-2'>Total</td>
                          <td className='py-4 px-2'></td>
                          <td className='py-4 px-2 text-right text-katalyx-primary font-bold text-lg'>
                            €{totalPrice?.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className='text-sm text-gray-600 mt-4'>
                    <p>
                      * All prices are in Euros and exclude applicable taxes.
                    </p>
                    <p>
                      * Additional expenses may apply for travel, third-party
                      services, or licenses if required.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <KatalyxFooter
                pageNumber={5 + proposal.sections.length}
                totalPages={totalPages}
              />
            </div>
          </div>

          {/* Payment Terms */}
          <div className='page-break'></div>
          <div
            className='relative'
            style={{ width: `${A4_WIDTH_PX}px`, height: `${A4_HEIGHT_PX}px` }}
            id='section-payment'
          >
            <div className='absolute inset-0 p-10 flex flex-col'>
              {/* Header */}
              <div className='h-20 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Image
                    src='/katalyx-logo.png'
                    alt='Katalyx Logo'
                    width={120}
                    height={40}
                    className='object-contain'
                    priority
                  />
                </div>
                <div className='text-sm text-gray-500'>
                  <p>Reference: PROP-{proposal.id?.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              {/* Payment terms content */}
              <div className='flex-grow overflow-hidden'>
                <div className='mt-6'>
                  <div className='mb-6'>
                    <p className='text-gray-600 mb-4'>
                      The total cost of €{totalPrice?.toLocaleString()} will be
                      invoiced according to the following schedule:
                    </p>

                    {proposal.paymentTerms &&
                    proposal.paymentTerms.length > 0 ? (
                      <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                        <ul className='space-y-3'>
                          {proposal.paymentTerms.map((term, index) => (
                            <li key={index} className='flex items-start'>
                              <span className='text-katalyx-primary mr-2 text-lg leading-6'>
                                •
                              </span>
                              <span>
                                <strong>{term.label}</strong> (€
                                {Math.round(
                                  (totalPrice * term.percent) / 100,
                                ).toLocaleString()}
                                ) {term.trigger}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className='bg-gray-50 rounded-lg p-6 mb-6 text-gray-500 italic'>
                        No payment terms specified.
                      </div>
                    )}
                  </div>

                  <div className='prose prose-gray max-w-none'>
                    <h3 className='font-medium text-lg mb-2'>
                      Terms & Conditions
                    </h3>
                    <p>
                      This proposal is valid for 30 days from the date of issue.
                      To accept this proposal, please sign and return the
                      attached contract or contact us directly.
                    </p>
                    <p className='mt-2'>
                      All invoices are payable within 15 days of receipt. Late
                      payments may result in project delays. We look forward to
                      working with you!
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <KatalyxFooter
                pageNumber={6 + proposal.sections.length}
                totalPages={totalPages}
              />
            </div>
          </div>

          {/* Final page with contact information */}
          <div className='page-break'></div>
          <div
            className='relative'
            style={{ width: `${A4_WIDTH_PX}px`, height: `${A4_HEIGHT_PX}px` }}
          >
            <div className='absolute inset-0 p-10 flex flex-col'>
              {/* Header */}
              <div className='h-20 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Image
                    src='/katalyx-logo.png'
                    alt='Katalyx Logo'
                    width={120}
                    height={40}
                    className='object-contain'
                    priority
                  />
                </div>
                <div className='text-sm text-gray-500'>
                  <p>Reference: PROP-{proposal.id?.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              {/* Contact content */}
              <div className='flex-grow flex flex-col justify-center items-center'>
                <div className='text-center'>
                  <div className='bg-katalyx-primary text-white text-lg font-bold py-2 px-4 rounded mb-6'>
                    YourCompany
                  </div>
                  <p className='text-gray-700 mb-2'>123 Business Avenue</p>
                  <p className='text-gray-700 mb-6'>Tech City, TC 12345</p>

                  <p className='text-gray-700 mb-1'>
                    Email: contact@yourcompany.com
                  </p>
                  <p className='text-gray-700 mb-1'>Phone: +1 (555) 123-4567</p>
                  <p className='text-gray-700 mb-6'>
                    Website: www.yourcompany.com
                  </p>

                  <div className='w-20 h-1 bg-katalyx-primary my-6 mx-auto'></div>

                  <p className='text-gray-600 italic'>
                    Thank you for considering our proposal. We look forward to
                    collaborating with you!
                  </p>
                </div>
              </div>

              {/* Footer */}
              <KatalyxFooter
                pageNumber={7 + proposal.sections.length}
                totalPages={totalPages}
              />
            </div>
          </div>
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
