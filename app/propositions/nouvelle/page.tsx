'use client';

import { useState } from 'react';
import {
  ArrowLeftIcon,
  BoltIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NewProposal() {
  const [captationContent, setCaptationContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaptationContent(e.target.value);
  };

  const analyzeWithAI = () => {
    if (!captationContent.trim()) return;

    setIsAnalyzing(true);

    // Simuler un appel API (nous n'implémentons pas la logique réelle ici)
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(
        `# Proposition Commerciale : ${captationContent.slice(0, 30)}...

## Sommaire
1. Présentation de notre offre
2. Bénéfices pour votre entreprise
3. Méthodologie proposée
4. Planning prévisionnel
5. Budget détaillé
6. Conditions générales

*Ce contenu est généré automatiquement à partir de votre dossier de captation. Vous pouvez l'éditer avant de finaliser votre proposition.*`,
      );
    }, 2000);
  };

  return (
    <div className='space-y-10'>
      {/* En-tête */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <Link
            href='/'
            className='inline-flex items-center text-katalyx-neutral-gray hover:text-katalyx-primary mb-3'
          >
            <ArrowLeftIcon className='h-4 w-4 mr-1' />
            <span>Retour au tableau de bord</span>
          </Link>
          <h1 className='text-2xl md:text-3xl font-bold font-sora bg-clip-text text-transparent bg-gradient-to-r from-katalyx-primary to-katalyx-primary-light'>
            Nouvelle proposition
          </h1>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Dossier de captation */}
        <div className='bg-white rounded-2xl shadow-card p-8 border border-gray-100 relative overflow-hidden'>
          {/* Decorative accent */}
          <div className='absolute top-0 right-0 w-24 h-24 bg-katalyx-primary/5 rounded-full -mr-10 -mt-10'></div>

          <h2 className='text-xl font-sora font-semibold text-katalyx-text mb-4 relative z-10'>
            Dossier de captation
          </h2>
          <p className='text-katalyx-neutral-gray mb-6 relative z-10'>
            Copiez-collez votre dossier de captation ou rédigez les informations
            clients et besoins projet ci-dessous.
          </p>
          <textarea
            className='w-full h-64 p-5 border border-gray-200 rounded-xl focus:ring-katalyx-primary focus:border-katalyx-primary focus:outline-none shadow-sm font-inter text-gray-700'
            placeholder='Ex: Entreprise ABC recherche une refonte de son site web e-commerce. Le projet doit inclure un système de gestion de catalogue, un tunnel de vente optimisé et une intégration avec leur ERP...'
            value={captationContent}
            onChange={handleContentChange}
          ></textarea>

          <button
            className={`mt-6 bg-gradient-primary hover:shadow-button-hover text-white py-3 px-6 rounded-xl inline-flex items-center transition-all duration-300 ${
              !captationContent.trim()
                ? 'opacity-50 cursor-not-allowed'
                : 'shadow-button'
            }`}
            onClick={analyzeWithAI}
            disabled={!captationContent.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className='animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full'></div>
                <span>Analyse en cours...</span>
              </>
            ) : (
              <>
                <SparklesIcon className='h-5 w-5 mr-2' />
                <span>Analyser avec IA</span>
              </>
            )}
          </button>
        </div>

        {/* Résultat d'analyse */}
        <div className='bg-white rounded-2xl shadow-card p-8 border border-gray-100 relative overflow-hidden'>
          {/* Decorative accent */}
          <div className='absolute top-0 left-0 w-24 h-24 bg-katalyx-secondary/5 rounded-full -ml-10 -mt-10'></div>

          <h2 className='text-xl font-sora font-semibold text-katalyx-text mb-4'>
            Résultat d&apos;analyse
          </h2>

          {!analysisResult ? (
            <div className='flex flex-col items-center justify-center h-64 text-center p-6 border border-dashed border-gray-300 rounded-xl'>
              <div className='h-16 w-16 rounded-full bg-katalyx-off-white flex items-center justify-center mb-4'>
                <BoltIcon className='h-8 w-8 text-gray-400' />
              </div>
              <p className='text-katalyx-neutral-gray mb-2'>
                Le contenu de votre proposition apparaîtra ici après analyse.
              </p>
              <p className='text-sm text-katalyx-neutral-gray'>
                Ajoutez d&apos;abord votre dossier de captation et cliquez sur
                &quot;Analyser avec IA&quot;.
              </p>
            </div>
          ) : (
            <>
              <div className='prose prose-katalyx h-64 overflow-y-auto p-5 border border-gray-200 rounded-xl mb-6 bg-katalyx-off-white shadow-sm'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: analysisResult.replace(/\n/g, '<br>'),
                  }}
                />
              </div>
              <div className='flex flex-wrap gap-4'>
                <button className='bg-gradient-secondary hover:shadow-secondary-button text-white py-3 px-6 rounded-xl inline-flex items-center shadow-sm transition-all duration-300'>
                  <EyeIcon className='h-5 w-5 mr-2' />
                  <span>Prévisualiser</span>
                </button>
                <button className='bg-gradient-tertiary hover:shadow-xl text-white py-3 px-6 rounded-xl inline-flex items-center shadow-sm transition-all duration-300'>
                  <ArrowDownTrayIcon className='h-5 w-5 mr-2' />
                  <span>Exporter en PDF</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
