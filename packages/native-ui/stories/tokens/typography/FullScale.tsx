import { View, Text as RNText } from 'react-native';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { typography, type TypographyVariant } from '../../../src/tokens/typography';
import { TypographySample } from './TypographySample';

interface VariantGroup {
  title: string;
  variants: TypographyVariant[];
}

const VARIANT_GROUPS: VariantGroup[] = [
  { title: 'Display', variants: ['displayLarge', 'displayMedium'] },
  { title: 'Headings', variants: ['h1', 'h2', 'h3'] },
  { title: 'Body', variants: ['bodyLarge', 'body', 'bodySmall'] },
  { title: 'Labels & Caption', variants: ['label', 'labelSmall', 'caption'] },
  { title: 'Monospace / Tabular', variants: ['mono', 'monoLarge', 'monoSmall'] },
];

function GroupTitle({ title, isFirst }: { title: string; isFirst: boolean }) {
  const { colors } = useTheme();

  return (
    <RNText
      style={{
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 20,
        ...(isFirst ? {} : { marginTop: 12 }),
      }}
    >
      {title}
    </RNText>
  );
}

/** Every variant of the regular scale, grouped by role. */
export function FullScaleView() {
  return (
    <View>
      {VARIANT_GROUPS.map((group, index) => (
        <View key={group.title}>
          <GroupTitle title={group.title} isFirst={index === 0} />
          {group.variants.map((v) => (
            <TypographySample key={v} variant={v} style={typography[v]} />
          ))}
        </View>
      ))}
    </View>
  );
}
