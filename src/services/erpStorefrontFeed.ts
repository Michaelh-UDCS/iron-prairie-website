export type StorefrontCheckoutStatus = 'open' | 'cancelled' | 'expired' | 'completed' | 'paid';

export interface StorefrontCheckoutLine {
  partNumber: string;
  nps?: string | number;
  pressureClass?: string | number;
  material?: string;
  facing?: string;
  thickness?: string | number;
  quantity: number;
  unitPrice?: number;
  lineTotal?: number;
}

export interface StorefrontCheckoutRecord {
  id: string;
  orderRefId: string;
  stripeSessionId?: string;
  stripeStatus?: string;
  stripePaymentStatus?: string;
  status: StorefrontCheckoutStatus;
  companyName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  deliveryAddress?: string;
  paymentType?: string;
  cartItems: StorefrontCheckoutLine[];
  itemsSubtotal?: number;
  shippingCost?: number;
  hotShotFee?: number;
  totalAmount: number;
  createdAt: string | null;
  updatedAt?: string | null;
  cancelledAt?: string | null;
  source?: string;
  sources?: string[];
}

export interface ErpStorefrontFeed {
  ok: boolean;
  generatedAt: string;
  incomplete: StorefrontCheckoutRecord[];
  completed: StorefrontCheckoutRecord[];
  counts: {
    incomplete: number;
    completed: number;
    cancelled: number;
    expired: number;
    open: number;
  };
}

const OPS_SESSION_KEY = 'ipf_exec_auth_session';

export function getOpsKeyFromSession(): string | null {
  try {
    const raw = sessionStorage.getItem(OPS_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed.opsKey === 'string' && parsed.opsKey.trim() ? parsed.opsKey.trim() : null;
  } catch {
    return null;
  }
}

export async function fetchErpStorefrontFeed(opsKey: string): Promise<ErpStorefrontFeed> {
  const response = await fetch('/api/erp-storefront-feed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-IPG-Ops-Key': opsKey,
    },
    body: JSON.stringify({ opsKey }),
  });
  const payload = await response.json().catch(() => ({} as Record<string, unknown>));
  if (!response.ok) {
    throw new Error(typeof payload.error === 'string' ? payload.error : `Storefront feed failed (HTTP ${response.status}).`);
  }
  return payload as ErpStorefrontFeed;
}

export async function reportCheckoutCancelled(input: {
  orderRefId?: string;
  sessionId?: string;
  reason?: string;
}): Promise<void> {
  if (!input.orderRefId && !input.sessionId) return;
  try {
    await fetch('/api/mark-checkout-cancelled', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderRefId: input.orderRefId || '',
        sessionId: input.sessionId || '',
        reason: input.reason || 'buyer_cancelled',
      }),
      keepalive: true,
    });
  } catch (err) {
    console.warn('[Checkout] Failed to record cancellation (non-fatal):', err);
  }
}
