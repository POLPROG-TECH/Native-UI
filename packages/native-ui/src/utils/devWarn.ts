/**
 * The library's only console output: a development-time warning, prefixed
 * so it is easy to filter. Silent in production builds.
 */
export function devWarn(message: string): void {
  if (!__DEV__) {
    return;
  }

  /* eslint-disable-next-line no-console */
  console.warn(`[native-ui] ${message}`);
}
