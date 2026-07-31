---
'@polprog/native-ui': patch
---

Add the `react-native` condition to the root `exports` entry so Metro resolves
the TypeScript source instead of the dist bundles. Metro in React Native 0.84
enables package exports by default, and an `exports` map takes precedence over
the top-level `react-native` field, so consumers were bundling both dist
flavours (.mjs and .js) at once and needed per-app `resolveRequest` workarounds.
