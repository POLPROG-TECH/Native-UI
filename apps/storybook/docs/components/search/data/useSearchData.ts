import { useEffect, useState } from 'react';
import { loadStorybookIndex } from './storybookIndex';
import { buildUsageIndex, knownKeysOf } from '../tokens/tokenUsage';
import type { AsyncState, StorybookDocsIndex, TokenEntry, UsageIndex } from '../searchTypes';

/** Outcome of a finished load; "loading" is derived, not stored. */
type Settled<T> = { status: 'ready'; data: T } | { status: 'error' };

/** The data of a ready state, or null while loading, idle or failed. */
export function readyData<T>(state: AsyncState<T>): T | null {
  return state.status === 'ready' ? state.data : null;
}

/** Loads the Storybook index once, aborting the request on unmount. */
export function useStorybookIndex(): AsyncState<StorybookDocsIndex> {
  const [settled, setSettled] = useState<Settled<StorybookDocsIndex> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    loadStorybookIndex(controller.signal).then(
      (data) => setSettled({ status: 'ready', data }),
      () => {
        if (!controller.signal.aborted) {
          setSettled({ status: 'error' });
        }
      },
    );

    return () => controller.abort();
  }, []);

  return settled ?? { status: 'loading' };
}

/**
 * Scans component sources for token references. The sources module is large,
 * so it is imported only once `enabled` turns true (the first interaction)
 * and the component list is known.
 */
export function useTokenUsage(
  enabled: boolean,
  index: StorybookDocsIndex | null,
  tokens: readonly TokenEntry[],
): AsyncState<UsageIndex> {
  const [settled, setSettled] = useState<Settled<UsageIndex> | null>(null);
  const canLoad = enabled && index !== null;

  useEffect(() => {
    if (!enabled || index === null) {
      return;
    }

    let active = true;

    /* Building runs in its own step so a malformed module lands in the error branch. */
    import('../tokens/tokenUsageSources')
      .then(({ loadUsageSources }) =>
        buildUsageIndex(index.components, loadUsageSources(), knownKeysOf(tokens)),
      )
      .then(
        (data) => {
          if (active) {
            setSettled({ status: 'ready', data });
          }
        },
        () => {
          if (active) {
            setSettled({ status: 'error' });
          }
        },
      );

    return () => {
      active = false;
    };
  }, [enabled, index, tokens]);

  if (settled !== null) {
    return settled;
  }

  return canLoad ? { status: 'loading' } : { status: 'idle' };
}
