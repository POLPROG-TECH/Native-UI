import type { Meta, StoryObj } from '@storybook/react';
import { DEFAULT_TYPOGRAPHY_DENSITY } from '../../src/tokens/typography';
import { CompactVsRegularView } from './typography/CompactVsRegular';
import { DefaultFontFamiliesView } from './typography/DefaultFontFamilies';
import { FontScalingView } from './typography/FontScaling';
import { FullScaleView } from './typography/FullScale';
import { TypeComparisonView } from './typography/TypeComparison';

const meta: Meta = {
  title: 'Tokens/Typography',
  parameters: {
    a11y: { disable: true },
    docs: {
      description: {
        component: [
          `native-ui ships **two built-in scales**. The provider default is **\`${DEFAULT_TYPOGRAPHY_DENSITY}\`** (editorial / branded) and the \`regular\` scale matches iOS/Android platform metrics exactly. Pick a scale via \`<NativeUIProvider config={{ typography: 'regular' | 'compact' }}>\` or pass a fully-formed \`Typography\` object for full control.`,
          '',
          '### Scales',
          '- **`compact` (default)** - editorial scale: hero=48, h1=32, h2=26, h3=21, body=15, caption=11. Tighter line-heights and larger displays.',
          '- **`regular`** - iOS-native metrics (17px body, 28px h1, matching Apple HIG).',
          '',
          '### Default font family',
          '- The provider defaults `fontFamilies` to `spaceGroteskFontFamilies` - the branded Space Grotesk family.',
          '- Your app must load the Space Grotesk TTFs (e.g. `@expo-google-fonts/space-grotesk`).',
          '- Pass `fontFamilies={systemFontFamilies}` on the provider to fall back to San Francisco (iOS) / Roboto (Android).',
          '',
          '### Import',
          '```tsx',
          'import {',
          '  NativeUIProvider,',
          '  compactTypography,',
          '  spaceGroteskFontFamilies,',
          '  systemFontFamilies,',
          "} from '@polprog/native-ui';",
          '',
          '// Opt out of the default compact scale:',
          "<NativeUIProvider config={{ typography: 'regular', fontFamilies: systemFontFamilies }}>",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;

export const FullScale: StoryObj = {
  name: 'Full Typography Scale',
  render: () => <FullScaleView />,
};

export const FontScaling: StoryObj = {
  name: 'Font Scale Accessibility',
  render: () => <FontScalingView />,
};

export const TypeComparison: StoryObj = {
  name: 'Side-by-Side Comparison',
  render: () => <TypeComparisonView />,
};

export const CompactVsRegular: StoryObj = {
  name: 'Compact (default) vs Regular',
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side comparison of the two built-in scales. The provider default is `compact` (editorial). Opt out with `<NativeUIProvider config={{ typography: "regular" }}>` for the iOS-native scale.',
      },
    },
  },
  render: () => <CompactVsRegularView />,
};

export const DefaultFontFamilies: StoryObj = {
  name: 'Default font families',
  parameters: {
    docs: {
      description: {
        story:
          '`NativeUIProvider` defaults `fontFamilies` to `spaceGroteskFontFamilies`. Apps that do not load those TTFs can pass `fontFamilies={systemFontFamilies}` to fall back to the platform default.',
      },
    },
  },
  render: () => <DefaultFontFamiliesView />,
};
