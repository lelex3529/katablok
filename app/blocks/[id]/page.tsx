import { getServerBlock } from '@/features/blocks/services/blockService';
import EditBlockClient from '@/features/blocks/components/EditBlockClient';
import { notFound } from 'next/navigation';

export default async function EditBlockPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // Server-side data fetching
  let initialBlock;
  try {
    initialBlock = await getServerBlock(id);
  } catch (error) {
    // We'll let the client component handle the error display
    console.error('Failed to fetch block:', error);
  }

  // Check if the block exists
  if (!initialBlock && process.env.NODE_ENV === 'production') {
    // In production, we can return a 404 page
    notFound();
  }

  return (
    <EditBlockClient blockId={id} initialBlock={initialBlock || undefined} />
  );
}
