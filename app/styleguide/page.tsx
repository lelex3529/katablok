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
              interface intuitive et des outils basés sur l'intelligence
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
            <h3 className='text-lg font-sora'>Primaire</h3>
            <button className='bg-katalyx-primary text-white py-2 px-4 rounded-md'>
              Bouton Primaire
            </button>
            <button className='bg-katalyx-primary text-white py-2 px-4 rounded-md opacity-70'>
              Désactivé
            </button>
          </div>
          <div className='space-y-4'>
            <h3 className='text-lg font-sora'>Secondaire</h3>
            <button className='bg-katalyx-dark text-white py-2 px-4 rounded-md'>
              Bouton Secondaire
            </button>
            <button className='bg-katalyx-dark text-white py-2 px-4 rounded-md opacity-70'>
              Désactivé
            </button>
          </div>
          <div className='space-y-4'>
            <h3 className='text-lg font-sora'>Tertiaire</h3>
            <button className='text-katalyx-primary font-inter py-2 px-4 rounded-md hover:bg-katalyx-primary hover:bg-opacity-10 transition-colors'>
              Voir les détails
            </button>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className='mt-12'>
        <h2 className='text-2xl font-sora text-katalyx-text mb-6'>Cartes</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-sora text-katalyx-text mb-2'>
              Proposition Alpha
            </h3>
            <p className='font-inter text-katalyx-neutral-gray text-sm mb-1'>
              Client: Entreprise X
            </p>
            <p className='font-inter text-katalyx-neutral-gray text-sm mb-4'>
              Date: 10 avril 2025
            </p>
            <p className='font-inter text-katalyx-text mb-4'>
              Proposition pour un projet de refonte du site e-commerce. Cette
              carte permet d'accéder aux détails d'une proposition existante.
            </p>
            <div className='flex justify-end'>
              <button className='text-katalyx-primary font-inter py-2 px-4 rounded-md hover:bg-katalyx-primary hover:bg-opacity-10 transition-colors'>
                Voir les détails
              </button>
            </div>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-sora text-katalyx-text mb-2'>
              Bloc Fonctionnel
            </h3>
            <p className='font-inter text-katalyx-neutral-gray text-sm mb-1'>
              Type: Méthodologie
            </p>
            <p className='font-inter text-katalyx-neutral-gray text-sm mb-4'>
              Utilisé dans: 8 propositions
            </p>
            <p className='font-inter text-katalyx-text mb-4'>
              Ce bloc contient une description standardisée de notre
              méthodologie agile adaptable à différents projets clients.
            </p>
            <div className='flex justify-end'>
              <button className='text-katalyx-primary font-inter py-2 px-4 rounded-md hover:bg-katalyx-primary hover:bg-opacity-10 transition-colors'>
                Éditer le bloc
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Composants formulaire */}
      <section className='mt-12'>
        <h2 className='text-2xl font-sora text-katalyx-text mb-6'>
          Composants formulaire
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-6'>
            <div>
              <label
                htmlFor='input-text'
                className='block text-sm font-medium text-katalyx-text mb-1'
              >
                Champ texte
              </label>
              <input
                type='text'
                id='input-text'
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-katalyx-primary focus:border-katalyx-primary'
                placeholder='Entrez du texte'
              />
            </div>
            <div>
              <label
                htmlFor='select'
                className='block text-sm font-medium text-katalyx-text mb-1'
              >
                Liste déroulante
              </label>
              <select
                id='select'
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-katalyx-primary focus:border-katalyx-primary'
              >
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
          <div className='space-y-6'>
            <div>
              <label
                htmlFor='textarea'
                className='block text-sm font-medium text-katalyx-text mb-1'
              >
                Zone de texte
              </label>
              <textarea
                id='textarea'
                rows={4}
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-katalyx-primary focus:border-katalyx-primary'
                placeholder='Entrez un paragraphe'
              ></textarea>
            </div>
            <div>
              <div className='flex items-center mb-2'>
                <input
                  type='checkbox'
                  id='checkbox'
                  className='h-4 w-4 text-katalyx-primary border-gray-300 rounded focus:ring-katalyx-primary'
                />
                <label
                  htmlFor='checkbox'
                  className='ml-2 block text-sm text-katalyx-text'
                >
                  Case à cocher
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  type='radio'
                  id='radio'
                  name='radio-group'
                  className='h-4 w-4 text-katalyx-primary border-gray-300 focus:ring-katalyx-primary'
                />
                <label
                  htmlFor='radio'
                  className='ml-2 block text-sm text-katalyx-text'
                >
                  Bouton radio
                </label>
              </div>
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
          <span className='px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800'>
            Brouillon
          </span>
          <span className='px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
            Envoyé
          </span>
          <span className='px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
            Signé
          </span>
          <span className='px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'>
            Refusé
          </span>
          <span className='px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
            En attente
          </span>
          <span className='px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
            En révision
          </span>
        </div>
      </section>
    </div>
  );
}
