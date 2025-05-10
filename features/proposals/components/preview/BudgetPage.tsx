import React from 'react';
import Image from 'next/image';
import { ProposalSection, ProposalBlock } from '../../types/Proposal';

interface BudgetPageProps {
  sections: ProposalSection[];
  getBlockTitle: (block: ProposalBlock) => string;
  getBlockPrice: (block: ProposalBlock) => number | undefined;
  totalPrice: number;
  proposalId: string;
}

export default function BudgetPage({
  sections,
  getBlockTitle,
  getBlockPrice,
  totalPrice,
  proposalId,
}: BudgetPageProps) {
  return (
    <div
      className='relative'
      style={{ width: 794, height: 1123 }}
      id='section-budget'
    >
      <div className='absolute inset-0 p-10 flex flex-col'>
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
            <p>Reference: PROP-{proposalId.slice(-6).toUpperCase()}</p>
          </div>
        </div>
        <div className='flex-grow overflow-hidden'>
          <div className='mt-6'>
            <p className='text-gray-600 mb-6'>
              Le tableau ci-dessous présente le coût de chaque section du projet
              :
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
                      Sous-total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sections
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
              <p>* Tous les prix sont en euros et hors taxes applicables.</p>
              <p>
                * Des frais supplémentaires peuvent s'appliquer pour les
                déplacements, services tiers ou licences si nécessaire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
