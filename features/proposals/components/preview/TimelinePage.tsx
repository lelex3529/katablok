import React from 'react';
import { TimelineItem } from '../../types/Proposal';

interface TimelinePageProps {
  timeline: TimelineItem[];
  totalDuration: number;
  proposalId: string;
}

export default function TimelinePage({
  timeline,
  totalDuration,
}: TimelinePageProps) {
  return (
    <div>
      <h2 className='text-2xl font-sora font-bold mb-6'>
        Chronologie du projet
      </h2>
      <p className='text-gray-600 mb-6'>
        Le tableau ci-dessous présente le calendrier estimé pour chaque phase du
        projet :
      </p>
      <table className='w-full text-left border-collapse mb-6'>
        <thead>
          <tr className='border-b-2 border-gray-200'>
            <th className='py-3 px-2 text-gray-700 font-medium'>Phase</th>
            <th className='py-3 px-2 text-gray-700 font-medium'>Début</th>
            <th className='py-3 px-2 text-gray-700 font-medium'>Fin</th>
            <th className='py-3 px-2 text-gray-700 font-medium text-right'>
              Durée
            </th>
          </tr>
        </thead>
        <tbody>
          {timeline.map((item, index) => (
            <tr key={index} className='border-b border-gray-200'>
              <td className='py-3 px-2 font-medium'>
                {item.name}
                {item.description && (
                  <div className='text-xs text-gray-500 font-normal mt-1'>
                    {item.description}
                  </div>
                )}
              </td>
              <td className='py-3 px-2'>Semaine {item.startWeek}</td>
              <td className='py-3 px-2'>Semaine {item.endWeek}</td>
              <td className='py-3 px-2 text-right'>
                {item.duration} {item.duration === 1 ? 'semaine' : 'semaines'} (
                {item.durationDays} jours)
              </td>
            </tr>
          ))}
          <tr className='font-medium bg-gray-50'>
            <td className='py-3 px-2'>Durée totale du projet</td>
            <td className='py-3 px-2'>Semaine 1</td>
            <td className='py-3 px-2'>
              Semaine{' '}
              {timeline.length > 0 ? timeline[timeline.length - 1].endWeek : 0}
            </td>
            <td className='py-3 px-2 text-right text-katalyx-primary'>
              {Math.ceil(totalDuration / 5)} semaines ({totalDuration} jours)
            </td>
          </tr>
        </tbody>
      </table>
      <div className='text-sm text-gray-600 mt-4'>
        <p>
          * Ce calendrier est une estimation et peut être ajusté selon les
          besoins et dépendances du projet.
        </p>
        <p>* Chaque semaine représente 5 jours ouvrés.</p>
      </div>
    </div>
  );
}
