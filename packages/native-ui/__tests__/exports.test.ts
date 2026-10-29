/**
 * Smoke test - verifies that all public exports from the library entry point
 * are available and correctly typed.
 */
import * as NativeUI from '../src/index';

describe('theme exports', () => {
  describe('GIVEN the NativeUI library entry point', () => {
    describe('WHEN the NativeUIProvider export is inspected', () => {
      it('THEN it is defined and is a function', () => {
        const provider = NativeUI.NativeUIProvider;

        expect(provider).toBeDefined();
        expect(typeof provider).toBe('function');
      });
    });

    describe('WHEN the useTheme export is inspected', () => {
      it('THEN it is a function', () => {
        const type = typeof NativeUI.useTheme;

        expect(type).toBe('function');
      });
    });

    describe('WHEN the useColors export is inspected', () => {
      it('THEN it is a function', () => {
        const type = typeof NativeUI.useColors;

        expect(type).toBe('function');
      });
    });

    describe('WHEN the useSemantic export is inspected', () => {
      it('THEN it is a function', () => {
        const type = typeof NativeUI.useSemantic;

        expect(type).toBe('function');
      });
    });
  });
});

describe('token exports', () => {
  describe('GIVEN the NativeUI library entry point', () => {
    describe('WHEN the colors export is inspected', () => {
      it('THEN colors and its light and dark schemes are defined', () => {
        const { colors } = NativeUI;

        expect(colors).toBeDefined();
        expect(colors.light).toBeDefined();
        expect(colors.dark).toBeDefined();
      });
    });

    describe('WHEN the resolveColorScheme export is inspected', () => {
      it('THEN it is a function', () => {
        const type = typeof NativeUI.resolveColorScheme;

        expect(type).toBe('function');
      });
    });

    describe('WHEN the getContrastText export is inspected', () => {
      it('THEN it is a function', () => {
        const type = typeof NativeUI.getContrastText;

        expect(type).toBe('function');
      });
    });

    describe('WHEN the THEME_PRESETS export is inspected', () => {
      it('THEN it is an array', () => {
        const isArray = Array.isArray(NativeUI.THEME_PRESETS);

        expect(isArray).toBe(true);
      });
    });

    describe('WHEN the typography export is inspected', () => {
      it('THEN typography and its body variant are defined', () => {
        const { typography } = NativeUI;

        expect(typography).toBeDefined();
        expect(typography.body).toBeDefined();
      });
    });

    describe('WHEN the FONT_SCALE export is inspected', () => {
      it('THEN it is defined', () => {
        const value = NativeUI.FONT_SCALE;

        expect(value).toBeDefined();
      });
    });

    describe('WHEN the spacing export is inspected', () => {
      it('THEN spacing is defined and spacing.md is numeric', () => {
        const { spacing } = NativeUI;

        expect(spacing).toBeDefined();
        expect(typeof spacing.md).toBe('number');
      });
    });

    describe('WHEN the borderRadius export is inspected', () => {
      it('THEN it is defined', () => {
        const value = NativeUI.borderRadius;

        expect(value).toBeDefined();
      });
    });

    describe('WHEN the iconSize export is inspected', () => {
      it('THEN it is defined', () => {
        const value = NativeUI.iconSize;

        expect(value).toBeDefined();
      });
    });

    describe('WHEN the hitSlop export is inspected', () => {
      it('THEN it is defined', () => {
        const value = NativeUI.hitSlop;

        expect(value).toBeDefined();
      });
    });

    describe('WHEN the elevation export is inspected', () => {
      it('THEN it is defined', () => {
        const value = NativeUI.elevation;

        expect(value).toBeDefined();
      });
    });

    describe('WHEN the duration export is inspected', () => {
      it('THEN it is defined', () => {
        const value = NativeUI.duration;

        expect(value).toBeDefined();
      });
    });

    describe('WHEN the zIndex export is inspected', () => {
      it('THEN it is defined', () => {
        const value = NativeUI.zIndex;

        expect(value).toBeDefined();
      });
    });

    describe('WHEN the opacity export is inspected', () => {
      it('THEN it is defined', () => {
        const value = NativeUI.opacity;

        expect(value).toBeDefined();
      });
    });

    describe('WHEN the borderWidth export is inspected', () => {
      it('THEN it is defined', () => {
        const value = NativeUI.borderWidth;

        expect(value).toBeDefined();
      });
    });

    describe('WHEN the easing export is inspected', () => {
      it('THEN it is defined', () => {
        const value = NativeUI.easing;

        expect(value).toBeDefined();
      });
    });

    describe('WHEN the glowShadow export is inspected', () => {
      it('THEN it is a function', () => {
        const type = typeof NativeUI.glowShadow;

        expect(type).toBe('function');
      });
    });

    describe('WHEN the default semantic token exports are inspected', () => {
      it('THEN all four default semantic token objects are defined', () => {
        const {
          defaultSemanticTokens,
          defaultSemanticColors,
          defaultSemanticSpacing,
          defaultSemanticTypography,
        } = NativeUI;

        expect(defaultSemanticTokens).toBeDefined();
        expect(defaultSemanticColors).toBeDefined();
        expect(defaultSemanticSpacing).toBeDefined();
        expect(defaultSemanticTypography).toBeDefined();
      });
    });
  });
});

