import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { generateSingleOutput } from '@/lib/services/generator';
import { checkUsage, incrementUsage } from '@/lib/services/usage';
import { logActivity } from '@/lib/services/activity';
import { OutputFormat, Tone } from '@/lib/types';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
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

    const { content, title, formats, tone, projectId, sourceType, sourceUrl, customInstructions } = await req.json();

    if (!content || !formats || !Array.isArray(formats) || formats.length === 0) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!isMock) {
      const { canGenerate } = await checkUsage(userId);
      if (!canGenerate) {
        return NextResponse.json({ error: 'Usage limit exceeded' }, { status: 403 });
      }
    }

    let currentProjectId = projectId;
    let projectRef = null;
    let project: any = null;

    if (!isMock) {
      if (!currentProjectId) {
        // Create new project in Firestore
        projectRef = await adminDb.collection('projects').add({
          user_id: userId,
          title: title || 'New Project',
          source_type: sourceType || 'text',
          source_url: sourceUrl || null,
          source_content: content,
          tone: tone || 'professional',
          custom_instructions: customInstructions || null,
          status: 'completed',
          created_at: FieldValue.serverTimestamp(),
          updated_at: FieldValue.serverTimestamp(),
        });
        currentProjectId = projectRef.id;
        const projectDoc = await projectRef.get();
        project = { id: projectDoc.id, ...projectDoc.data() };
      } else {
        projectRef = adminDb.collection('projects').doc(currentProjectId);
        const projectDoc = await projectRef.get();
        if (!projectDoc.exists) {
          throw new Error('Project not found');
        }
        project = { id: projectDoc.id, ...projectDoc.data() };
      }
    } else {
      currentProjectId = 'mock-project-id';
      project = {
        id: currentProjectId,
        title: title || 'Mock Project',
      };
    }

    const generatedOutputs = [];

    // Generate outputs using Gemini
    for (const format of formats as OutputFormat[]) {
      try {
        const generatedContent = await generateSingleOutput(content, title, format, tone as Tone || 'professional', customInstructions);
        
        let outputRecord: any = {
          id: `mock-output-${format}`,
          project_id: currentProjectId,
          format,
          content: generatedContent,
          is_edited: false
        };

        if (!isMock && projectRef) {
          // Save output to Firestore subcollection
          const outputRef = await projectRef.collection('outputs').add({
            project_id: currentProjectId,
            format,
            content: generatedContent,
            is_edited: false,
            created_at: FieldValue.serverTimestamp(),
          });
          
          const doc = await outputRef.get();
          outputRecord = { id: doc.id, ...doc.data() };
        }
        
        generatedOutputs.push(outputRecord);
      } catch (genError) {
        console.error(`Generation error for ${format}:`, genError);
      }
    }

    if (!isMock) {
      await incrementUsage(userId);
      await logActivity(userId, 'generate', `Generated outputs for "${project.title}"`);
    }

    return NextResponse.json({ project, outputs: generatedOutputs }, { status: 200 });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate outputs' },
      { status: 500 }
    );
  }
}
