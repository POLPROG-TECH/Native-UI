import { View, Text as RNText } from 'react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { typography, type TypographyVariant } from '../../../src/tokens/typography';
import { typedKeys } from '../../../src/utils/typedKeys';

const NARROW_COLUMNS = ['Size', 'Line', 'Weight'] as const;

function ComparisonHeader() {
  const { colors } = useTheme();
  const headerText = { fontSize: 12, fontWeight: '600', color: colors.textSecondary } as const;

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surfaceSecondary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <RNText style={{ width: 140, ...headerText }}>Variant</RNText>
      {NARROW_COLUMNS.map((column) => (
        <RNText key={column} style={{ width: 60, ...headerText }}>
          {column}
        </RNText>
      ))}
      <RNText style={{ flex: 1, ...headerText }}>Preview</RNText>
    </View>
  );
}

function ComparisonRow({ variant, index }: { variant: TypographyVariant; index: number }) {
  const { colors } = useTheme();
  const t = typography[variant];
  const cell = { width: 60, fontSize: 12, color: colors.textSecondary };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: index % 2 === 0 ? colors.surface : colors.surfaceSecondary,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
      }}
    >
      <RNText
        style={{
          width: 140,
          fontSize: 13,
          fontWeight: '500',
          color: colors.textPrimary,
          fontFamily: 'monospace',
        }}
      >
        {variant}
      </RNText>
      <RNText style={cell}>{t.fontSize}px</RNText>
      <RNText style={cell}>{t.lineHeight}px</RNText>
      <RNText style={cell}>{t.fontWeight}</RNText>
      <RNText style={{ flex: 1, ...t, color: colors.textPrimary }} numberOfLines={1}>
        Abc 123
      </RNText>
    </View>
  );
}

/** Table of every regular-scale variant with its size, line height and weight. */
export function TypeComparisonView() {
  const { colors } = useTheme();

  return (
    <View>
      <RNText style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
        Compare all typography variants at a glance. Each row shows the variant name, specs, and a
        text sample.
      </RNText>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <ComparisonHeader />
        {typedKeys(typography).map((variant, i) => (
          <ComparisonRow key={variant} variant={variant} index={i} />
        ))}
      </View>
    </View>
  );
}
