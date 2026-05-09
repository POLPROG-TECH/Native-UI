---
'@polprog/native-ui': minor
---

feat(DatePickerInput): Full-featured cross-platform date/time picker

- Added `mode` prop supporting `date`, `time`, and `datetime` modes
- Added `disabled`, `placeholder`, `testID`, `icon` props
- Implemented controlled open/close via `isOpen` / `onOpen` / `onClose`
- Added `clearable` / `onClear` props for clearing selected value
- Android datetime mode: two-step picker flow (date → time)
- iOS: compact native picker with placeholder-first flow support
- DEV-only console warning when peer dependency is missing
- Created `DateRangePickerInput` composite component for date range selection
- Storybook story with playground and multiple variants
