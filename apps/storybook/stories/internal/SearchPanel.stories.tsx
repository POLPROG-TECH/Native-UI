import preview from '../../.storybook/preview';
import type { StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { SearchPanel, type SearchPanelProps } from '../../docs/components/search/panel/SearchPanel';
import { SEARCH_COPY } from '../../docs/components/search/searchCopy';
import { getDocsGlobals, setDocsGlobals } from '../../shared/docsGlobals';
import { FIXTURE_INDEX, FIXTURE_TOKENS, FIXTURE_USAGE } from './searchFixtures';

/* The theme runs never pin Polish, so the shared checks read the English copy. */
const COPY = SEARCH_COPY.en;
const POLISH = SEARCH_COPY.pl;

/** The `step` helper and canvas Storybook passes to play functions. */
type PlayContext = Parameters<NonNullable<StoryObj<SearchPanelProps>['play']>>[0];

/* Typed up front so CSF Factories sees every required prop as provided by the meta. */
const BASE_ARGS: SearchPanelProps = {
  tokens: FIXTURE_TOKENS,
  index: { status: 'ready', data: FIXTURE_INDEX },
  usage: { status: 'ready', data: FIXTURE_USAGE },
  onEngage: () => undefined,
};

/**
 * Interaction checks for the docs Search page UI, run against fixed data so
 * they do not depend on the live theme or Storybook index. Hidden from the
 * sidebar; run by `npm test` like every other story.
 */
const meta = preview.meta({
  title: 'Internal/Search panel',
  component: SearchPanel,
  tags: ['!dev', '!autodocs'],
  args: BASE_ARGS,
});

function fieldOf(canvasElement: HTMLElement) {
  return within(canvasElement).getByRole('searchbox', { name: COPY.inputLabel });
}

function resultLinks(canvasElement: HTMLElement) {
  return within(canvasElement).queryAllByRole('link');
}

async function typeQuery(canvasElement: HTMLElement, query: string) {
  const field = fieldOf(canvasElement);

  await userEvent.clear(field);
  await userEvent.type(field, query);
  await waitFor(() =>
    expect(within(canvasElement).getByText(/^\d+ results? for/)).toHaveTextContent(query),
  );
}

async function emptyAndResults({ canvasElement, step }: PlayContext) {
  const canvas = within(canvasElement);

  await step('WHEN nothing is typed', async () => {
    await step('THEN the empty state offers suggestions', async () => {
      await expect(canvas.getByText(COPY.emptyTitle)).toBeVisible();
      await expect(canvas.getByRole('button', { name: 'primary' })).toBeVisible();
    });
  });
  await step('WHEN "primary" is typed', async () => {
    await typeQuery(canvasElement, 'primary');

    await step('THEN colors and components are listed in their groups', async () => {
      const headings = canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);

      await expect(headings).toEqual(['Colors3', 'Components2']);
      await expect(canvas.getByRole('button', { name: 'Copy Light value #4F46E5' })).toBeVisible();
      await expect(canvas.getByRole('button', { name: 'Copy Dark value #818CF8' })).toBeVisible();
      await expect(canvas.getByRole('link', { name: /Button/ })).toHaveAttribute('target', '_top');
    });
  });
}

async function arrowNavigation({ canvasElement, step }: PlayContext) {
  const field = fieldOf(canvasElement);

  await step('WHEN ArrowDown is pressed in the field and again on a result', async () => {
    await typeQuery(canvasElement, 'primary');
    field.focus();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');

    await step('THEN focus moves to the second result', async () => {
      await expect(resultLinks(canvasElement)[1]).toHaveFocus();
    });
  });
  await step('WHEN ArrowUp is pressed past the first result', async () => {
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{ArrowUp}');

    await step('THEN focus returns to the field', async () => {
      await expect(field).toHaveFocus();
    });
  });
}

