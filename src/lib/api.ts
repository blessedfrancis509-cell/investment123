export type ServerState = Record<string, any>;

import type { SupportConversation } from '../types';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  country: string;
  phone: string;
  dob: string;
  referrer: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  account?: any;
  role?: 'user' | 'admin';
  token?: string;
}

const TOKEN_KEY = 'xena_auth_token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable
  }
}

export async function getState(): Promise<ServerState | null> {
  try {
    const res = await fetch('/api/state', { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return (await res.json()) as ServerState;
  } catch {
    return null;
  }
}

export async function saveState(payload: ServerState | string): Promise<boolean> {
  try {
    const res = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof payload === 'string' ? payload : JSON.stringify(payload),
    });
    if (!res.ok) return false;
    await res.json();
    return true;
  } catch {
    return false;
  }
}

async function post(path: string, body: unknown): Promise<any | null> {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return { status: res.status, data };
  } catch {
    return null;
  }
}

export async function registerAccount(input: RegisterInput): Promise<AuthResult> {
  const out = await post('/api/register', input);
  if (!out) return { ok: false, error: 'Network error. Please try again.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to create account.' };
  if (out.data.token) setAuthToken(out.data.token);
  return { ok: true, account: out.data.account, token: out.data.token };
}

export async function loginAccount(email: string, password: string): Promise<AuthResult> {
  const out = await post('/api/login', { email, password });
  if (!out) return { ok: false, error: 'Network error. Please try again.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to sign in.' };
  if (out.data.token) setAuthToken(out.data.token);
  return { ok: true, account: out.data.account, role: out.data.role, token: out.data.token };
}

export async function saveAccount(updates: unknown): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;
  const out = await post('/api/account/save', { token, updates });
  return !!(out && out.data && out.data.ok);
}

export async function changeAccountPassword(currentPassword: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
  const token = getAuthToken();
  if (!token) return { ok: false, error: 'You must be signed in to change your password.' };
  const out = await post('/api/account/password', { token, currentPassword, newPassword });
  if (!out) return { ok: false, error: 'Network error. Please try again.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to change password.' };
  return { ok: true };
}

// ---------- P2P Listings & Payment Validation ----------
export async function submitP2POffer(offer: Record<string, unknown>): Promise<{ ok: boolean; error?: string; offer?: Record<string, unknown> }> {
  const token = getAuthToken();
  const out = await post('/api/p2p/offer', { token, offer });
  if (!out) return { ok: false, error: 'Network error. Please try again.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to submit ad.' };
  return { ok: true, offer: out.data.offer };
}

export async function approveP2POffer(offerId: string): Promise<{ ok: boolean; error?: string }> {
  const token = getAuthToken();
  const out = await post('/api/p2p/offer/approve', { token, offerId });
  if (!out) return { ok: false, error: 'Network error.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to approve.' };
  return { ok: true };
}

export async function rejectP2POffer(offerId: string): Promise<{ ok: boolean; error?: string }> {
  const token = getAuthToken();
  const out = await post('/api/p2p/offer/reject', { token, offerId });
  if (!out) return { ok: false, error: 'Network error.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to reject.' };
  return { ok: true };
}

export async function submitP2PPayment(trade: Record<string, unknown>): Promise<{ ok: boolean; error?: string; trade?: Record<string, unknown> }> {
  const token = getAuthToken();
  const out = await post('/api/p2p/payment', { token, trade });
  if (!out) return { ok: false, error: 'Network error. Please try again.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to submit payment.' };
  return { ok: true, trade: out.data.trade };
}

export async function approveP2PPayment(tradeId: string): Promise<{ ok: boolean; error?: string; credited?: boolean }> {
  const token = getAuthToken();
  const out = await post('/api/p2p/payment/approve', { token, tradeId });
  if (!out) return { ok: false, error: 'Network error.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to approve payment.' };
  return { ok: true, credited: !!out.data.credited };
}

export async function rejectP2PPayment(tradeId: string): Promise<{ ok: boolean; error?: string }> {
  const token = getAuthToken();
  const out = await post('/api/p2p/payment/reject', { token, tradeId });
  if (!out) return { ok: false, error: 'Network error.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to reject payment.' };
  return { ok: true };
}

export function clearAuthToken() {
  setAuthToken(null);
}

// ---------- Admin: Set XENA Price ----------
export async function setXenaPrice(price: number): Promise<{ ok: boolean; error?: string; price?: number }> {
  const token = getAuthToken();
  if (!token) return { ok: false, error: 'You must be signed in.' };
  const out = await post('/api/admin/price', { token, price });
  if (!out) return { ok: false, error: 'Network error.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to update price.' };
  return { ok: true, price: out.data.price };
}

// ---------- Admin: Delete User Account ----------
export async function deleteUserAccount(targetEmail: string): Promise<{ ok: boolean; error?: string }> {
  const token = getAuthToken();
  if (!token) return { ok: false, error: 'You must be signed in.' };
  const out = await post('/api/admin/delete-account', { token, targetEmail });
  if (!out) return { ok: false, error: 'Network error.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to delete account.' };
  return { ok: true };
}

// ---------- Support Conversations ----------
export async function getSupportConversations(): Promise<{ ok: boolean; error?: string; conversations?: SupportConversation[] }> {
  const token = getAuthToken();
  if (!token) return { ok: false, error: 'You must be signed in.' };
  const out = await post('/api/support/conversations', { token });
  if (!out) return { ok: false, error: 'Network error.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to load conversations.' };
  return { ok: true, conversations: out.data.conversations };
}

export async function sendSupportMessage(text: string): Promise<{ ok: boolean; error?: string; conversation?: SupportConversation }> {
  const token = getAuthToken();
  if (!token) return { ok: false, error: 'You must be signed in.' };
  const out = await post('/api/support/messages', { token, text });
  if (!out) return { ok: false, error: 'Network error.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to send message.' };
  return { ok: true, conversation: out.data.conversation };
}

export async function replySupportConversation(email: string, text: string): Promise<{ ok: boolean; error?: string; conversation?: SupportConversation }> {
  const token = getAuthToken();
  if (!token) return { ok: false, error: 'You must be signed in.' };
  const out = await post('/api/support/reply', { token, email, text });
  if (!out) return { ok: false, error: 'Network error.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to send reply.' };
  return { ok: true, conversation: out.data.conversation };
}

export async function resolveSupportConversation(conversationId: string, status: 'open' | 'resolved'): Promise<{ ok: boolean; error?: string }> {
  const token = getAuthToken();
  if (!token) return { ok: false, error: 'You must be signed in.' };
  const out = await post('/api/support/resolve', { token, conversationId, status });
  if (!out) return { ok: false, error: 'Network error.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to update conversation.' };
  return { ok: true };
}

// ---------- Admin: Adjust User Balance ----------
export async function adjustUserBalance(targetEmail: string, amount: number, memo?: string): Promise<{ ok: boolean; error?: string; newBalance?: number }> {
  const token = getAuthToken();
  if (!token) return { ok: false, error: 'You must be signed in.' };
  const out = await post('/api/admin/adjust-balance', { token, targetEmail, amount, memo });
  if (!out) return { ok: false, error: 'Network error.' };
  if (!out.data.ok) return { ok: false, error: out.data.error || 'Unable to adjust balance.' };
  return { ok: true, newBalance: out.data.newBalance };
}