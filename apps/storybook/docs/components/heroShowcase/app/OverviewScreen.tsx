import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  HStack,
  Heading,
  ListHeader,
  ListItem,
  ListSection,
  ProgressBar,
  StatTile,
  Text,
  VStack,
} from '@polprog/native-ui';
import { Inspectable } from '../ComponentInspector';
import { useShowcaseCopy } from '../showcaseCopy';
import { SpendingSplit } from './SpendingSplit';
import { SHOWCASE_BUDGET_TOTAL, SHOWCASE_RECENT_COUNT, useFormatMoney } from '../showcaseData';
import type { ShowcaseApp } from '../useShowcaseApp';

const PERCENT = 100;

function Greeting() {
  const { overview: copy, initials } = useShowcaseCopy();

  return (
    <HStack justify="space-between" align="center">
      <VStack gap="2xs">
        <Inspectable slot="greeting">
          <Text variant="caption" color="textSecondary">
            {copy.greeting}
          </Text>
        </Inspectable>
        <Inspectable slot="title">
          <Heading level={3}>{copy.project}</Heading>
        </Inspectable>
      </VStack>
      <Inspectable slot="avatar">
        <Avatar initials={initials} size="sm" />
      </Inspectable>
    </HStack>
  );
}

/** Dashboard card in CostBoard's layout: big figure, trend badge, bar, two stats. */
function BudgetCard({ app }: { app: ShowcaseApp }) {
  const copy = useShowcaseCopy().overview;
  const formatMoney = useFormatMoney();

  return (
    <Inspectable slot="card">
      <Card size="compact">
        <VStack gap="smPlus">
          <HStack justify="space-between" align="flex-end">
            <Inspectable slot="budget">
              <StatTile
                label={copy.budgetLabel}
                value={formatMoney(app.left)}
                align="left"
                size="lg"
                mono={false}
              />
            </Inspectable>
            <Inspectable slot="badge">
              <Badge
                label={copy.spentCaption(Math.round(app.spentRatio * PERCENT))}
                variant="primary"
              />
            </Inspectable>
          </HStack>
          <Inspectable slot="progress">
            <ProgressBar value={app.spentRatio} accessibilityLabel={copy.progressLabel} />
          </Inspectable>
          <Inspectable slot="divider">
            <Divider />
          </Inspectable>
          <HStack>
            <Inspectable slot="stat" flex={1}>
              <StatTile
                label={copy.spentLabel}
                value={formatMoney(app.spent)}
                align="left"
                size="sm"
              />
            </Inspectable>
            <Inspectable slot="stat" flex={1}>
              <StatTile
                label={copy.totalLabel}
                value={formatMoney(SHOWCASE_BUDGET_TOTAL)}
                align="left"
                size="sm"
              />
            </Inspectable>
          </HStack>
        </VStack>
      </Card>
    </Inspectable>
  );
}

function Actions({ app }: { app: ShowcaseApp }) {
  const copy = useShowcaseCopy().overview;

  return (
    <HStack gap="sm">
      <Inspectable slot="cta" flex={1}>
        <Button
          title={app.quote === 'sent' ? copy.ctaDone : copy.cta}
          onPress={app.sendQuote}
          loading={app.quote === 'sending'}
          glow={app.quote !== 'sent'}
          fullWidth
          haptic={false}
        />
      </Inspectable>
      <Inspectable slot="secondary">
        <Button
          title={copy.expensesAction}
          onPress={() => app.selectTab('expenses')}
          variant="secondary"
          haptic={false}
        />
      </Inspectable>
    </HStack>
  );
}

function Recent({ app }: { app: ShowcaseApp }) {
  const copy = useShowcaseCopy().overview;
  const formatMoney = useFormatMoney();
  const openExpenses = () => app.selectTab('expenses');
  const lastIndex = SHOWCASE_RECENT_COUNT - 1;

  return (
    <VStack gap="xs">
      <HStack justify="space-between" align="center">
        <Inspectable slot="sectionTitle">
          <ListHeader title={copy.recentTitle} size="sm" />
        </Inspectable>
        <Inspectable slot="link">
          <Button
            title={copy.seeAll}
            onPress={openExpenses}
            variant="ghost"
            size="sm"
            haptic={false}
          />
        </Inspectable>
      </HStack>
      <Inspectable slot="section">
        <ListSection grouped>
          {app.expenses.slice(0, SHOWCASE_RECENT_COUNT).map((expense, index) => (
            <Inspectable key={expense.id} slot="expense">
              <ListItem
                title={expense.title}
                subtitle={expense.vendor}
                value={formatMoney(expense.amount)}
                onPress={openExpenses}
                hideDivider={index === lastIndex}
              />
            </Inspectable>
          ))}
        </ListSection>
      </Inspectable>
    </VStack>
  );
}

/** Budget at a glance; every number is derived from the Expenses tab. */
export function OverviewScreen({ app }: { app: ShowcaseApp }) {
  return (
    <VStack gap="md">
      <Greeting />
      <BudgetCard app={app} />
      <Actions app={app} />
      <SpendingSplit app={app} />
      <Recent app={app} />
    </VStack>
  );
}
