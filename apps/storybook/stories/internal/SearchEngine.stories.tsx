import preview from '../../.storybook/preview';
import type { StoryObj } from '@storybook/react';
import { extractRawRefs } from '../../docs/components/search/tokens/tokenReferences';
import { isUsageSources } from '../../docs/components/search/tokens/tokenUsageSources';
import { expect } from 'storybook/test';
import { searchCatalog, type SearchInput } from '../../docs/components/search/engine/searchEngine';
import { polishNoun } from '../../docs/components/search/polishPlural';
import { parseStorybookIndex } from '../../docs/components/search/data/storybookIndex';
import {
  buildUsageIndex,
  extractTokenRefs,
  knownKeysOf,
  ownsSource,
  sourceOwnerOf,
} from '../../docs/components/search/tokens/tokenUsage';
import {
  FIXTURE_COMPONENTS,
  FIXTURE_INDEX,
  FIXTURE_INDEX_PAYLOAD,
  FIXTURE_TOKENS,
  FIXTURE_USAGE,
} from './searchFixtures';

/** The `step` helper Storybook passes to play functions. */
type Step = Parameters<NonNullable<StoryObj['play']>>[0]['step'];

/**
 * Behavior checks for the pure parts of the docs Search page (ranking, index
 * parsing, token usage scanning). Hidden from the sidebar; run by
 * `npm test` like every other story.
 */
const meta = preview.meta({
  title: 'Internal/Search engine',
  tags: ['!dev', '!autodocs'],
  render: () => <p>Search engine checks run in the play function.</p>,
});

const INPUT: SearchInput = { tokens: FIXTURE_TOKENS, index: FIXTURE_INDEX, usage: FIXTURE_USAGE };

function kindsOf(query: string) {
  return searchCatalog(INPUT, query).map((group) => group.kind);
}

function tokenKeysOf(query: string) {
  return searchCatalog(INPUT, query).flatMap((group) =>
    group.kind === 'component' ? [] : group.hits.map((hit) => hit.entry.key),
  );
}

function firstTokenHref(query: string) {
  const [group] = searchCatalog(INPUT, query);

  return group?.kind === 'component' ? undefined : group?.hits[0]?.href;
}

function componentsOf(query: string) {
  return searchCatalog(INPUT, query).flatMap((group) =>
    group.kind === 'component' ? group.hits : [],
  );
}

async function rankingChecks(step: Step) {
  await step('WHEN the query is "primary"', async () => {
    await step('THEN the exact token ranks first and groups follow page order', async () => {
      await expect(tokenKeysOf('primary')).toEqual(['primary', 'primaryText', 'textPrimary']);
      await expect(kindsOf('primary')).toEqual(['color', 'component']);
    });
    await step('THEN a component is found through the token it uses', async () => {
      const [button] = componentsOf('primary');

      await expect(button?.doc.name).toBe('Button');
      await expect(button?.matchedTokens[0]).toEqual({ path: 'colors.primary', relation: 'uses' });
      await expect(button?.href).toBe('./?path=/docs/components-button--docs');
    });
  });
  await step('WHEN the query has two terms', async () => {
    await step('THEN every term must match', async () => {
      await expect(tokenKeysOf('primary text')).toEqual(['primaryText', 'textPrimary']);
    });
  });
  await step('WHEN the query is blank', async () => {
    await step('THEN there are no groups', async () => {
      await expect(searchCatalog(INPUT, '   ')).toEqual([]);
    });
  });
}

async function valueChecks(step: Step) {
  await step('WHEN the query is a hex value with or without #', async () => {
    await step('THEN the color with that value is found', async () => {
      await expect(tokenKeysOf('#818cf8')).toEqual(['primary']);
      await expect(tokenKeysOf('4f46e5')).toEqual(['primary']);
      await expect(tokenKeysOf('#1619')).toEqual(['surface']);
    });
  });
  await step('WHEN the query is a number', async () => {
    await step('THEN only tokens with exactly that value match', async () => {
      await expect(tokenKeysOf('16')).toEqual(['md']);
      await expect(tokenKeysOf('1')).toEqual([]);
    });
  });
  await step('WHEN a token family has a docs page in the index', async () => {
    await step('THEN its tokens link to the first listed page that exists', async () => {
      await expect(firstTokenHref('primary')).toBe('./?path=/docs/tokens-colors--docs');
      await expect(firstTokenHref('2xl')).toBe('./?path=/docs/tokens-spacing-radii--docs');
    });
  });
  await step('WHEN a token family has no docs page in the index', async () => {
    await step('THEN its tokens have no link', async () => {
      await expect(firstTokenHref('body')).toBeNull();
    });
  });
}

