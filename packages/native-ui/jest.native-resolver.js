/*
 * Jest resolver for the `native` project (see jest.config.js).
 *
 * Jest accepts a single `resolver`, but two packages need one:
 * - `@react-native/jest-preset` strips `react-native`'s package `exports` so
 *   its internal subpaths stay resolvable and mockable.
 * - `react-native-reanimated` (which wraps `react-native-worklets`'s resolver)
 *   resolves a few of its own modules to their JS implementations instead of
 *   `.native` ones, which need the native runtime and crash under Jest.
 * This chains them: Reanimated decides the request and options, then hands
 * the actual lookup to the React Native resolver.
 */
const resolveReactNative = require('@react-native/jest-preset/jest/resolver.js');
const resolveReanimated = require('react-native-reanimated/jest/resolver');

/** @type {import('jest-resolve').SyncResolver} */
module.exports = (request, options) =>
  resolveReanimated(request, {
    ...options,
    defaultResolver: (nextRequest, nextOptions) =>
      resolveReactNative(nextRequest, {
        ...nextOptions,
        defaultResolver: options.defaultResolver,
      }),
  });
