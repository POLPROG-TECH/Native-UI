/// <reference types="vite/client" />

// Explicit declarations for the exact @fontsource deep specifiers with a `?url`
// query. `vite/client` declares the generic `*?url` wildcard, but TypeScript's
// ambient-module matcher won't combine a scoped deep path with a query string
// reliably, so we enumerate the four weights we actually import.
declare module '@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2?url' {
  const url: string;
  export default url;
}
declare module '@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2?url' {
  const url: string;
  export default url;
}
declare module '@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2?url' {
  const url: string;
  export default url;
}
declare module '@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2?url' {
  const url: string;
  export default url;
}
