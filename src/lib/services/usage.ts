import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function checkUsage(userId: string): Promise<{ used: number; limit: number; canGenerate: boolean }> {
  const userRef = adminDb.collection('users').doc(userId);
  const doc = await userRef.get();
  
  if (!doc.exists) {
    // Free plan default limits: 5 generations
    return { canGenerate: true, limit: 5, used: 0 };
  }
  
  const data = doc.data();
  const limit = data?.usage_limit || 5;
  const used = data?.monthly_usage || 0;
  
  return {
    canGenerate: used < limit,
    limit,
    used
  };
}

export async function incrementUsage(userId: string) {
  const userRef = adminDb.collection('users').doc(userId);
  await userRef.set({
    monthly_usage: FieldValue.increment(1)
  }, { merge: true });
}

// Function meant to be called via cron/scheduled task
export async function resetMonthlyUsage(): Promise<void> {
  const usersSnapshot = await adminDb.collection('users').where('monthly_usage', '>', 0).get();
  const batch = adminDb.batch();
  
  usersSnapshot.forEach((doc) => {
    batch.update(doc.ref, { monthly_usage: 0 });
  });

  await batch.commit();
}
