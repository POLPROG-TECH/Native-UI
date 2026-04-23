/**
 * Smoke test - verifies that all public exports from the library entry point
 * are available and correctly typed.
 */
import * as NativeUI from '../src/index';

describe('theme exports', () => {
  it('should export NativeUIProvider as a function component', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the NativeUIProvider export is inspected
    const provider = NativeUI.NativeUIProvider;

    // THEN it is defined and is a function
    expect(provider).toBeDefined();
    expect(typeof provider).toBe('function');
  });

  it('should export useTheme as a function', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the useTheme export is inspected
    const type = typeof NativeUI.useTheme;

    // THEN it is a function
    expect(type).toBe('function');
  });

  it('should export useColors as a function', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the useColors export is inspected
    const type = typeof NativeUI.useColors;

    // THEN it is a function
    expect(type).toBe('function');
  });

  it('should export useThemeColors alias as a function', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the useThemeColors alias export is inspected
    const type = typeof NativeUI.useThemeColors;

    // THEN it is a function
    expect(type).toBe('function');
  });

  it('should export useSemantic as a function', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the useSemantic export is inspected
    const type = typeof NativeUI.useSemantic;

    // THEN it is a function
    expect(type).toBe('function');
  });
});

describe('token exports', () => {
  it('should export colors with light and dark schemes', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the colors export is inspected
    const { colors } = NativeUI;

    // THEN colors and its light and dark schemes are defined
    expect(colors).toBeDefined();
    expect(colors.light).toBeDefined();
    expect(colors.dark).toBeDefined();
  });

  it('should export resolveColorScheme as a function', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the resolveColorScheme export is inspected
    const type = typeof NativeUI.resolveColorScheme;

    // THEN it is a function
    expect(type).toBe('function');
  });

  it('should export getContrastText as a function', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the getContrastText export is inspected
    const type = typeof NativeUI.getContrastText;

    // THEN it is a function
    expect(type).toBe('function');
  });

  it('should export THEME PRESETS as an array', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the THEME_PRESETS export is inspected
    const isArray = Array.isArray(NativeUI.THEME_PRESETS);

    // THEN it is an array
    expect(isArray).toBe(true);
  });

  it('should export typography with body variant defined', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the typography export is inspected
    const { typography } = NativeUI;

    // THEN typography and its body variant are defined
    expect(typography).toBeDefined();
    expect(typography.body).toBeDefined();
  });

  it('should export FONT SCALE as a defined object', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the FONT_SCALE export is inspected
    const value = NativeUI.FONT_SCALE;

    // THEN it is defined
    expect(value).toBeDefined();
  });

  it('should export spacing with numeric md entry', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the spacing export is inspected
    const { spacing } = NativeUI;

    // THEN spacing is defined and spacing.md is numeric
    expect(spacing).toBeDefined();
    expect(typeof spacing.md).toBe('number');
  });

  it('should export borderRadius as a defined object', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the borderRadius export is inspected
    const value = NativeUI.borderRadius;

    // THEN it is defined
    expect(value).toBeDefined();
  });

  it('should export iconSize as a defined object', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the iconSize export is inspected
    const value = NativeUI.iconSize;

    // THEN it is defined
    expect(value).toBeDefined();
  });

  it('should export hitSlop as a defined object', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the hitSlop export is inspected
    const value = NativeUI.hitSlop;

    // THEN it is defined
    expect(value).toBeDefined();
  });

  it('should export elevation as a defined object', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the elevation export is inspected
    const value = NativeUI.elevation;

    // THEN it is defined
    expect(value).toBeDefined();
  });

  it('should export duration as a defined object', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the duration export is inspected
    const value = NativeUI.duration;

    // THEN it is defined
    expect(value).toBeDefined();
  });

  it('should export zIndex as a defined object', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the zIndex export is inspected
    const value = NativeUI.zIndex;

    // THEN it is defined
    expect(value).toBeDefined();
  });

  it('should export opacity as a defined object', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the opacity export is inspected
    const value = NativeUI.opacity;

    // THEN it is defined
    expect(value).toBeDefined();
  });

  it('should export borderWidth as a defined object', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the borderWidth export is inspected
    const value = NativeUI.borderWidth;

    // THEN it is defined
    expect(value).toBeDefined();
  });

  it('should export easing as a defined object', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the easing export is inspected
    const value = NativeUI.easing;

    // THEN it is defined
    expect(value).toBeDefined();
  });

  it('should export glowShadow as a function', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the glowShadow export is inspected
    const type = typeof NativeUI.glowShadow;

    // THEN it is a function
    expect(type).toBe('function');
  });

  it('should export every default semantic token object', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the default semantic token exports are inspected
    const {
      defaultSemanticTokens,
      defaultSemanticColors,
      defaultSemanticSpacing,
      defaultSemanticTypography,
    } = NativeUI;

    // THEN all four default semantic token objects are defined
    expect(defaultSemanticTokens).toBeDefined();
    expect(defaultSemanticColors).toBeDefined();
    expect(defaultSemanticSpacing).toBeDefined();
    expect(defaultSemanticTypography).toBeDefined();
  });
});

