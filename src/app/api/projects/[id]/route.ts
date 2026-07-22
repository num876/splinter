import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { logActivity } from '@/lib/services/activity';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

    const projectId = params.id;

    const projectDoc = await adminDb.collection('projects').doc(projectId).get();
    
    if (!projectDoc.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const data = projectDoc.data();
    
    // Ensure the project belongs to the user
    if (data?.user_id !== userId && userId !== 'mock-user-123') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch outputs
    const outputsSnap = await adminDb.collection(`projects/${projectId}/outputs`).get();
    const outputs = outputsSnap.docs.map(o => ({ id: o.id, ...o.data() }));

    const project = {
      id: projectDoc.id,
      ...data,
      created_at: data?.created_at?.toDate().toISOString() || new Date().toISOString(),
      updated_at: data?.updated_at?.toDate().toISOString() || new Date().toISOString(),
      outputs
    };

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error('Project GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    const projectId = params.id;
    const projectRef = adminDb.collection('projects').doc(projectId);
    const projectDoc = await projectRef.get();
    
    if (!projectDoc.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (projectDoc.data()?.user_id !== userId && userId !== 'mock-user-123') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete outputs subcollection first
    const outputsSnap = await adminDb.collection(`projects/${projectId}/outputs`).get();
    const batch = adminDb.batch();
    outputsSnap.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete project
    batch.delete(projectRef);
    await batch.commit();

    await logActivity(userId, 'delete', `Deleted project "${projectDoc.data()?.title || 'Unknown'}"`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Project DELETE error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete project' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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

    const projectId = params.id;
    const body = await req.json();
    const { format, content } = body;

    if (!format || typeof content !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const projectDoc = await adminDb.collection('projects').doc(projectId).get();
    
    if (!projectDoc.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (projectDoc.data()?.user_id !== userId && userId !== 'mock-user-123') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const outputsSnap = await adminDb.collection(`projects/${projectId}/outputs`).where('format', '==', format).get();
    
    if (outputsSnap.empty) {
      return NextResponse.json({ error: 'Output not found' }, { status: 404 });
    }

    const outputDoc = outputsSnap.docs[0];
    await outputDoc.ref.update({
      content,
      is_edited: true,
      updated_at: new Date()
    });

    await logActivity(userId, 'edit', `Edited ${format} in project "${projectDoc.data()?.title || 'Unknown'}"`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Project PATCH error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update project' },
      { status: 500 }
    );
  }
}
