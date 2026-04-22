/**
 * Demo hooks used by Patterns stories that want to exercise the MSW mock
 * backend. They intentionally stay tiny - the *point* is to show how a
 * real hook composes with native-ui components (loading / error / data),
 * not to replicate react-query.
 *
 * Path: `apps/storybook/.storybook/msw/hooks.ts`
 */
import { useEffect, useState } from 'react';
import { API_BASE } from './handlers';

export type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: T };

/**
 * Minimal fetch hook: kicks off on mount, reacts to `key` changes.
 * Intentionally bare - no abort, no retry - so stories stay readable.
 */
export function useFetch<T>(path: string, key: unknown = 0): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: 'idle' });
  useEffect(() => {
    let alive = true;
    setState({ status: 'loading' });
    fetch(`${API_BASE}${path}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { message?: string };
          throw new Error(body.message ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<T>;
      })
      .then((data) => {
        if (alive) setState({ status: 'success', data });
      })
      .catch((err: Error) => {
        if (alive) setState({ status: 'error', error: err.message });
      });
    return () => {
      alive = false;
    };
  }, [path, key]);
  return state;
}

/**
 * Async POST helper for form-submit stories. Returns a ready-to-call
 * `submit` plus the current submission state.
 */
export function usePost<TBody extends object, TRes = unknown>(path: string) {
  const [state, setState] = useState<FetchState<TRes>>({ status: 'idle' });
  const submit = async (body: TBody) => {
    setState({ status: 'loading' });
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string } & TRes;
      if (!res.ok) throw new Error(json.message ?? `HTTP ${res.status}`);
      setState({ status: 'success', data: json });
      return { ok: true as const, data: json };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setState({ status: 'error', error: message });
      return { ok: false as const, error: message };
    }
  };
  return { state, submit };
}
