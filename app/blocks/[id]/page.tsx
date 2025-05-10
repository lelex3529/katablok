import { getServerBlock } from '@/features/blocks/services/blockService';
import EditBlockClient from '@/features/blocks/components/EditBlockClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Block | Katalyx Proposals',
};

type Params = Promise<{ id: string }>;

export default async function EditBlockPage({ params }: { params: Params }) {
  const { id } = await params;

  let initialBlock = null;
  try {
    initialBlock = await getServerBlock(id);
  } catch (error) {
    console.error('Failed to fetch block:', error);
  }

  if (!initialBlock && process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <EditBlockClient blockId={id} initialBlock={initialBlock || undefined} />
  );
}
