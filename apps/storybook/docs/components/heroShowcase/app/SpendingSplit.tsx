import { Box, Card, HStack, Text, VStack, useColors } from '@polprog/native-ui';
import { StyleSheet } from 'react-native';
import { Inspectable } from '../ComponentInspector';
import { useShowcaseCopy } from '../showcaseCopy';
import { SHOWCASE_CATEGORIES, useFormatMoney, type ExpenseCategory } from '../showcaseData';
import type { ShowcaseApp } from '../useShowcaseApp';

const PERCENT = 100;
const BAR_HEIGHT = 10;

/** Segment colour per category, taken from the theme's chart palette in order. */
function useCategoryColor(): (category: ExpenseCategory) => string {
  const { chart, primary } = useColors();

  return (category) => chart[SHOWCASE_CATEGORIES.indexOf(category)] ?? primary;
}

/** "Where it went" from CostBoard's dashboard: one split bar plus a legend. */
export function SpendingSplit({ app }: { app: ShowcaseApp }) {
  const colorOf = useCategoryColor();
  const copy = useShowcaseCopy();
  const labels = copy.expenses.filters;
  const formatMoney = useFormatMoney();
  const total = Math.max(app.spent, 1);

  return (
    <Inspectable slot="card">
      <Card size="compact">
        <VStack gap="sm">
          <Text variant="label">{copy.overview.splitTitle}</Text>
          <HStack style={styles.bar}>
            {SHOWCASE_CATEGORIES.map((category) => (
              <Inspectable key={category} slot="split" flex={app.spentByCategory[category]}>
                <Box style={[styles.segment, { backgroundColor: colorOf(category) }]} />
              </Inspectable>
            ))}
          </HStack>
          <HStack gap="md">
            {SHOWCASE_CATEGORIES.map((category) => (
              <Inspectable key={category} slot="legend">
                <HStack gap="xs" align="center">
                  <Box style={[styles.dot, { backgroundColor: colorOf(category) }]} />
                  <Text variant="labelSmall" color="textSecondary">
                    {`${labels[category]} ${Math.round((app.spentByCategory[category] / total) * PERCENT)}% · ${formatMoney(app.spentByCategory[category])}`}
                  </Text>
                </HStack>
              </Inspectable>
            ))}
          </HStack>
        </VStack>
      </Card>
    </Inspectable>
  );
}

const styles = StyleSheet.create({
  bar: {
    gap: 3,
  },
  segment: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
