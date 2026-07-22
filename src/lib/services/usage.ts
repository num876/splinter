import { adminDb } from '../firebase/admin';
import * as admin from 'firebase-admin';

export async function checkUsage(userId: string): Promise<{ used: number; limit: number; canGenerate: boolean }> {
  const userDoc = await adminDb.collection('users').doc(userId).get();
  
  if (!userDoc.exists) {
    // Default fallback if user doc missing (e.g. they just signed up and trigger hasn't fired or doc wasn't created)
    return { used: 0, limit: 5, canGenerate: true };
  }

  const data = userDoc.data();
  const used = data?.monthly_usage || 0;
  const limit = data?.usage_limit || 5;
  const canGenerate = used < limit;

  return { used, limit, canGenerate };
}

export async function incrementUsage(userId: string): Promise<void> {
  const userRef = adminDb.collection('users').doc(userId);
  await userRef.set({
    monthly_usage: admin.firestore.FieldValue.increment(1)
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
