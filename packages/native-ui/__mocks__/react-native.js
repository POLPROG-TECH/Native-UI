/*
 * Minimal react-native mock for the `dom` Jest project (jsdom). Host
 * components render plain HTML elements with ARIA attributes, so it proves
 * logic and markup but not real React Native semantics: those belong in the
 * `native` project (see CONTRIBUTING.md, "Test projects").
 *
 * The implementation lives in `__mocks__/react-native/`:
 * - `styles.js`: StyleSheet and RN style to CSS translation
 * - `accessibility.js`: accessibility props to ARIA, RN-only prop filtering
 * - `views.js`: View, Text, Image, ScrollView, ActivityIndicator, Animated
 * - `controls.js`: TextInput, TouchableOpacity, Pressable, Switch
 * - `containers.js`: FlatList, Modal
 * - `apis.js`: Platform, Alert, Keyboard, PanResponder, AccessibilityInfo, ...
 */
const { StyleSheet } = require('./react-native/styles');
const views = require('./react-native/views');
const controls = require('./react-native/controls');
const containers = require('./react-native/containers');
const apis = require('./react-native/apis');

module.exports = {
  StyleSheet,
  ...views,
  ...controls,
  ...containers,
  ...apis,
};
