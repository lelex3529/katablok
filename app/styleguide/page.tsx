// app/styleguide/page.tsx
import React from 'react';

export default function Styleguide() {
  return (
    <div className='space-y-12'>
      {/* En-tête */}
      <div>
        <h1 className='text-3xl font-bold text-katalyx-text font-sora'>
          Katalyx Styleguide
        </h1>
        <p className='text-katalyx-neutral-gray mt-2'>
          Guide des styles et composants pour Katalyx Proposals
        </p>
      </div>

      {/* Couleurs */}
      <section>
        <h2 className='text-2xl font-sora text-katalyx-text mb-6'>
          Palette de couleurs
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
          <div className='flex flex-col'>
            <div className='h-24 rounded-t-lg bg-katalyx-primary'></div>
            <div className='p-3 border border-t-0 rounded-b-lg'>
              <p className='font-sora text-sm'>Primary</p>
              <p className='text-xs font-mono text-katalyx-neutral-gray mt-1'>
                #E85431
              </p>
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='h-24 rounded-t-lg bg-katalyx-dark'></div>
            <div className='p-3 border border-t-0 rounded-b-lg'>
              <p className='font-sora text-sm'>Dark</p>
              <p className='text-xs font-mono text-katalyx-neutral-gray mt-1'>
                #1B1B1E
              </p>
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='h-24 rounded-t-lg bg-katalyx-neutral-gray'></div>
            <div className='p-3 border border-t-0 rounded-b-lg'>
              <p className='font-sora text-sm'>Neutral Gray</p>
              <p className='text-xs font-mono text-katalyx-neutral-gray mt-1'>
                #525252
              </p>
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='h-24 rounded-t-lg bg-katalyx-off-white'></div>
            <div className='p-3 border border-t-0 rounded-b-lg'>
              <p className='font-sora text-sm'>Off White</p>
              <p className='text-xs font-mono text-katalyx-neutral-gray mt-1'>
                #F5F5F5
              </p>
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='h-24 rounded-t-lg bg-katalyx-text'></div>
            <div className='p-3 border border-t-0 rounded-b-lg'>
              <p className='font-sora text-sm'>Text</p>
              <p className='text-xs font-mono text-katalyx-neutral-gray mt-1'>
                #2C2C2C
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Typographie */}
      <section>
        <h2 className='text-2xl font-sora text-katalyx-text mb-6'>
          Typographie
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          <div>
            <h6 className='text-lg font-sora text-katalyx-text'>
              Titres (Sora)
            </h6>
            <div className='space-y-4 mt-4'>
              <div>
                <h1 className='text-4xl font-bold font-sora'>Titre H1</h1>
                <p className='text-sm text-katalyx-neutral-gray mt-1'>
                  text-4xl font-bold font-sora
                </p>
              </div>
              <div>
                <h2 className='text-3xl font-bold font-sora'>Titre H2</h2>
                <p className='text-sm text-katalyx-neutral-gray mt-1'>
                  text-3xl font-bold font-sora
                </p>
              </div>
              <div>
                <h3 className='text-2xl font-semibold font-sora'>Titre H3</h3>
                <p className='text-sm text-katalyx-neutral-gray mt-1'>
                  text-2xl font-semibold font-sora
                </p>
              </div>
              <div>
                <h4 className='text-xl font-semibold font-sora'>Titre H4</h4>
                <p className='text-sm text-katalyx-neutral-gray mt-1'>
                  text-xl font-semibold font-sora
                </p>
              </div>
              <div>
                <h5 className='text-lg font-medium font-sora'>Titre H5</h5>
                <p className='text-sm text-katalyx-neutral-gray mt-1'>
                  text-lg font-medium font-sora
                </p>
              </div>
              <div>
                <h6 className='text-lg font-sora text-katalyx-text'>
                  Options de Partage
                </h6>
              </div>
            </div>
          </div>
          <div>
            <p className='text-sm font-inter text-katalyx-neutral-gray mb-1'>
              Texte de paragraphe (Inter)
            </p>
            <p className='font-inter text-katalyx-text leading-relaxed'>
              Katalyx Proposals révolutionne la manière dont les équipes
              commerciales créent et gèrent leurs propositions. Grâce à une
              interface intuitive et des outils basés sur l&apos;intelligence
              artificielle, vous pouvez transformer vos dossiers de captation en
              documents professionnels et personnalisés en quelques minutes.
              Optimisez votre temps, améliorez votre taux de conversion et
              concentrez-vous sur ce qui compte vraiment : vos clients.
            </p>
          </div>
        </div>
      </section>

      {/* Boutons */}
      <section>
        <h2 className='text-2xl font-sora text-katalyx-text mb-6'>Boutons</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='space-y-4'>
            <h3 className='text-lg font-sora'>Primaire (Gradient)</h3>
            <button className='bg-gradient-primary text-white py-2.5 px-6 rounded-xl shadow-button hover:shadow-button-hover transition-all'>
              Bouton Primaire
            </button>
            <button className='bg-gradient-primary text-white py-2.5 px-6 rounded-xl opacity-70 cursor-not-allowed'>
              Désactivé
            </button>
          </div>
          <div className='space-y-4'>
            <h3 className='text-lg font-sora'>Secondaire</h3>
            <button className='bg-katalyx-dark text-white py-2.5 px-6 rounded-xl shadow-card hover:bg-katalyx-dark/90 transition-all'>
              Bouton Secondaire
            </button>
            <button className='bg-katalyx-dark text-white py-2.5 px-6 rounded-xl opacity-70 cursor-not-allowed'>
              Désactivé
            </button>
          </div>
          <div className='space-y-4'>
            <h3 className='text-lg font-sora'>Tertiaire</h3>
            <button className='text-katalyx-primary font-inter py-2.5 px-6 rounded-xl hover:bg-katalyx-primary hover:bg-opacity-10 transition-colors'>
              Voir les détails
            </button>
          </div>
        </div>
      </section>

      {/* Alertes */}
      <section className='mt-12'>
        <h2 className='text-2xl font-sora text-katalyx-text mb-6'>
          Alertes & Feedback
        </h2>
        <div className='space-y-4'>
          <div className='bg-katalyx-error/10 text-katalyx-error p-4 rounded-xl border border-katalyx-error/20'>
            <p className='font-medium'>
              Erreur : Ceci est un message d&apos;erreur.
            </p>
          </div>
          <div className='bg-katalyx-success/10 text-katalyx-success p-4 rounded-xl border border-katalyx-success/20'>
            <p className='font-medium'>
              Succès : Ceci est un message de succès.
            </p>
          </div>
          <div className='bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-200'>
            <p className='font-medium'>
              Info : Ceci est un message d&apos;information.
            </p>
          </div>
        </div>
      </section>

      {/* Cartes de contenu (BlockCard) */}
      <section className='mt-12'>
        <h2 className='text-2xl font-sora text-katalyx-text mb-6'>
          Carte de bloc de contenu
        </h2>
        <div className='max-w-md'>
          <div className='group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-gray-100 relative'>
            <div className='h-2 bg-gradient-primary w-full'></div>
            <div className='p-6'>
              <div className='flex justify-between items-start mb-3'>
                <h3 className='text-lg font-sora font-bold text-gray-800 truncate'>
                  Titre du bloc
                </h3>
                <div className='px-3 py-1 text-xs font-medium rounded-full shadow-sm bg-katalyx-success/15 text-katalyx-success'>
                  Public
                </div>
              </div>
              <p className='text-gray-600 text-sm mb-4 h-12 overflow-hidden'>
                Ceci est un extrait du contenu du bloc...
              </p>
              <div className='grid grid-cols-2 gap-3 mb-4'>
                <div className='bg-katalyx-secondary/5 p-3 rounded-xl'>
                  <p className='text-xs text-katalyx-secondary mb-1'>
                    Duration
                  </p>
                  <p className='font-medium'>10 days</p>
                </div>
                <div className='bg-katalyx-primary/5 p-3 rounded-xl'>
                  <p className='text-xs text-katalyx-primary mb-1'>Price</p>
                  <p className='font-medium'>1 000 €</p>
                </div>
              </div>
              <div className='mb-4 flex flex-wrap gap-1.5'>
                <span className='bg-katalyx-tertiary/10 text-katalyx-tertiary px-2 py-0.5 rounded-full text-xs'>
                  Catégorie 1
                </span>
                <span className='bg-katalyx-tertiary/10 text-katalyx-tertiary px-2 py-0.5 rounded-full text-xs'>
                  Catégorie 2
                </span>
              </div>
              <div className='flex items-center justify-between text-xs text-gray-500 mb-4'>
                <span>Created: 10/05/2025</span>
                <span>Updated: 10/05/2025</span>
              </div>
              <div className='flex justify-between space-x-3'>
                <button className='flex-1 px-4 py-2.5 bg-katalyx-secondary/10 text-katalyx-secondary rounded-xl hover:bg-katalyx-secondary/20 transition-all flex items-center justify-center shadow-secondary-button'>
                  <span className='mr-2'>✏️</span>Edit
                </button>
                <button className='flex-1 px-4 py-2.5 bg-katalyx-error/10 text-katalyx-error rounded-xl hover:bg-katalyx-error/20 transition-all flex items-center justify-center'>
                  <span className='mr-2'>🗑️</span>Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Champs de formulaire & chips */}
      <section className='mt-12'>
        <h2 className='text-2xl font-sora text-katalyx-text mb-6'>
          Champs de formulaire & Chips
        </h2>
        <div className='max-w-lg space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Catégories
            </label>
            <div className='flex'>
              <input
                type='text'
                className='flex-1 px-4 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary shadow-sm'
                placeholder='Ajouter une catégorie'
              />
              <button className='bg-gradient-primary text-white px-5 py-3 rounded-r-xl hover:shadow-button transition-all duration-300 flex items-center'>
                <span className='mr-1'>+</span>Ajouter
              </button>
            </div>
            <div className='mt-3 flex flex-wrap gap-2 p-3 bg-white border border-gray-100 rounded-xl shadow-sm'>
              <span className='bg-katalyx-tertiary/10 text-katalyx-tertiary px-3 py-1.5 rounded-full text-sm flex items-center'>
                Catégorie 1
              </span>
              <span className='bg-katalyx-tertiary/10 text-katalyx-tertiary px-3 py-1.5 rounded-full text-sm flex items-center'>
                Catégorie 2
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Badges et statuts */}
      <section className='mt-12'>
        <h2 className='text-2xl font-sora text-katalyx-text mb-6'>
          Badges et statuts
        </h2>
        <div className='flex flex-wrap gap-4'>
          <span className='px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800 shadow-sm'>
            Brouillon
          </span>
          <span className='px-3 py-1 rounded-full text-xs font-medium bg-katalyx-secondary/15 text-katalyx-secondary shadow-sm'>
            Envoyé
          </span>
          <span className='px-3 py-1 rounded-full text-xs font-medium bg-katalyx-success/15 text-katalyx-success shadow-sm'>
            Signé
          </span>
          <span className='px-3 py-1 rounded-full text-xs font-medium bg-katalyx-error/15 text-katalyx-error shadow-sm'>
            Refusé
          </span>
          <span className='px-3 py-1 rounded-full text-xs font-medium bg-katalyx-warning/15 text-katalyx-warning shadow-sm'>
            En attente
          </span>
          <span className='px-3 py-1 rounded-full text-xs font-medium bg-katalyx-tertiary/15 text-katalyx-tertiary shadow-sm'>
            En révision
          </span>
        </div>
      </section>
    </div>
  );
}