describe('utility exports', () => {
  describe('GIVEN the NativeUI library entry point', () => {
    describe('WHEN the configureHaptics export is inspected', () => {
      it('THEN it is a function', () => {
        const type = typeof NativeUI.configureHaptics;

        expect(type).toBe('function');
      });
    });

    describe('WHEN the getHaptics export is inspected', () => {
      it('THEN it is a function', () => {
        const type = typeof NativeUI.getHaptics;

        expect(type).toBe('function');
      });
    });
  });
});

describe('primitive exports', () => {
  describe('GIVEN the NativeUI library entry point', () => {
    describe('WHEN the Box export is inspected', () => {
      it('THEN it is a function component', () => {
        const type = typeof NativeUI.Box;

        expect(type).toBe('function');
      });
    });

    describe('WHEN the VStack export is inspected', () => {
      it('THEN it is a function component', () => {
        const type = typeof NativeUI.VStack;

        expect(type).toBe('function');
      });
    });

    describe('WHEN the HStack export is inspected', () => {
      it('THEN it is a function component', () => {
        const type = typeof NativeUI.HStack;

        expect(type).toBe('function');
      });
    });

    describe('WHEN the Text export is inspected', () => {
      it('THEN it is a function component', () => {
        const type = typeof NativeUI.Text;

        expect(type).toBe('function');
      });
    });

    describe('WHEN the Heading export is inspected', () => {
      it('THEN it is a function component', () => {
        const type = typeof NativeUI.Heading;

        expect(type).toBe('function');
      });
    });

    describe('WHEN the Divider export is inspected', () => {
      it('THEN it is a function component', () => {
        const type = typeof NativeUI.Divider;

        expect(type).toBe('function');
      });
    });

    describe('WHEN the PressableScale export is inspected', () => {
      it('THEN it is a renderable component - either a plain function or a forwardRef exotic (which is an object with $$typeof = ForwardRef). PressableScale wraps itself in forwardRef so consumers on both React 18 and React 19 can forward a ref to the underlying Pressable', () => {
        const type = typeof NativeUI.PressableScale;

        expect(['function', 'object']).toContain(type);

        if (type === 'object') {
          expect(NativeUI.PressableScale).toHaveProperty('render');
        }
      });
    });
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
    describe('GIVEN the NativeUI library entry point', () => {
      describe('WHEN the named export is read from the module', () => {
        it('THEN the named component is available', () => {
          const value = (NativeUI as Record<string, unknown>)[name];

          expect(value).toBeDefined();
        });
      });
    });
  });
});
