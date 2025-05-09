import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProposalSection, ProposalBlock } from '@/features/proposals/types/Proposal';

// GET /api/proposals - Get all proposals
export async function GET() {
  try {
    const proposals = await prisma.proposal.findMany({
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
          include: {
            blocks: {
              orderBy: {
                order: 'asc',
              },
              include: {
                block: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

// POST /api/proposals - Create a new proposal
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received proposal data:', JSON.stringify(data));
    
    // Validate required fields
    const requiredFields = ['title', 'clientName', 'sections'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create proposal using a transaction for data integrity
    const proposal = await prisma.$transaction(async (tx) => {
      // 1. Create the proposal
      const newProposal = await tx.proposal.create({
        data: {
          title: data.title,
          clientName: data.clientName,
          status: 'draft',
        },
      });

      // 2. Create sections
      for (const section of data.sections as Partial<ProposalSection>[]) {
        const newSection = await tx.proposalSection.create({
          data: {
            title: section.title as string,
            order: section.order as number,
            proposalId: newProposal.id,
          },
        });

        // 3. Create blocks for this section
        if (section.blocks && section.blocks.length > 0) {
          for (const block of section.blocks as Partial<ProposalBlock>[]) {
            await tx.proposalBlock.create({
              data: {
                blockId: block.blockId as string,
                sectionId: newSection.id,
                order: block.order || 0,
                overrideTitle: block.overrideTitle || block.overrides?.title,
                overrideContent: block.overrideContent || block.overrides?.content,
                overrideUnitPrice: block.overrideUnitPrice || block.overrides?.unitPrice,
                overrideDuration: block.overrideDuration || block.overrides?.estimatedDuration,
              },
            });
          }
        }
      }

      // 4. Return the created proposal with relations
      return tx.proposal.findUnique({
        where: { id: newProposal.id },
        include: {
          sections: {
            orderBy: { order: 'asc' },
            include: {
              blocks: {
                orderBy: { order: 'asc' },
                include: { block: true },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: `Failed to create proposal: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}