export type ServerState = Record<string, any>;

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