import { View, Text as RNText } from 'react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { FONT_SCALE, typography } from '../../../src/tokens/typography';

function ScaledSample({ level, adjustment }: { level: string; adjustment: number }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        marginBottom: 24,
        padding: 16,
        backgroundColor: colors.surfaceSecondary,
        borderRadius: 10,
      }}
    >
      <RNText
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: colors.primary,
          marginBottom: 8,
          fontFamily: 'monospace',
        }}
      >
        fontSize: "{level}" (+{adjustment}px)
      </RNText>
      <RNText
        style={{
          fontSize: typography.body.fontSize + adjustment,
          lineHeight: typography.body.lineHeight + adjustment,
          color: colors.textPrimary,
        }}
      >
        This is body text at {level} scale ({typography.body.fontSize + adjustment}px)
      </RNText>
      <RNText
        style={{
          fontSize: typography.h2.fontSize + adjustment,
          fontWeight: '600',
          marginTop: 8,
          color: colors.textPrimary,
        }}
      >
        This is h2 at {level} scale ({typography.h2.fontSize + adjustment}px)
      </RNText>
    </View>
  );
}

/** Body and h2 rendered at each accessibility font-scale level. */
export function FontScalingView() {
  const { colors } = useTheme();

  return (
    <View>
      <RNText style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 24 }}>
        native-ui supports 3 font scale levels for accessibility. Each level adds pixels to the base
        font size.
      </RNText>
      {Object.entries(FONT_SCALE).map(([level, adjustment]) => (
        <ScaledSample key={level} level={level} adjustment={adjustment} />
      ))}
    </View>
  );
}
