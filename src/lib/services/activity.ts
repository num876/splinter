import { adminDb } from '@/lib/firebase/admin';

export async function logActivity(userId: string, type: 'generate' | 'edit' | 'delete' | 'extract', description: string) {
  if (process.env.NODE_ENV === 'development' && userId === 'mock-user-123') {
    console.log(`[Activity Log] ${type}: ${description}`);
    return;
  }
  
  try {
    const activityRef = adminDb.collection('activities').doc();
    await activityRef.set({
      id: activityRef.id,
      user_id: userId,
      type,
      description,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
