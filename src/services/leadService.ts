import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, initAppCheck } from '../firebase';

export interface CheckoutLeadData {
  orderRefId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  companyName?: string;
  deliveryAddress?: string;
  paymentType?: string;
  itemsCount: number;
  totalWeightLbs: number;
  cartSubtotal: number;
  shippingCost: number;
  hotShotFee: number;
  grandTotal: number;
  hasMTR: boolean;
  source: string;
}

export interface ContactLeadData {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  projectType: string;
  logisticsPreference?: string;
  location?: string;
  bidReference?: string;
  projectDetails?: string;
  source?: string;
  [key: string]: any;
}

/**
 * Lazily records a custom fabrication quote request / contact lead in Firestore.
 * Initializes App Check if configured, without blocking main thread.
 */
export async function saveContactLead(leadData: ContactLeadData): Promise<void> {
  try {
    initAppCheck();
    if (db) {
      await addDoc(collection(db, 'contact_leads'), {
        ...leadData,
        createdAt: serverTimestamp(),
      });
    }
  } catch (err) {
    // Non-fatal analytics/CRM recording
    console.warn('[leadService] Firestore contact lead snapshot skipped:', err);
  }
}

/**
 * Lazily records a checkout lead in Firestore
 * Initializes App Check if configured, without blocking main thread.
 */
export async function saveCheckoutLead(leadData: CheckoutLeadData): Promise<void> {
  try {
    initAppCheck();
    if (db) {
      await addDoc(collection(db, 'checkout_leads'), {
        ...leadData,
        createdAt: serverTimestamp(),
      });
    }
  } catch (err) {
    // Non-fatal analytics/CRM recording
    console.warn('[leadService] Firestore lead snapshot skipped:', err);
  }
}
