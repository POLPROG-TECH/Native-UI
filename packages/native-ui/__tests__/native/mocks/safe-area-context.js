/*
 * The package's own Jest mock calls `jest.requireActual` on the package, which
 * the `moduleNameMapper` entry pointing here would route back to this file.
 * A self-contained mock with zero insets avoids that cycle.
 */
const React = require('react');

const ZERO_INSETS = { top: 0, right: 0, bottom: 0, left: 0 };
const FRAME = { x: 0, y: 0, width: 320, height: 640 };

module.exports = {
  initialWindowMetrics: { frame: FRAME, insets: ZERO_INSETS },
  useSafeAreaInsets: () => ZERO_INSETS,
  useSafeAreaFrame: () => FRAME,
  SafeAreaProvider: ({ children }) => React.createElement(React.Fragment, null, children),
  SafeAreaView: ({ children }) => React.createElement(React.Fragment, null, children),
};
