import Image from 'next/image';
import React from 'react';

export default function FinalContactPage() {
  return (
    <div className='flex-grow flex flex-col justify-center items-center py-12 bg-white'>
      <div className='text-center max-w-lg w-full'>
        <div className='flex justify-center mb-6'>
          <Image
            src='/katalyx-logo.png'
            alt='Katalyx Logo'
            width={220}
            height={60}
            priority
          />
        </div>
        <div className='bg-katalyx-primary text-white text-lg font-bold py-2 px-4 rounded mb-6'>
          KATALYX
        </div>
        <p className='text-gray-700 mb-1 font-medium'>
          67 COURS MIRABEAU, 13100 AIX-EN-PROVENCE
        </p>
        <p className='text-gray-700 mb-1'>
          Email :{' '}
          <a
            href='mailto:contact@katalyx.fr'
            className='underline hover:text-katalyx-primary'
          >
            contact@katalyx.fr
          </a>
        </p>
        <p className='text-gray-700 mb-1'>
          Téléphone :{' '}
          <a
            href='tel:+33660848281'
            className='underline hover:text-katalyx-primary'
          >
            06 60 84 82 81
          </a>
        </p>
        <p className='text-gray-700 mb-1'>SIRET : 941 614 927 00015</p>
        <p className='text-gray-700 mb-6'>
          TVA Intracommunautaire : FR26941614927
        </p>
        <div className='w-20 h-1 bg-katalyx-primary my-6 mx-auto'></div>
        <p className='text-gray-600 italic'>
          Merci d&apos;avoir étudié notre proposition. Nous espérons collaborer
          prochainement avec vous !
        </p>
      </div>
    </div>
  );
}
