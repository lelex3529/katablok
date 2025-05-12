import { NextRequest, NextResponse } from 'next/server';
import {
  generateProposalPdf,
  getProposalPdfFilename,
} from '@/features/proposals/pdf/generateProposalPdf';
import prisma from '@/lib/prisma';

type Params = Promise<{ id: string }>;

/**
 * API handler to generate and download a PDF of a proposal
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const { id: proposalId } = await params;

    // Fetch the proposal with all its sections and blocks
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        sections: {
          include: {
            blocks: {
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
        { status: 404 },
      );
    }

    // Generate the PDF
    const pdfBuffer = await generateProposalPdf(proposal);

    // Get a sanitized filename
    const filename = getProposalPdfFilename(proposal);

    // Set the appropriate headers for file download
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    // Return the PDF as a downloadable file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 },
    );
  }
}
