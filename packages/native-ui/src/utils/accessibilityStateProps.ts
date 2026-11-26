import { Platform, type AccessibilityRole, type AccessibilityState } from 'react-native';

type ChoiceAttribute = 'aria-selected' | 'aria-checked' | 'aria-pressed';

export interface WebAriaState {
  'aria-selected'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-pressed'?: boolean;
  'aria-expanded'?: boolean;
  'aria-busy'?: boolean;
  'aria-disabled'?: boolean;
}

/**
 * ARIA only allows `aria-selected` on tabs and options. A selected radio,
 * checkbox or switch is `aria-checked`, and a selected button is a pressed
 * toggle button. Roles that are not listed get no "chosen" attribute.
 */
const CHOICE_ATTRIBUTE: Partial<Record<AccessibilityRole, ChoiceAttribute>> = {
  tab: 'aria-selected',
  radio: 'aria-checked',
  checkbox: 'aria-checked',
  switch: 'aria-checked',
  button: 'aria-pressed',
  togglebutton: 'aria-pressed',
};

const WEB = 'web';

/** `aria-checked` may be `'mixed'`; the other choice attributes are booleans. */
function choiceState(
  attribute: ChoiceAttribute,
  state: AccessibilityState,
): Pick<WebAriaState, ChoiceAttribute> {
  const chosen = state.checked ?? state.selected;

  if (chosen === undefined) {
    return {};
  }

  if (attribute === 'aria-checked') {
    return { 'aria-checked': chosen };
  }

  return { [attribute]: chosen === true };
}

function webAriaState(role: AccessibilityRole, state: AccessibilityState): WebAriaState {
  const attribute = CHOICE_ATTRIBUTE[role];

  return {
    ...(attribute ? choiceState(attribute, state) : {}),
    'aria-expanded': state.expanded,
    'aria-busy': state.busy,
    'aria-disabled': state.disabled,
  };
}

/**
 * The role and state props of a control, for every platform. iOS and Android
 * read `accessibilityState`. React Native Web ignores it, so on web the same
 * state is also written as the ARIA attributes that are valid for the role.
 * They are added on web only: on native, React Native would fold them back
 * into the state and could change what a screen reader announces.
 *
 * @example
 * ```tsx
 * <Pressable {...accessibilityStateProps('tab', { selected, disabled })} />
 * ```
 */
export function accessibilityStateProps(role: AccessibilityRole, state: AccessibilityState) {
  const base = { accessibilityRole: role, accessibilityState: state };

  return Platform.OS === WEB ? { ...base, ...webAriaState(role, state) } : base;
}
