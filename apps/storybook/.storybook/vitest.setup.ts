/**
 * react-native-web's Animated reads the Node-style `global` at runtime.
 * Storybook's dev server defines it; the Vitest browser run does not.
 * Preview annotations need no setup here: since Storybook 10.3 the Vitest
 * addon applies them automatically.
 */
Object.assign(globalThis, { global: globalThis });
