/*
 * Style handling for the jsdom react-native mock: `StyleSheet` plus the
 * translation of RN style objects into something jsdom can render and
 * jest-dom can assert on.
 */

const StyleSheet = {
  create: (styles) => styles,
  hairlineWidth: 0.5,
  flatten: (style) => {
    if (Array.isArray(style)) {
      return Object.assign({}, ...style.filter(Boolean));
    }

    return style || {};
  },
};

/* Like RN's StyleSheet.flatten: nested arrays merge left to right. */
function flattenDeep(style) {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenDeep));
  }

  return style && typeof style === 'object' ? { ...style } : {};
}

/* RN axis shorthands and the CSS longhands they expand to. */
const AXIS_SHORTHANDS = [
  ['paddingHorizontal', 'paddingLeft', 'paddingRight'],
  ['paddingVertical', 'paddingTop', 'paddingBottom'],
  ['marginHorizontal', 'marginLeft', 'marginRight'],
  ['marginVertical', 'marginTop', 'marginBottom'],
];

function expandAxisShorthands(flat) {
  for (const [shorthand, start, end] of AXIS_SHORTHANDS) {
    if (flat[shorthand] === undefined) {
      continue;
    }

    flat[start] = flat[shorthand];
    flat[end] = flat[shorthand];
    delete flat[shorthand];
  }
}

function transformEntryToCss(entry) {
  return Object.entries(entry)
    .map(([fn, value]) =>
      typeof value === 'number' && fn.startsWith('translate')
        ? `${fn}(${value}px)`
        : `${fn}(${value})`,
    )
    .join(' ');
}

/**
 * Flatten RN array styles and translate RN-specific style props
 * (paddingHorizontal, marginVertical, etc.) to CSS equivalents.
 */
function flattenAndTranslate(style) {
  const flat = flattenDeep(style);
  expandAxisShorthands(flat);

  /*
   * RN transform arrays become a CSS transform string, so suites can assert
   * on it (e.g. "translateY(-240px) rotate(45deg)").
   */
  if (Array.isArray(flat.transform)) {
    flat.transform = flat.transform.map(transformEntryToCss).join(' ');
  }

  return flat;
}

module.exports = { StyleSheet, flattenAndTranslate };
