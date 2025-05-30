'use client';

import Link from 'next/link';
import {
  DocumentPlusIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useDashboardData } from '@/features/proposals/hooks/useDashboardData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types pour les données de proposition
type PropositionStatus = 'draft' | 'sent' | 'signed';

// Fonction pour obtenir le badge approprié en fonction du statut
const getStatusBadge = (status: PropositionStatus) => {
  switch (status) {
    case 'draft':
      return (
        <span className='px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800 shadow-sm'>
          Brouillon
        </span>
      );
    case 'sent':
      return (
        <span className='px-3 py-1 rounded-full text-xs font-medium bg-katalyx-secondary/15 text-katalyx-secondary shadow-sm'>
          Envoyé
        </span>
      );
    case 'signed':
      return (
        <span className='px-3 py-1 rounded-full text-xs font-medium bg-katalyx-success/15 text-katalyx-success shadow-sm'>
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
  const {
    totalProposals,
    pendingProposals,
    signedProposals,
    recentProposals,
    loading,
    error,
  } = useDashboardData();

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return format(date, 'd MMMM yyyy', { locale: fr });
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Date invalide';
    }
  };

  return (
    <div className='space-y-12 relative'>
      {/* En-tête */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-katalyx-text font-sora bg-clip-text text-transparent bg-linear-to-r from-katalyx-primary to-katalyx-primary-light'>
            Tableau de bord
          </h1>
          <p className='text-katalyx-neutral-gray mt-2'>
            Bienvenue sur Katalyx Proposals. Créez et gérez vos propositions
            commerciales.
          </p>
        </div>
        <Link
          href='/propositions/nouvelle'
          className='mt-6 md:mt-0 inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-xl shadow-button hover:shadow-button-hover transition-all duration-300'
        >
          <DocumentPlusIcon className='h-5 w-5 mr-2' />
          Nouvelle proposition
        </Link>
      </div>

      {/* Statistiques */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='bg-white rounded-2xl shadow-card hover:shadow-card-hover p-6 border border-gray-100 transition-all duration-300 group'>
          <div className='flex items-center'>
            <div className='p-4 rounded-xl bg-katalyx-secondary/10 group-hover:bg-katalyx-secondary/20 transition-all'>
              <DocumentTextIcon className='h-7 w-7 text-katalyx-secondary' />
            </div>
            <div className='ml-6'>
              <h2 className='text-lg font-semibold text-katalyx-text font-sora'>
                Total Propositions
              </h2>
              <p className='text-3xl font-bold text-katalyx-text mt-1'>
                {loading ? '...' : totalProposals}
              </p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-2xl shadow-card hover:shadow-card-hover p-6 border border-gray-100 transition-all duration-300 group'>
          <div className='flex items-center'>
            <div className='p-4 rounded-xl bg-katalyx-warning/20 group-hover:bg-katalyx-warning/30 transition-all'>
              <ClockIcon className='h-7 w-7 text-katalyx-warning' />
            </div>
            <div className='ml-6'>
              <h2 className='text-lg font-semibold text-katalyx-text font-sora'>
                En attente
              </h2>
              <p className='text-3xl font-bold text-katalyx-text mt-1'>
                {loading ? '...' : pendingProposals}
              </p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-2xl shadow-card hover:shadow-card-hover p-6 border border-gray-100 transition-all duration-300 group'>
          <div className='flex items-center'>
            <div className='p-4 rounded-xl bg-katalyx-success/10 group-hover:bg-katalyx-success/20 transition-all'>
              <CheckCircleIcon className='h-7 w-7 text-katalyx-success' />
            </div>
            <div className='ml-6'>
              <h2 className='text-lg font-semibold text-katalyx-text font-sora'>
                Signées
              </h2>
              <p className='text-3xl font-bold text-katalyx-text mt-1'>
                {loading ? '...' : signedProposals}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-2xl shadow-card p-6 border border-gray-100'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6'>
          <h2 className='text-xl font-semibold text-katalyx-text font-sora'>
            Propositions récentes
          </h2>
          <Link
            href='/propositions'
            className='flex items-center mt-2 md:mt-0 text-katalyx-secondary hover:text-katalyx-secondary-light transition-colors'
          >
            Voir toutes
            <ChevronRightIcon className='h-4 w-4 ml-1' />
          </Link>
        </div>
        <div className='overflow-hidden'>
          <div className='overflow-x-auto'>
            {loading ? (
              <div className='text-center py-8 text-katalyx-neutral-gray'>
                Chargement des propositions...
              </div>
            ) : error ? (
              <div className='text-center py-8 text-katalyx-error'>
                Erreur lors du chargement des données: {error}
              </div>
            ) : recentProposals.length === 0 ? (
              <div className='text-center py-8 text-katalyx-neutral-gray'>
                Aucune proposition pour le moment. Créez votre première
                proposition !
              </div>
            ) : (
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
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
                <tbody className='bg-white divide-y divide-gray-100'>
                  {recentProposals.map((proposal) => (
                    <tr
                      key={proposal.id}
                      className='hover:bg-katalyx-off-white transition-colors'
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-katalyx-text'>
                          {proposal.title}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-katalyx-neutral-gray'>
                          {proposal.clientName}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-katalyx-neutral-gray'>
                          {formatDate(proposal.createdAt)}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {getStatusBadge(
                          (proposal.status as PropositionStatus) || 'draft',
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right'>
                        <Link
                          href={`/propositions/${proposal.id}`}
                          className='text-katalyx-primary hover:text-katalyx-primary-light font-medium hover:underline transition-colors'
                        >
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