async function enterAndEscape({ canvasElement, step }: PlayContext) {
  const field = fieldOf(canvasElement);

  await step('WHEN Enter is pressed in the field', async () => {
    await typeQuery(canvasElement, 'primary');
    const first = resultLinks(canvasElement)[0];
    let opened = false;

    /* Stops the real navigation, which would leave the test page. */
    first?.addEventListener('click', (event) => {
      event.preventDefault();
      opened = true;
    });
    field.focus();
    await userEvent.keyboard('{Enter}');

    await step('THEN the top result is opened', async () => {
      await expect(opened).toBe(true);
    });
  });
  await step('WHEN Escape is pressed in the field', async () => {
    await userEvent.keyboard('{Escape}');

    await step('THEN the query is cleared', async () => {
      await expect(field).toHaveValue('');
      await waitFor(() => expect(within(canvasElement).getByText(COPY.emptyTitle)).toBeVisible());
    });
  });
}

async function noResultsAndSuggestions({ canvasElement, step }: PlayContext) {
  const canvas = within(canvasElement);

  await step('WHEN the query matches nothing', async () => {
    await typeQuery(canvasElement, 'zzzz');

    await step('THEN the no-results state is shown', async () => {
      await expect(canvas.getByText(COPY.noResultsTitle('zzzz'))).toBeVisible();
    });
  });
  await step('WHEN a suggestion is picked', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'md' }));

    await step('THEN it becomes the query and spacing results appear', async () => {
      await expect(fieldOf(canvasElement)).toHaveValue('md');
      await waitFor(() => expect(canvas.getByRole('heading', { name: /Spacing/ })).toBeVisible());
    });
  });
}

export const Interactions = meta.story({
  play: async (context) => {
    await context.step('GIVEN the search panel with tokens, components and usage', async () => {
      await emptyAndResults(context);
      await arrowNavigation(context);
      await enterAndEscape(context);
      await noResultsAndSuggestions(context);
    });
  },
});

export const IndexUnavailable = meta.story({
  args: { index: { status: 'error' }, usage: { status: 'idle' } },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('GIVEN the Storybook index failed to load', async () => {
      await step('WHEN a token is searched', async () => {
        await typeQuery(canvasElement, 'surface');

        await step('THEN the failure is explained and token results still work', async () => {
          await expect(canvas.getByText(COPY.indexError)).toBeVisible();
          await expect(canvas.getByRole('heading', { name: /Colors/ })).toBeVisible();
          await expect(canvas.queryByRole('heading', { name: /Components/ })).toBeNull();
        });
      });
    });
  },
});

/**
 * The panel renders in an MDX page, outside story decorators, so it reads the
 * language from the docs globals store. The story sets that store directly
 * (and restores it), which is what the preview does when Locale changes.
 */
export const PolishCopy = meta.story({
  beforeEach: () => {
    const previous = getDocsGlobals();

    setDocsGlobals({ ...previous, locale: 'pl' });

    return () => setDocsGlobals(previous);
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('GIVEN the Locale global is Polish', async () => {
      await step('WHEN nothing is typed', async () => {
        await step('THEN the field and empty state are in Polish', async () => {
          await expect(
            canvas.getByRole('searchbox', { name: POLISH.inputLabel }),
          ).toBeInTheDocument();
          await expect(canvas.getByText(POLISH.emptyTitle)).toBeVisible();
        });
      });
      await step('WHEN "primary" is typed', async () => {
        await userEvent.type(canvas.getByRole('searchbox'), 'primary');

        await step('THEN the summary and groups use Polish wording and plurals', async () => {
          await waitFor(() =>
            expect(canvas.getByText(POLISH.resultSummary(5, 'primary'))).toBeVisible(),
          );
          await expect(canvas.getByRole('heading', { name: /Kolory/ })).toBeVisible();
          await expect(
            canvas.getByRole('button', { name: 'Kopiuj wartość #4F46E5 (jasny)' }),
          ).toBeVisible();
        });
      });
    });
  },
});
