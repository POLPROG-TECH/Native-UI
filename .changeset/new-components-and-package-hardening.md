---
'@polprog/native-ui': minor
---

New components, ready-made translations and a stricter package.

- New components: `Banner` (inline info, success, warning or error message with an action and a close button), `Accordion` (collapsible section, controlled or uncontrolled), `Tabs` (tab row with a selection indicator, optionally scrollable), `Slider` (draggable value, adjustable by screen readers), `Stepper` (decrease and increase buttons around a number), `PinInput` (one-time code or PIN in separate cells with SMS autofill), `Tooltip` (hint on hover, focus or long press) and `ActionSheet` (menu of actions in a bottom sheet). Each reads its dimensions from `theme.components.<name>`.
- Label packs: `plLabels`, `esLabels`, `deLabels` and `arLabels` translate every string the library renders. Pass one as `config.labels`.
- New label keys: `dismiss`, `increase`, `decrease` and `pinProgress`.
- Web accessibility: checked, selected, expanded, busy and disabled state now reaches the browser. React Native Web ignores `accessibilityState`, so on web every control also writes the ARIA attribute that is valid for its role (`aria-selected` on tabs, `aria-checked` on radios, checkboxes and switches, `aria-pressed` on chips, `aria-expanded` on Select and Accordion). `Slider`, `ProgressBar` and `PaginationDots` write `aria-value*`. Native announcements are unchanged.
- `Slider` takes keyboard focus on web and answers to the arrow, Home and End keys.
- `Tooltip` flips to the other side when the requested one has no room and slides sideways to stay inside the window (`components.tooltip.edgeInset`).
- Fixed: the switch inside `ListSwitchItem` and `SettingsSwitchRow` had no accessible name; it is now named by the row's label and subtitle.
- Fixed: the wildcard subpaths no longer reach internal files (`@polprog/native-ui/components/button/...`). They never resolved outside Metro; now they are closed everywhere.
- `ColorToken`, the type of the `bg` prop of `Box`, `VStack` and `HStack`, is exported (declaration builds of apps that re-export those props could fail with TS2742).
- Fixed: the subpath exports (`/components/*`, `/primitives/*`, `/tokens`, `/theme`) now have the same `react-native` condition as the root entry. Before, Metro loaded the root from `src` and the subpaths from `dist`, so an app that mixed them got two copies of the theme context and `useTheme` threw inside a provider.
- ESM and CJS consumers now each get their own type declarations (`.d.mts` and `.d.ts`); the package declares `"type": "commonjs"`.
- Peer ranges start at versions that can actually be installed together with React Native 0.84: `react` 19.2.3 (what React Native 0.84 requires) and `react-native-reanimated` 4.2.3 (the first release that supports it). CI type-checks the library against these minimums. `engines.node` follows React Native 0.84: 20.19.4 or newer.
