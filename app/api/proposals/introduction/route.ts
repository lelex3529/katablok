import { NextRequest, NextResponse } from 'next/server';
import { generateProposalIntroduction, extractTextFromFile } from '@/lib/openai';

export const config = {
  api: {
    bodyParser: false, // We'll handle parsing using FormData
  },
};

export async function POST(request: NextRequest) {
  try {
    // Process the multipart form data submission
    const formData = await request.formData();
    const userText = formData.get('text') as string || '';
    const files = formData.getAll('files') as File[];
    
    if (!userText && files.length === 0) {
      return NextResponse.json({ error: 'Please provide text or upload files' }, { status: 400 });
    }
    
    // Extract text from all uploaded files
    const fileContentsPromises = files.map(file => extractTextFromFile(file));
    const fileContents = await Promise.all(fileContentsPromises);
    
    // Generate proposal introduction
    const result = await generateProposalIntroduction(userText, fileContents);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating proposal introduction:', error);
    return NextResponse.json(
      { error: 'Failed to generate proposal introduction' },
      { status: 500 }
    );
  }
}