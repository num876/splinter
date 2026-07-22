import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];
    
    let userId = null;
    let isMock = false;
    if (token) {
      const decodedToken = await adminAuth.verifyIdToken(token);
      userId = decodedToken.uid;
    } else if (process.env.NODE_ENV === 'development') {
      userId = 'mock-user-123';
      isMock = true;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isMock) {
      return NextResponse.json({ activities: [] }, { status: 200 });
    }

    const snapshot = await adminDb.collection('activities')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(20)
      .get();
      
    const activities = snapshot.docs.map(doc => doc.data());
    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    console.error('Activities GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