async function indexChecks(step: Step) {
  await step('WHEN the index payload is valid', async () => {
    const index = parseStorybookIndex(FIXTURE_INDEX_PAYLOAD);

    await step('THEN only component docs are listed and malformed entries skipped', async () => {
      await expect(index?.components.map((doc) => doc.name)).toEqual(['Button', 'Icon slot']);
      await expect(index?.docsIdByTitle.get('Tokens/Colors')).toBe('tokens-colors--docs');
      await expect(index?.docsIdByTitle.has('broken--docs')).toBe(false);
    });
  });
  await step('WHEN the payload has no entries object', async () => {
    await step('THEN it is rejected', async () => {
      await expect(parseStorybookIndex({ v: 5 })).toBeNull();
      await expect(parseStorybookIndex('not json')).toBeNull();
      await expect(parseStorybookIndex(null)).toBeNull();
    });
  });
}

const SOURCE = `
  const s = { color: colors.primary, gap: theme.spacing.md, pad: spacing['2xl'] };
  const r = borderRadius.md + colors.length;
  return <Text variant="body" /> && <Button variant="primary" />;
`;

async function usageChecks(step: Step) {
  const known = knownKeysOf(FIXTURE_TOKENS);

  await step('WHEN a source references tokens in every supported form', async () => {
    await step('THEN known tokens are collected and unknown keys ignored', async () => {
      await expect([...extractTokenRefs(SOURCE, known)].sort()).toEqual(
        [
          'borderRadius.md',
          'colors.primary',
          "spacing['2xl']",
          'spacing.md',
          'typography.body',
        ].sort(),
      );
    });
  });
  await step('WHEN files are matched to components', async () => {
    await step('THEN files match exactly and folders match a name prefix', async () => {
      const textFile = sourceOwnerOf('x/packages/native-ui/src/primitives/Text.tsx');
      const fieldFolder = sourceOwnerOf('x/packages/native-ui/src/components/field/styles.ts');

      await expect(textFile && ownsSource('TextArea', textFile)).toBe(false);
      await expect(textFile && ownsSource('Text', textFile)).toBe(true);
      await expect(fieldFolder && ownsSource('FieldLabel', fieldFolder)).toBe(true);
      await expect(sourceOwnerOf('x/packages/native-ui/src/tokens/spacing.ts')).toBeNull();
    });
  });
}

async function usageShapeChecks(step: Step) {
  await step('WHEN the build-time reference module is validated', async () => {
    await step('THEN well-formed data passes and malformed data is rejected', async () => {
      const file = 'x/packages/native-ui/src/components/Button.tsx';

      await expect(
        isUsageSources({ components: { [file]: [['color', 'primary']] }, stories: {} }),
      ).toBe(true);
      await expect(isUsageSources({ components: { [file]: 'colors.primary' }, stories: {} })).toBe(
        false,
      );
      await expect(
        isUsageSources({ components: { [file]: [['shadow', 'md']] }, stories: {} }),
      ).toBe(false);
      await expect(isUsageSources(null)).toBe(false);
    });
  });
}

async function usageIndexChecks(step: Step) {
  await step('WHEN component sources and stories are scanned', async () => {
    const usage = buildUsageIndex(
      FIXTURE_COMPONENTS,
      {
        components: {
          '../../../../../packages/native-ui/src/components/button/styles.ts':
            extractRawRefs('colors.primary'),
          '../../../../../packages/native-ui/src/primitives/Text.tsx':
            extractRawRefs('colors.textPrimary'),
        },
        stories: {
          '../../../../../packages/native-ui/stories/components/TextArea.stories.tsx':
            extractRawRefs('Uses colors.surface for the field.'),
        },
      },
      knownKeysOf(FIXTURE_TOKENS),
    );

    await step('THEN sources count as uses and stories as documents', async () => {
      await expect([...(usage.get('components-button--docs')?.uses ?? [])]).toEqual([
        'colors.primary',
      ]);
      await expect([...(usage.get('components-textarea--docs')?.uses ?? [])]).toEqual([]);
      await expect([...(usage.get('components-textarea--docs')?.documents ?? [])]).toEqual([
        'colors.surface',
      ]);
    });
  });
}

export const Ranking = meta.story({
  play: async ({ step }) => {
    await step('GIVEN a token catalog, a component index and token usage', async () => {
      await rankingChecks(step);
      await valueChecks(step);
    });
  },
});

export const IndexAndUsage = meta.story({
  play: async ({ step }) => {
    await step('GIVEN the raw Storybook index and library sources', async () => {
      await indexChecks(step);
      await usageChecks(step);
      await usageIndexChecks(step);
      await usageShapeChecks(step);
    });
  },
});

const RESULT_FORMS = { one: 'wynik', few: 'wyniki', many: 'wyników' };

export const PolishPlurals = meta.story({
  play: async ({ step }) => {
    await step('GIVEN the three Polish forms of "result"', async () => {
      await step('WHEN counts are given', async () => {
        await step('THEN 1 is singular, 2 to 4 (not 12 to 14) are few, the rest many', async () => {
          const forms = [0, 1, 2, 4, 5, 12, 14, 22, 25].map((count) =>
            polishNoun(count, RESULT_FORMS),
          );

          await expect(forms).toEqual([
            'wyników',
            'wynik',
            'wyniki',
            'wyniki',
            'wyników',
            'wyników',
            'wyników',
            'wyniki',
            'wyników',
          ]);
        });
      });
    });
  },
});
