import Link from 'next/link';
import {
  DocumentPlusIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

// Types pour les données de proposition
type PropositionStatus = 'draft' | 'sent' | 'signed';

interface Proposition {
  id: string;
  title: string;
  client: string;
  date: string;
  status: PropositionStatus;
}

// Données de test pour les propositions récentes
const recentPropositions: Proposition[] = [
  {
    id: '1',
    title: 'Refonte site e-commerce',
    client: 'Acme Inc.',
    date: '15 avril 2025',
    status: 'draft',
  },
  {
    id: '2',
    title: 'Développement application mobile',
    client: 'Globex Corporation',
    date: '10 avril 2025',
    status: 'sent',
  },
  {
    id: '3',
    title: "Solution d'analyse de données",
    client: 'Initech',
    date: '5 avril 2025',
    status: 'signed',
  },
  {
    id: '4',
    title: 'Mise en place CRM',
    client: 'Massive Dynamic',
    date: '1 avril 2025',
    status: 'draft',
  },
];

// Fonction pour obtenir le badge approprié en fonction du statut
const getStatusBadge = (status: PropositionStatus) => {
  switch (status) {
    case 'draft':
      return (
        <span className='px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800'>
          Brouillon
        </span>
      );
    case 'sent':
      return (
        <span className='px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
          Envoyé
        </span>
      );
    case 'signed':
      return (
        <span className='px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
          Signé
        </span>
      );
    default:
      return (
        <span className='px-3 py-1 rounded-full text-xs font-medium bg-gray-200'>
          Inconnu
        </span>
      );
  }
};

export default function Dashboard() {
  return (
    <div className='space-y-8'>
      {/* En-tête */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-katalyx-text font-sora'>
            Tableau de bord
          </h1>
          <p className='text-katalyx-neutral-gray mt-2'>
            Bienvenue sur Katalyx Proposals. Créez et gérez vos propositions
            commerciales.
          </p>
        </div>
        <Link
          href='/propositions/nouvelle'
          className='mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-katalyx-primary text-white rounded-md hover:bg-opacity-90 transition-colors'
        >
          <DocumentPlusIcon className='h-5 w-5 mr-2' />
          Nouvelle proposition
        </Link>
      </div>

      {/* Statistiques */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-blue-100'>
              <DocumentTextIcon className='h-6 w-6 text-blue-600' />
            </div>
            <div className='ml-4'>
              <h2 className='text-lg font-semibold text-katalyx-text'>
                Total Propositions
              </h2>
              <p className='text-2xl font-bold text-katalyx-text'>12</p>
            </div>
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-yellow-100'>
              <ClockIcon className='h-6 w-6 text-yellow-600' />
            </div>
            <div className='ml-4'>
              <h2 className='text-lg font-semibold text-katalyx-text'>
                En attente
              </h2>
              <p className='text-2xl font-bold text-katalyx-text'>5</p>
            </div>
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-green-100'>
              <CheckCircleIcon className='h-6 w-6 text-green-600' />
            </div>
            <div className='ml-4'>
              <h2 className='text-lg font-semibold text-katalyx-text'>
                Signées
              </h2>
              <p className='text-2xl font-bold text-katalyx-text'>3</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className='text-xl font-semibold text-katalyx-text font-sora mb-4'>
          Propositions récentes
        </h2>
        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-katalyx-neutral-gray uppercase tracking-wider'
                  >
                    Titre
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-katalyx-neutral-gray uppercase tracking-wider'
                  >
                    Client
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-katalyx-neutral-gray uppercase tracking-wider'
                  >
                    Date
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-katalyx-neutral-gray uppercase tracking-wider'
                  >
                    Statut
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-right text-xs font-medium text-katalyx-neutral-gray uppercase tracking-wider'
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {recentPropositions.map((proposition) => (
                  <tr key={proposition.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-katalyx-text'>
                        {proposition.title}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-katalyx-neutral-gray'>
                        {proposition.client}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-katalyx-neutral-gray'>
                        {proposition.date}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {getStatusBadge(proposition.status)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm'>
                      <Link
                        href={`/propositions/${proposition.id}`}
                        className='text-katalyx-primary hover:text-katalyx-primary hover:underline'
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
