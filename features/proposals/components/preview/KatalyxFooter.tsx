import React from 'react';

interface KatalyxFooterProps {
  page: number;
  total: number;
}

const katalyxInfo =
  'KATALYX  67 COURS MIRABEAU 13100 AIX-EN-PROVENCE - Email : contact@katalyx.fr   Téléphone : 06 60 84 82 81  SIRET : 94161492700015 TVA Intracommunautaire : FR26941614927';

export default function KatalyxFooter({ page, total }: KatalyxFooterProps) {
  return (
    <footer className='w-full flex flex-col items-center justify-center text-xs text-gray-400 border-t pt-2 pb-1 mt-8 print:fixed print:bottom-0'>
      <div className='mb-1'>
        Page {page} / {total}
      </div>
      <div className='text-center whitespace-pre-line leading-tight'>
        {katalyxInfo}
      </div>
    </footer>
  );
}
