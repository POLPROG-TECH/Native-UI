/*
 * Ambient module declarations cannot import relative types, so the virtual
 * module is typed `unknown` and validated in tokenUsageSources.ts.
 */
declare module 'virtual:nui-token-refs' {
  /** Served by .storybook/tokenRefsPlugin.ts. */
  export const USAGE_SOURCES: unknown;
}
