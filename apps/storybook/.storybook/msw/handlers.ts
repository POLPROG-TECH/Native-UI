/**
 * MSW request handlers for Storybook stories.
 *
 * The goal is NOT to mirror a real backend - it is to give Patterns
 * stories a realistic network surface so reviewers can exercise real
 * loading / error / empty flows instead of manually flipping `args`.
 *
 * Conventions
 * -----------
 * - All demo endpoints live under `https://api.polprog.dev/*` so handlers
 *   are obvious in DevTools.
 * - Each story that needs overrides sets `parameters.msw.handlers` - these
 *   are layered **on top** of the defaults.
 * - Artificial delay is applied only where the loading state is the point
 *   of the story (`LoadingStates.*`); other stories resolve quickly.
 */
import { http, HttpResponse, delay } from 'msw';

const BASE = 'https://api.polprog.dev';

/** A tiny, deterministic list of entries used across multiple stories. */
export const DEMO_ENTRIES = [
  { id: 'e1', title: 'Groceries', amount: 47.8, date: '2026-04-20', category: 'food' },
  { id: 'e2', title: 'Gym', amount: 120, date: '2026-04-19', category: 'health' },
  { id: 'e3', title: 'Netflix', amount: 55, date: '2026-04-18', category: 'entertainment' },
  { id: 'e4', title: 'Espresso', amount: 14.5, date: '2026-04-18', category: 'food' },
  { id: 'e5', title: 'Metro', amount: 22, date: '2026-04-17', category: 'transport' },
];

export const DEMO_CATEGORIES = [
  { value: 'food', label: 'Food' },
  { value: 'health', label: 'Health' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'transport', label: 'Transport' },
  { value: 'utilities', label: 'Utilities' },
];

/** Happy-path defaults. Stories override these via `parameters.msw.handlers`. */
export const defaultHandlers = [
  http.get(`${BASE}/entries`, async () => {
    await delay(600);
    return HttpResponse.json(DEMO_ENTRIES);
  }),

  http.get(`${BASE}/categories`, async () => {
    await delay(200);
    return HttpResponse.json(DEMO_CATEGORIES);
  }),

  http.post(`${BASE}/entries`, async ({ request }) => {
    const body = (await request.json()) as { title?: string; amount?: number };
    if (!body.title || typeof body.amount !== 'number') {
      return HttpResponse.json(
        { message: 'title and amount are required' },
        { status: 422 },
      );
    }
    await delay(800);
    return HttpResponse.json(
      { id: `e-${Date.now()}`, ...body, date: new Date().toISOString().slice(0, 10) },
      { status: 201 },
    );
  }),

  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    await delay(900);
    if (body.password === 'wrong') {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    if (!body.email || !body.password) {
      return HttpResponse.json({ message: 'Missing credentials' }, { status: 400 });
    }
    return HttpResponse.json({ token: 'demo-jwt', user: { email: body.email } });
  }),
];

/**
 * Helper factories for stories that need one-off overrides.
 * Re-exporting keeps story files free of deep msw imports.
 */
export const mockEndpoints = {
  /** Return an empty list. Use for EmptyState patterns. */
  entriesEmpty: () =>
    http.get(`${BASE}/entries`, async () => {
      await delay(500);
      return HttpResponse.json([]);
    }),

  /** Return a 500 error. Use for Error patterns. */
  entriesError: () =>
    http.get(`${BASE}/entries`, async () => {
      await delay(500);
      return HttpResponse.json({ message: 'Upstream unavailable' }, { status: 500 });
    }),

  /** Never resolve. Use for infinite-loading screenshots. */
  entriesPending: () =>
    http.get(`${BASE}/entries`, async () => {
      await delay('infinite');
      return HttpResponse.json([]);
    }),

  /** Return a slow response to exercise skeleton animations. */
  entriesSlow: (ms = 3000) =>
    http.get(`${BASE}/entries`, async () => {
      await delay(ms);
      return HttpResponse.json(DEMO_ENTRIES);
    }),

  /** Simulate a 401 on login. */
  loginUnauthorized: () =>
    http.post(`${BASE}/auth/login`, async () => {
      await delay(600);
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }),
};

export const API_BASE = BASE;
