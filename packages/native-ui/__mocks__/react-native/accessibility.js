/*
 * Accessibility and prop translation shared by the mocked host components:
 * RN accessibility props become ARIA attributes, and RN-only props are
 * dropped so React does not warn about unknown DOM attributes.
 */

/*
 * RN props with no DOM meaning are dropped, and `testID` becomes
 * `data-testid`, so suites can use `getByTestId` without React warnings.
 */
const RN_ONLY_PROPS = new Set([
  'accessibilityViewIsModal',
  'onAccessibilityEscape',
  'enabled',
  'behavior',
]);

function domProps({ testID, ...props }) {
  const out = {};
  for (const key of Object.keys(props)) {
    if (!RN_ONLY_PROPS.has(key)) {
      out[key] = props[key];
    }
  }

  if (testID !== undefined) {
    out['data-testid'] = testID;
  }

  return out;
}

/**
 * ARIA mirror of `accessibilityState`. `disabled` is the component's own
 * prop (Pressable, TouchableOpacity), which RN also reports as disabled.
 */
function stateAria(accessibilityState, disabled) {
  return {
    'aria-disabled': disabled || accessibilityState?.disabled,
    'aria-checked': accessibilityState?.checked,
    'aria-selected': accessibilityState?.selected,
  };
}

/*
 * Mirrors RN: a control marked inaccessible (or hidden from the a11y tree) is
 * not exposed with its role to assistive tech / queries.
 */
function isHiddenFromAccessibility({
  accessible,
  accessibilityElementsHidden,
  importantForAccessibility,
}) {
  return (
    accessible === false ||
    accessibilityElementsHidden === true ||
    importantForAccessibility === 'no-hide-descendants'
  );
}

module.exports = { domProps, stateAria, isHiddenFromAccessibility };