describe('utility exports', () => {
  it('should export configureHaptics as a function', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the configureHaptics export is inspected
    const type = typeof NativeUI.configureHaptics;

    // THEN it is a function
    expect(type).toBe('function');
  });

  it('should export getHaptics as a function', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the getHaptics export is inspected
    const type = typeof NativeUI.getHaptics;

    // THEN it is a function
    expect(type).toBe('function');
  });
});

describe('primitive exports', () => {
  it('should export Box as a function component', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the Box export is inspected
    const type = typeof NativeUI.Box;

    // THEN it is a function component
    expect(type).toBe('function');
  });

  it('should export VStack as a function component', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the VStack export is inspected
    const type = typeof NativeUI.VStack;

    // THEN it is a function component
    expect(type).toBe('function');
  });

  it('should export HStack as a function component', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the HStack export is inspected
    const type = typeof NativeUI.HStack;

    // THEN it is a function component
    expect(type).toBe('function');
  });

  it('should export Text as a function component', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the Text export is inspected
    const type = typeof NativeUI.Text;

    // THEN it is a function component
    expect(type).toBe('function');
  });

  it('should export Heading as a function component', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the Heading export is inspected
    const type = typeof NativeUI.Heading;

    // THEN it is a function component
    expect(type).toBe('function');
  });

  it('should export Divider as a function component', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the Divider export is inspected
    const type = typeof NativeUI.Divider;

    // THEN it is a function component
    expect(type).toBe('function');
  });

  it('should export PressableScale as a function component', () => {
    // GIVEN the NativeUI library entry point

    // WHEN the PressableScale export is inspected
    const type = typeof NativeUI.PressableScale;

    // THEN it is a renderable component - either a plain function or a
    // forwardRef exotic (which is an object with $$typeof = ForwardRef).
    // PressableScale wraps itself in forwardRef so consumers on both
    // React 18 and React 19 can forward a ref to the underlying Pressable.
    expect(['function', 'object']).toContain(type);
    if (type === 'object') {
      expect(NativeUI.PressableScale).toHaveProperty('render');
    }
  });
});

describe('component exports', () => {
  const componentNames = [
    'Button',
    'IconButton',
    'Card',
    'Input',
    'TextArea',
    'Select',
    'Checkbox',
    'Switch',
    'Radio',
    'Chip',
    'ChipGroup',
    'Badge',
    'Avatar',
    'Modal',
    'BottomSheet',
    'Toast',
    'useToast',
    'ProgressBar',
    'Skeleton',
    'SearchBar',
    'EmptyState',
    'Spinner',
    'ListItem',
    'ListSection',
    'ListSwitchItem',
    'ListHeader',
    'Section',
    'ScreenContainer',
    'SettingsRow',
    'SettingsSwitchRow',
    'InputPrompt',
  ] as const;

  componentNames.forEach((name) => {
    it(`should export ${name} from the entry point`, () => {
      // GIVEN the NativeUI library entry point

      // WHEN the named export is read from the module
      const value = (NativeUI as Record<string, unknown>)[name];

      // THEN the named component is available
      expect(value).toBeDefined();
    });
  });
});
