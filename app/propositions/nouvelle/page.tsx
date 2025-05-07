'use client';

import { useState } from 'react';
import {
  ArrowLeftIcon,
  BoltIcon,
  ArrowDownTrayIcon,
  EyeIcon,
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
    <div className='space-y-6'>
      {/* En-tête */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <Link
            href='/'
            className='inline-flex items-center text-katalyx-neutral-gray hover:text-katalyx-primary mb-2'
          >
            <ArrowLeftIcon className='h-4 w-4 mr-1' />
            <span>Retour au tableau de bord</span>
          </Link>
          <h1 className='text-2xl md:text-3xl font-bold text-katalyx-text font-sora'>
            Nouvelle proposition
          </h1>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Dossier de captation */}
        <div className='bg-white rounded-lg shadow-card p-6'>
          <h2 className='text-xl font-sora font-semibold text-katalyx-text mb-4'>
            Dossier de captation
          </h2>
          <p className='text-katalyx-neutral-gray mb-4'>
            Copiez-collez votre dossier de captation ou rédigez les informations
            clients et besoins projet ci-dessous.
          </p>
          <textarea
            className='w-full h-64 p-4 border border-gray-200 rounded-md focus:ring-katalyx-primary focus:border-katalyx-primary'
            placeholder='Ex: Entreprise ABC recherche une refonte de son site web e-commerce. Le projet doit inclure un système de gestion de catalogue, un tunnel de vente optimisé et une intégration avec leur ERP...'
            value={captationContent}
            onChange={handleContentChange}
          ></textarea>

          <button
            className={`mt-4 bg-katalyx-primary hover:bg-opacity-90 text-white py-3 px-6 rounded-md inline-flex items-center transition-colors ${
              !captationContent.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={analyzeWithAI}
            disabled={!captationContent.trim() || isAnalyzing}
          >
            <BoltIcon className='h-5 w-5 mr-2' />
            <span>
              {isAnalyzing ? 'Analyse en cours...' : 'Analyser avec IA'}
            </span>
          </button>
        </div>

        {/* Résultat d'analyse */}
        <div className='bg-white rounded-lg shadow-card p-6'>
          <h2 className='text-xl font-sora font-semibold text-katalyx-text mb-4'>
            Résultat d'analyse
          </h2>
          {!analysisResult ? (
            <div className='flex flex-col items-center justify-center h-64 text-center p-4 border border-dashed border-gray-300 rounded-md'>
              <p className='text-katalyx-neutral-gray mb-2'>
                Le contenu de votre proposition apparaîtra ici après analyse.
              </p>
              <p className='text-sm text-katalyx-neutral-gray'>
                Ajoutez d'abord votre dossier de captation et cliquez sur
                "Analyser avec IA".
              </p>
            </div>
          ) : (
            <>
              <div className='prose prose-katalyx h-64 overflow-y-auto p-4 border border-gray-200 rounded-md mb-4'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: analysisResult.replace(/\n/g, '<br>'),
                  }}
                />
              </div>
              <div className='flex flex-wrap gap-3'>
                <button className='bg-katalyx-primary hover:bg-opacity-90 text-white py-2 px-4 rounded-md inline-flex items-center transition-colors'>
                  <EyeIcon className='h-5 w-5 mr-2' />
                  <span>Prévisualiser</span>
                </button>
                <button className='bg-katalyx-dark hover:bg-opacity-90 text-white py-2 px-4 rounded-md inline-flex items-center transition-colors'>
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
