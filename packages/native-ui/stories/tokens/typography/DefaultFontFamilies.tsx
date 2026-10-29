import { View, Text as RNText } from 'react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import {
  spaceGroteskFontFamilies,
  systemFontFamilies,
  type FontFamilies,
} from '../../../src/tokens/fonts';

const SHOWN_WEIGHTS = ['regular', 'medium', 'semiBold', 'bold'] as const;

function FamilyCard({ caption, families }: { caption: string; families: FontFamilies }) {
  const { colors } = useTheme();

  return (
    <View style={{ padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 10 }}>
      <RNText
        style={{
          fontSize: 12,
          color: colors.textSecondary,
          marginBottom: 6,
          fontFamily: 'monospace',
        }}
      >
        {caption}
      </RNText>
      {SHOWN_WEIGHTS.map((w) => (
        <RNText key={w} style={{ fontSize: 13 }}>
          <RNText style={{ fontFamily: 'monospace', color: colors.primary }}>{w}</RNText>
          {' → '}
          <RNText style={{ color: colors.textPrimary }}>{families[w]}</RNText>
        </RNText>
      ))}
    </View>
  );
}

/** The provider-default font families next to the system opt-out. */
export function DefaultFontFamiliesView() {
  return (
    <View style={{ gap: 12 }}>
      <FamilyCard
        caption="spaceGroteskFontFamilies (provider default)"
        families={spaceGroteskFontFamilies}
      />
      <FamilyCard caption="systemFontFamilies (opt-out)" families={systemFontFamilies} />
    </View>
  );
}
