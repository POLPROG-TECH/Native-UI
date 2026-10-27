---
'@polprog/native-ui': patch
---

Fix type checking against React Native 0.87 and newer. `Box` and `Stack` no
longer assign to readonly style properties, and the `ref` of `Input`,
`TextArea` and `SearchBar` is typed as the `TextInput` instance via
`ComponentRef<typeof TextInput>`, which matches older React Native versions
as well. `Input`, `TextArea` and `PressableScale` now declare their exported
types explicitly, so the published declarations no longer depend on React
Native internal type names.
