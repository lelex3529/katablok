'use client';

import { Proposal, ProposalBlock } from '../types/Proposal';
import ReactMarkdown from 'react-markdown';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';

interface ProposalPreviewProps {
  proposal: Proposal;
  onClose: () => void;
}

export default function ProposalPreview({
  proposal,
  onClose,
}: ProposalPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

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
              : block.block?.estimatedDuration || 0;

        return sectionTotal + duration;
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
              : block.block?.unitPrice || 0;

        return sectionTotal + price;
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

  // Format the proposal date
  const formattedDate = formatDate(
    proposal.createdAt || new Date().toISOString(),
  );

  // Handle download (placeholder for now)
  const handleDownload = () => {
    // This would be implemented with a PDF generation service
    alert('Download functionality will be implemented with PDF generation');
  };

  return (
    <div
      className={`bg-white ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : 'rounded-xl shadow-xl'}`}
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

      <div className='mx-auto max-w-4xl py-10 px-8'>
        {/* Cover page */}
        <div className='mb-16 text-center'>
          <div className='mb-6'>
            {/* This would be the company logo */}
            <div className='inline-block bg-katalyx-primary text-white text-lg font-bold py-2 px-4 rounded'>
              YourCompany
            </div>
          </div>
          <h1 className='text-4xl font-sora font-bold mb-4'>
            {proposal.title}
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            Commercial Proposal for {proposal.clientName}
          </p>
          <div className='text-gray-500 text-sm'>
            <p>Created on {formattedDate}</p>
            <p className='mt-1'>
              Reference: PROP-{proposal.id?.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className='mb-12'>
          <h2 className='font-sora font-semibold text-2xl border-b border-gray-200 pb-3 mb-6'>
            Executive Summary
          </h2>
          <div className='prose prose-gray max-w-none'>
            <p>
              This proposal outlines the services offered by YourCompany to{' '}
              {proposal.clientName}. We&apos;re excited to collaborate with you
              on this project and believe our expertise will help you achieve
              your business goals.
            </p>
          </div>
        </div>

        {/* Proposal sections */}
        {proposal.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <section key={section.id} className='mb-12'>
              <h2 className='font-sora font-semibold text-2xl border-b border-gray-200 pb-3 mb-6'>
                {section.title}
              </h2>

              {section.blocks
                .sort((a, b) => a.order - b.order)
                .map((block) => (
                  <div key={block.id} className='mb-8'>
                    <h3 className='font-sora font-medium text-xl mb-4'>
                      {getBlockTitle(block)}
                    </h3>
                    <div className='prose prose-gray max-w-none mb-6'>
                      <ReactMarkdown>{getBlockContent(block)}</ReactMarkdown>
                    </div>

                    <div className='bg-gray-50 rounded-lg p-4 text-sm'>
                      <div className='flex justify-between'>
                        <div>
                          <span className='text-gray-500'>
                            Estimated Duration:
                          </span>
                          <span className='ml-2 font-medium'>
                            {block.overrideDuration ||
                              block.overrides?.estimatedDuration ||
                              block.block?.estimatedDuration ||
                              0}{' '}
                            days
                          </span>
                        </div>
                        <div>
                          <span className='text-gray-500'>Cost:</span>
                          <span className='ml-2 font-medium'>
                            €
                            {(
                              block.overrideUnitPrice ||
                              block.overrides?.unitPrice ||
                              block.block?.unitPrice ||
                              0
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </section>
          ))}

        {/* Summary and pricing */}
        <section className='mb-12'>
          <h2 className='font-sora font-semibold text-2xl border-b border-gray-200 pb-3 mb-6'>
            Project Summary
          </h2>

          <div className='bg-gray-50 rounded-xl p-6 mb-8'>
            <h3 className='font-medium text-lg mb-4'>Timeline & Pricing</h3>

            <div className='mb-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <span className='text-gray-500 block mb-1'>
                    Total Duration
                  </span>
                  <span className='text-2xl font-sora font-medium'>
                    {totalDuration} days
                  </span>
                </div>
                <div>
                  <span className='text-gray-500 block mb-1'>Total Price</span>
                  <span className='text-2xl font-sora font-medium text-katalyx-primary'>
                    €{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='py-3 px-2 text-gray-500 font-medium'>
                    Section
                  </th>
                  <th className='py-3 px-2 text-gray-500 font-medium'>
                    Blocks
                  </th>
                  <th className='py-3 px-2 text-gray-500 font-medium'>
                    Duration
                  </th>
                  <th className='py-3 px-2 text-gray-500 font-medium text-right'>
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {proposal.sections.map((section) => {
                  const sectionDuration = section.blocks.reduce(
                    (total, block) => {
                      return (
                        total +
                        (block.overrideDuration ||
                          block.overrides?.estimatedDuration ||
                          block.block?.estimatedDuration ||
                          0)
                      );
                    },
                    0,
                  );

                  const sectionPrice = section.blocks.reduce((total, block) => {
                    return (
                      total +
                      (block.overrideUnitPrice ||
                        block.overrides?.unitPrice ||
                        block.block?.unitPrice ||
                        0)
                    );
                  }, 0);

                  return (
                    <tr key={section.id} className='border-b border-gray-200'>
                      <td className='py-3 px-2 font-medium'>{section.title}</td>
                      <td className='py-3 px-2'>{section.blocks.length}</td>
                      <td className='py-3 px-2'>{sectionDuration} days</td>
                      <td className='py-3 px-2 text-right'>
                        €{sectionPrice.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
                <tr className='font-medium'>
                  <td className='py-3 px-2'>Total</td>
                  <td className='py-3 px-2'>
                    {proposal.sections.reduce(
                      (total, section) => total + section.blocks.length,
                      0,
                    )}
                  </td>
                  <td className='py-3 px-2'>{totalDuration} days</td>
                  <td className='py-3 px-2 text-right text-katalyx-primary'>
                    €{totalPrice.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='prose prose-gray max-w-none'>
            <p>
              This proposal is valid for 30 days from the date of issue. To
              accept this proposal, please sign and return the attached contract
              or contact us directly.
            </p>
            <p>We look forward to working with you!</p>
          </div>
        </section>

        {/* Footer */}
        <footer className='mt-16 pt-8 border-t border-gray-200 text-sm text-gray-500 text-center'>
          <p>YourCompany Inc. • contact@yourcompany.com • +1 (555) 123-4567</p>
          <p className='mt-2'>
            This document is confidential and contains proprietary information.
          </p>
        </footer>
      </div>
    </div>
  );
}
