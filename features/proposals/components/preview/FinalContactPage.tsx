import React from 'react';
import Image from 'next/image';

export default function FinalContactPage() {
  return (
    <div className='relative' style={{ width: 794, height: 1123 }}>
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
            <p>Reference: Contact</p>
          </div>
        </div>
        <div className='flex-grow flex flex-col justify-center items-center'>
          <div className='text-center'>
            <div className='bg-katalyx-primary text-white text-lg font-bold py-2 px-4 rounded mb-6'>
              VotreEntreprise
            </div>
            <p className='text-gray-700 mb-2'>123 Avenue des Affaires</p>
            <p className='text-gray-700 mb-6'>Tech City, TC 12345</p>
            <p className='text-gray-700 mb-1'>
              Email : contact@votreentreprise.com
            </p>
            <p className='text-gray-700 mb-1'>Téléphone : +33 1 23 45 67 89</p>
            <p className='text-gray-700 mb-6'>
              Site web : www.votreentreprise.com
            </p>
            <div className='w-20 h-1 bg-katalyx-primary my-6 mx-auto'></div>
            <p className='text-gray-600 italic'>
              Merci d'avoir étudié notre proposition. Nous espérons collaborer
              prochainement avec vous !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
