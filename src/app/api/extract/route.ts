import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { extractContent } from '@/lib/services/extractor';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];
    
    // Allow mock bypass for local dev if token is missing but we're in dev mode
    let userId = null;
    if (token) {
      const decodedToken = await adminAuth.verifyIdToken(token);
      userId = decodedToken.uid;
    } else if (process.env.NODE_ENV === 'development') {
      userId = 'mock-user-123';
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { input } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const result = await extractContent(input);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Extract API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract content' },
      { status: 500 }
    );
  }
}
