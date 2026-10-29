import { useCallback, useEffect, useRef, useState } from 'react';

export type CopyStatus = 'idle' | 'copied' | 'failed';

/** Writes to the clipboard; the API is missing outside secure contexts, which also reads as a failure. */
async function writeClipboard(value: string): Promise<Exclude<CopyStatus, 'idle'>> {
  try {
    await navigator.clipboard.writeText(value);

    return 'copied';
  } catch {
    return 'failed';
  }
}

/**
 * Copies a value and shows the outcome for `resetMs`, then resets. Shared by
 * the Search page and the component docs import snippet.
 */
export function useCopyFeedback(resetMs: number): {
  status: CopyStatus;
  copy: (value: string) => Promise<CopyStatus>;
} {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copy = useCallback(
    async (value: string) => {
      const outcome = await writeClipboard(value);

      window.clearTimeout(resetTimer.current);
      setStatus(outcome);
      resetTimer.current = window.setTimeout(() => setStatus('idle'), resetMs);

      return outcome;
    },
    [resetMs],
  );

  return { status, copy };
}
