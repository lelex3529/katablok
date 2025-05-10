import React from 'react';
import ReactMarkdown from 'react-markdown';

interface IntroductionPageProps {
  introduction: string;
  proposalId: string;
}

export default function IntroductionPage({
  introduction,
}: IntroductionPageProps) {
  if (!introduction?.trim()) return null;

  return (
    <div className='prose prose-gray max-w-none'>
      <ReactMarkdown>{introduction}</ReactMarkdown>
    </div>
  );
}
