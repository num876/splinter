import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];
    
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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const snapshot = await adminDb
      .collection('projects')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .get();

    const projects = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Fetch outputs for this project (subcollection)
      const outputsSnap = await adminDb.collection(`projects/${doc.id}/outputs`).get();
      const outputs = outputsSnap.docs.map(o => ({ id: o.id, ...o.data() }));

      // Handle Timestamp serialization for client
      projects.push({
        id: doc.id,
        ...data,
        created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
        updated_at: data.updated_at?.toDate().toISOString() || new Date().toISOString(),
        outputs
      });
    }

    // Also fetch usage
    let usage = { used: 0, limit: 5 };
    if (userId !== 'mock-user-123') {
      const userDoc = await adminDb.collection('users').doc(userId).get();
      if (userDoc.exists) {
        usage = {
          used: userDoc.data()?.monthly_usage || 0,
          limit: userDoc.data()?.usage_limit || 5
        };
      }
    }

    return NextResponse.json({ projects, count: projects.length, usage }, { status: 200 });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
