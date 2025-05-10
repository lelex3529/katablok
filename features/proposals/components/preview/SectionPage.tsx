import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ProposalBlock, ProposalSection } from '../../types/Proposal';

interface SectionPageProps {
  section: ProposalSection;
  sectionIndex: number;
  proposalId: string;
  getBlockTitle: (block: ProposalBlock) => string;
  getBlockContent: (block: ProposalBlock) => string;
  getBlockDuration: (block: ProposalBlock) => number | undefined;
  getBlockPrice: (block: ProposalBlock) => number | undefined;
}

export default function SectionPage({
  section,
  sectionIndex,
  getBlockTitle,
  getBlockContent,
  getBlockDuration,
  getBlockPrice,
}: SectionPageProps) {
  return (
    <div
      id={`section-${section.id}`}
      className={sectionIndex > 0 ? 'mt-12' : ''}
    >
      <h2 className='text-2xl font-sora font-bold mb-6'>
        {sectionIndex + 1}. {section.title}
      </h2>
      <div>
        {section.blocks
          .sort((a, b) => a.order - b.order)
          .map((block, blockIndex) => {
            const blockDuration = getBlockDuration(block);
            const blockPrice = getBlockPrice(block);
            return (
              <div key={block.id} className='mb-8' id={`block-${block.id}`}>
                <h3 className='font-sora font-medium text-xl mb-4'>
                  {sectionIndex + 1}.{blockIndex + 1} {getBlockTitle(block)}
                </h3>
                <div className='prose prose-gray max-w-none mb-6'>
                  <ReactMarkdown>{getBlockContent(block)}</ReactMarkdown>
                </div>
                {(typeof blockDuration === 'number' && !isNaN(blockDuration)) ||
                (typeof blockPrice === 'number' && !isNaN(blockPrice)) ? (
                  <div className='bg-gray-50 rounded-lg p-4 text-sm'>
                    <div className='flex justify-between'>
                      {typeof blockDuration === 'number' &&
                        !isNaN(blockDuration) && (
                          <div>
                            <span className='text-gray-500'>
                              Durée estimée :
                            </span>
                            <span className='ml-2 font-medium'>
                              {blockDuration} jours
                            </span>
                          </div>
                        )}
                      {typeof blockPrice === 'number' && !isNaN(blockPrice) && (
                        <div>
                          <span className='text-gray-500'>Coût :</span>
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
    </div>
  );
}
