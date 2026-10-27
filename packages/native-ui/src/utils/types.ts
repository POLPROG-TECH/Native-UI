/**
 * Writable view of `T`. React Native 0.87+ declares style types as readonly,
 * so primitives that assemble a style object key by key need a mutable draft
 * before handing it to React Native as a regular (readonly) style.
 */
export type Mutable<T> = { -readonly [K in keyof T]: T[K] };
