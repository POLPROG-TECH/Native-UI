---
"@polprog/native-ui": minor
---

Add new components and full unit-test coverage.

**New components**

- `BottomTabBar` - iOS-style bottom tab rail with badges, safe-area insets, accessibility roles (`tab`/`tablist`) and `accessibilityState.selected`.
- `Countdown` - self-ticking countdown with `hms`/`hm`/`ms`/`auto` format variants, `expiredLabel`, `onExpire` callback and `renderLabel` transform.
- `StatTile` - compact metric tile with `label` / `value` / optional `caption`, supporting tones (`neutral`/`primary`/`success`/`warning`/`error`), sizes (`sm`/`md`/`lg`), `mono` digits and `align`.

**Tests & infrastructure**

- Added Jest + React Testing Library coverage for every component that can render in jsdom (Badge, BottomTabBar, Button, Card, Checkbox, Chip, Countdown, EmptyState, ErrorBoundary, HeaderBar, IconButton, Input, ListHeader, ListItem, ListSection, ListSwitchItem, ProgressBar, Radio, SearchBar, Section, SettingsRow, Spinner, StatTile, Switch, TextArea) plus export-shape tests for native-only components (Avatar, BottomSheet, ConfettiOverlay, InputPrompt, Modal, ScreenContainer, Select, Skeleton, Toast).
- Raised the Jest coverage threshold to 50% across branches, functions, lines and statements (previously 25% for branches/functions).
- Extended the `react-native` jsdom mock to expose `aria-label` / `aria-selected` / `aria-disabled` on `TouchableOpacity` and `Pressable`, and to suppress `onValueChange` on a disabled `Switch`.

**Storybook**

- Added stories for `BottomTabBar`, `Countdown` and `StatTile` with play-tests for interaction flows.
- Fixed play-tests for `BottomTabBar` (use `role="tab"`) and `IconButton` (honour the 300 ms press debounce, allow `pointer-events: none` clicks on the disabled-state assertion).
- Enabled MSW integration in the Storybook preview.
- 
