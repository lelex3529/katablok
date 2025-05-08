import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/proposals/[id] - Get a single proposal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const proposal = await prisma.proposal.findUnique({
      where: { id },
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

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}

// PUT /api/proposals/[id] - Update a proposal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    
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
    
    // Check if proposal exists
    const existingProposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            blocks: true
          }
        }
      }
    });

    if (!existingProposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    // Start a transaction to update the proposal
    const updatedProposal = await prisma.$transaction(async (tx) => {
      // 1. Update basic proposal data
      const proposal = await tx.proposal.update({
        where: { id },
        data: {
          title: data.title,
          clientName: data.clientName,
        },
      });

      // 2. Handle sections: delete those not in the updated data
      const newSectionIds = data.sections.map((section: any) => section.id).filter(Boolean);
      
      // Delete sections that are not in the updated sections array
      await tx.proposalSection.deleteMany({
        where: {
          proposalId: id,
          id: {
            notIn: newSectionIds,
          },
        },
      });

      // 3. Update or create sections
      for (const section of data.sections) {
        if (section.id && section.id.startsWith('section-')) {
          // This is a new section (client-side ID), create it
          await tx.proposalSection.create({
            data: {
              id: undefined, // Let the database generate an ID
              title: section.title,
              order: section.order,
              proposalId: id,
              blocks: {
                create: section.blocks.map((block: any, blockIndex: number) => ({
                  blockId: block.blockId,
                  order: block.order || blockIndex,
                  overrideTitle: block.overrides?.title,
                  overrideContent: block.overrides?.content,
                  overrideUnitPrice: block.overrides?.unitPrice,
                  overrideDuration: block.overrides?.estimatedDuration
                }))
              }
            },
          });
        } else if (section.id) {
          // This is an existing section, update it
          await tx.proposalSection.update({
            where: { id: section.id },
            data: {
              title: section.title,
              order: section.order,
            },
          });

          // 4. Handle blocks in this section
          const newBlockIds = section.blocks.map((block: any) => block.id).filter(Boolean);
          
          // Delete blocks that are not in the updated blocks array
          await tx.proposalBlock.deleteMany({
            where: {
              sectionId: section.id,
              id: {
                notIn: newBlockIds,
              },
            },
          });

          // Update or create blocks
          for (const block of section.blocks) {
            if (block.id && block.id.startsWith('block-')) {
              // This is a new block (client-side ID), create it
              await tx.proposalBlock.create({
                data: {
                  id: undefined, // Let the database generate an ID
                  blockId: block.blockId,
                  sectionId: section.id,
                  order: block.order,
                  overrideTitle: block.overrides?.title,
                  overrideContent: block.overrides?.content,
                  overrideUnitPrice: block.overrides?.unitPrice,
                  overrideDuration: block.overrides?.estimatedDuration
                },
              });
            } else if (block.id) {
              // This is an existing block, update it
              await tx.proposalBlock.update({
                where: { id: block.id },
                data: {
                  order: block.order,
                  overrideTitle: block.overrides?.title,
                  overrideContent: block.overrides?.content,
                  overrideUnitPrice: block.overrides?.unitPrice,
                  overrideDuration: block.overrides?.estimatedDuration
                },
              });
            }
          }
        }
      }

      // 5. Return the updated proposal with all its relations
      return tx.proposal.findUnique({
        where: { id },
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
    });

    return NextResponse.json(updatedProposal);
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to update proposal' },
      { status: 500 }
    );
  }
}

// DELETE /api/proposals/[id] - Delete a proposal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if proposal exists
    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    // Delete the proposal (cascade will handle sections and blocks)
    await prisma.proposal.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json(
      { error: 'Failed to delete proposal' },
      { status: 500 }
    );
  }
}