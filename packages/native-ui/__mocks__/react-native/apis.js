/*
 * Non-visual APIs of the jsdom react-native mock. Everything is inert and
 * deterministic; suites spy on the methods they need to drive.
 */

/*
 * `OS` is intentionally mutable so suites can exercise platform-specific
 * branches by temporarily setting `Platform.OS = 'android'` (restore in a
 * `finally`/`afterEach`). `select` resolves against the *current* OS.
 */
const Platform = {
  OS: 'ios',
  select: (obj) => obj[Platform.OS] ?? obj.default ?? obj.ios ?? {},
};

const Alert = {
  alert: jest.fn(),
  prompt: jest.fn(),
};

/* An iPhone-sized window, so layout math has realistic inputs. */
const WINDOW_METRICS = { width: 375, height: 812, scale: 2, fontScale: 1 };

const useWindowDimensions = () => ({ ...WINDOW_METRICS });

const Dimensions = {
  get: (_which) => ({ ...WINDOW_METRICS }),
  addEventListener: () => ({ remove: () => {} }),
};

const useColorScheme = () => 'light';

const I18nManager = { isRTL: false };

/*
 * Inert by default; suites spy on `addListener` to capture and fire the
 * registered callbacks themselves.
 */
const Keyboard = {
  addListener: () => ({ remove: () => {} }),
  dismiss: () => {},
};

/*
 * Returns inert handlers. Suites that test gesture logic spy on `create` to
 * read the callbacks and invoke them with fake gesture state.
 */
const PanResponder = {
  create: () => ({ panHandlers: {} }),
};

/*
 * Screen-reader state defaults to "off"; suites flip it with
 * `jest.spyOn(AccessibilityInfo, 'isScreenReaderEnabled')`.
 */
const AccessibilityInfo = {
  isScreenReaderEnabled: () => Promise.resolve(false),
  isReduceMotionEnabled: () => Promise.resolve(false),
  addEventListener: () => ({ remove: () => {} }),
  announceForAccessibility: () => {},
};

module.exports = {
  Platform,
  Alert,
  Dimensions,
  useWindowDimensions,
  useColorScheme,
  I18nManager,
  Keyboard,
  PanResponder,
  AccessibilityInfo,
};
