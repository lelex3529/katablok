import React from 'react';
import Image from 'next/image';

interface PaymentTerm {
  label: string;
  percent: number;
  trigger: string;
}

interface PaymentTermsPageProps {
  paymentTerms: PaymentTerm[];
  totalPrice: number;
  proposalId: string;
}

export default function PaymentTermsPage({
  paymentTerms,
  totalPrice,
  proposalId,
}: PaymentTermsPageProps) {
  return (
    <div
      className='relative'
      style={{ width: 794, height: 1123 }}
      id='section-payment'
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
            <div className='mb-6'>
              <p className='text-gray-600 mb-4'>
                The total cost of €{totalPrice?.toLocaleString()} will be
                invoiced according to the following schedule:
              </p>
              {paymentTerms && paymentTerms.length > 0 ? (
                <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                  <ul className='space-y-3'>
                    {paymentTerms.map((term, index) => (
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
              <h3 className='font-medium text-lg mb-2'>Terms & Conditions</h3>
              <p>
                This proposal is valid for 30 days from the date of issue. To
                accept this proposal, please sign and return the attached
                contract or contact us directly.
              </p>
              <p className='mt-2'>
                All invoices are payable within 15 days of receipt. Late
                payments may result in project delays. We look forward to
                working with you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
