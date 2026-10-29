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
import { stringField, type JsonParser } from './json';

export type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: T };

/** The body of a failed or malformed response as an error, never as data. */
async function readJson<T>(res: Response, parse: JsonParser<T>): Promise<T> {
  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(stringField(body, 'message') ?? `HTTP ${res.status}`);
  }

  const data = parse(body);

  if (data === null) {
    throw new Error('Unexpected response shape');
  }

  return data;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

/**
 * Minimal fetch hook: kicks off on mount, reacts to `key` changes.
 * Intentionally bare - no abort, no retry - so stories stay readable.
 * `parse` checks the response body before it becomes `data`.
 */
export function useFetch<T>(path: string, parse: JsonParser<T>, key: unknown = 0): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: 'idle' });
  useEffect(() => {
    let alive = true;
    setState({ status: 'loading' });
    fetch(`${API_BASE}${path}`)
      .then((res) => readJson(res, parse))
      .then((data) => {
        if (alive) {
          setState({ status: 'success', data });
        }
      })
      .catch((error: unknown) => {
        if (alive) {
          setState({ status: 'error', error: messageOf(error) });
        }
      });

    return () => {
      alive = false;
    };
  }, [path, parse, key]);

  return state;
}

/**
 * Async POST helper for form-submit stories. Returns a ready-to-call
 * `submit` plus the current submission state.
 */
export function usePost<TBody extends object, TRes>(path: string, parse: JsonParser<TRes>) {
  const [state, setState] = useState<FetchState<TRes>>({ status: 'idle' });
  const submit = async (body: TBody) => {
    setState({ status: 'loading' });
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await readJson(res, parse);

      setState({ status: 'success', data: json });

      return { ok: true as const, data: json };
    } catch (error) {
      const message = messageOf(error);
      setState({ status: 'error', error: message });

      return { ok: false as const, error: message };
    }
  };

  return { state, submit };
}
