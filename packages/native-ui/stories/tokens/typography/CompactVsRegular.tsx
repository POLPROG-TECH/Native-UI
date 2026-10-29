import { View, Text as RNText } from 'react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { spaceGroteskFontFamilies } from '../../../src/tokens/fonts';
import {
  compactTypography,
  typography,
  type TypographyStyle,
  type TypographyVariant,
} from '../../../src/tokens/typography';

/*
 * `typography` is the root-level iOS-native (`regular`) scale; `compactScale`
 * mirrors the new provider default, built against the Space Grotesk family
 * names that `<NativeUIProvider>` resolves by default.
 */
const compactScale = compactTypography(spaceGroteskFontFamilies);

const COMPARED_VARIANTS: TypographyVariant[] = [
  'displayLarge',
  'displayMedium',
  'h1',
  'h2',
  'h3',
  'heading',
  'title',
  'bodyLarge',
  'body',
  'bodySmall',
  'label',
  'labelSmall',
  'caption',
  'overline',
];

function formatDelta(delta: number): string {
  if (delta === 0) {
    return '=';
  }

  return delta > 0 ? `+${delta}` : `${delta}`;
}

interface ScaleCellProps {
  name: string;
  style: TypographyStyle;
  color: string;
}

function ScaleCell({ name, style, color }: ScaleCellProps) {
  return (
    <View style={{ flex: 1 }}>
      <RNText
        style={{
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          fontWeight: style.fontWeight,
          color,
        }}
        numberOfLines={1}
      >
        {name} - {style.fontSize}/{style.lineHeight}
      </RNText>
    </View>
  );
}

function DeltaLabel({ delta }: { delta: number }) {
  const { colors } = useTheme();
  const tone = delta > 0 ? colors.success : colors.error;

  return (
    <RNText
      style={{
        width: 50,
        fontSize: 11,
        fontFamily: 'monospace',
        color: delta === 0 ? colors.textTertiary : tone,
        textAlign: 'right',
      }}
    >
      Δ {formatDelta(delta)}
    </RNText>
  );
}

function CompactVsRegularRow({ variant }: { variant: TypographyVariant }) {
  const { colors } = useTheme();
  const reg = typography[variant];
  const com = compactScale[variant];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
      }}
    >
      <RNText
        style={{ width: 130, fontSize: 12, fontFamily: 'monospace', color: colors.textPrimary }}
      >
        {variant}
      </RNText>
      <ScaleCell name="Regular" style={reg} color={colors.textPrimary} />
      <ScaleCell name="Compact" style={com} color={colors.primary} />
      <DeltaLabel delta={com.fontSize - reg.fontSize} />
    </View>
  );
}

/** Regular and compact sizes of each variant side by side, with the size delta. */
export function CompactVsRegularView() {
  const { colors } = useTheme();

  return (
    <View>
      <RNText style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
        Left: `regular` (iOS-native). Right: `compact` (default). Δ is the font-size delta.
      </RNText>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        {COMPARED_VARIANTS.map((v) => (
          <CompactVsRegularRow key={v} variant={v} />
        ))}
      </View>
    </View>
  );
}
