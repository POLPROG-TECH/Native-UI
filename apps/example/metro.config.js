/*
 * Expo's default config already understands the npm workspace: it watches the
 * monorepo root and resolves `@polprog/native-ui` through the package's
 * `react-native` export condition, so the app runs the library sources.
 */
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);
