import { View, Text as RNText } from 'react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import type { TypographyStyle } from '../../../src/tokens/typography';

interface TypographySampleProps {
  variant: string;
  style: TypographyStyle;
}

/* Numeric variants are previewed with a currency amount instead of a pangram. */
function sampleText(variant: string): string {
  return variant.startsWith('mono') || variant.startsWith('amount')
    ? '€1,234,567.89'
    : 'The quick brown fox jumps over the lazy dog';
}

/* RN types `fontVariant` as a list or a space-separated string; show either. */
function formatFontVariant(fontVariant: TypographyStyle['fontVariant']): string {
  if (!fontVariant) {
    return '';
  }

  return ` · ${Array.isArray(fontVariant) ? fontVariant.join(', ') : fontVariant}`;
}

function SampleSpecs({ variant, style }: TypographySampleProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 8,
      }}
    >
      <RNText
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: colors.primary,
          fontFamily: 'monospace',
        }}
      >
        {variant}
      </RNText>
      <RNText style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'monospace' }}>
        {style.fontSize}px / {style.lineHeight}px · {style.fontWeight}
        {style.letterSpacing ? ` · ls: ${style.letterSpacing}` : ''}
        {formatFontVariant(style.fontVariant)}
      </RNText>
    </View>
  );
}

/** One scale entry: its name and metrics above a rendered text sample. */
export function TypographySample({ variant, style }: TypographySampleProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
      }}
    >
      <SampleSpecs variant={variant} style={style} />
      <RNText style={{ ...style, color: colors.textPrimary }}>{sampleText(variant)}</RNText>
    </View>
  );
}
