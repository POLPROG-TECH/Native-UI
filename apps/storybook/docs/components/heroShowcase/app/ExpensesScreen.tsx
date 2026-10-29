import { Badge, Chip, EmptyState, HStack, ListItem, SearchBar, VStack } from '@polprog/native-ui';
import { Inspectable } from '../ComponentInspector';
import { useShowcaseCopy } from '../showcaseCopy';
import { SHOWCASE_FILTERS, useFormatMoney, type Expense } from '../showcaseData';
import type { ShowcaseApp } from '../useShowcaseApp';

function ExpenseRow({ expense, app }: { expense: Expense; app: ShowcaseApp }) {
  const paid = app.isPaid(expense.id);
  const copy = useShowcaseCopy().expenses;
  const formatMoney = useFormatMoney();

  return (
    <Inspectable slot="expense">
      <ListItem
        title={expense.title}
        subtitle={`${expense.vendor} · ${formatMoney(expense.amount)}`}
        trailing={
          <Badge label={paid ? copy.paid : copy.due} variant={paid ? 'success' : 'warning'} />
        }
        onPress={() => app.togglePaid(expense.id)}
        hideDivider
      />
    </Inspectable>
  );
}

/** Searchable, filterable list; tapping a row toggles paid and moves the budget. */
export function ExpensesScreen({ app }: { app: ShowcaseApp }) {
  const copy = useShowcaseCopy().expenses;

  return (
    <VStack gap="sm">
      <Inspectable slot="search">
        <SearchBar
          value={app.query}
          onChangeText={app.setQuery}
          placeholder={copy.searchPlaceholder}
          debounceMs={0}
        />
      </Inspectable>
      <HStack gap="xs">
        {SHOWCASE_FILTERS.map((filter) => (
          <Inspectable key={filter} slot="filter">
            <Chip
              label={copy.filters[filter]}
              selected={app.filter === filter}
              onPress={() => app.setFilter(filter)}
              size="sm"
            />
          </Inspectable>
        ))}
      </HStack>
      {app.visibleExpenses.length === 0 ? (
        <Inspectable slot="empty">
          <EmptyState title={copy.emptyTitle} message={copy.emptyMessage} size="sm" />
        </Inspectable>
      ) : (
        <VStack gap="xs">
          {app.visibleExpenses.map((expense) => (
            <ExpenseRow key={expense.id} expense={expense} app={app} />
          ))}
        </VStack>
      )}
    </VStack>
  );
}
