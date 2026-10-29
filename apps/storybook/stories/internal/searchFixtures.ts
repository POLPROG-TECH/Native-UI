import type {
  ComponentDoc,
  StorybookDocsIndex,
  TokenEntry,
  UsageIndex,
} from '../../docs/components/search/searchTypes';

/** A small, hand-written catalog so assertions do not depend on the live theme values. */
export const FIXTURE_TOKENS: readonly TokenEntry[] = [
  { kind: 'color', key: 'primary', path: 'colors.primary', light: '#4F46E5', dark: '#818CF8' },
  {
    kind: 'color',
    key: 'primaryText',
    path: 'colors.primaryText',
    light: '#4338CA',
    dark: '#A5B4FC',
  },
  {
    kind: 'color',
    key: 'textPrimary',
    path: 'colors.textPrimary',
    light: '#0F172A',
    dark: '#F8FAFC',
  },
  { kind: 'color', key: 'surface', path: 'colors.surface', light: '#FFFFFF', dark: '#161922' },
  { kind: 'spacing', key: 'md', path: 'spacing.md', value: 16 },
  { kind: 'spacing', key: '2xl', path: "spacing['2xl']", value: 40 },
  { kind: 'radius', key: 'md', path: 'borderRadius.md', value: 14 },
  {
    kind: 'typography',
    key: 'body',
    path: 'typography.body',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
];

const doc = (section: string, name: string, file: string): ComponentDoc => ({
  id: `${section.toLowerCase()}-${name.toLowerCase()}--docs`,
  name,
  section,
  importPath: `../../packages/native-ui/stories/${section.toLowerCase()}/${file}.stories.tsx`,
});

export const FIXTURE_COMPONENTS: readonly ComponentDoc[] = [
  doc('Components', 'Button', 'Button'),
  doc('Components', 'TextArea', 'TextArea'),
  doc('Primitives', 'Text', 'Text'),
];

export const FIXTURE_INDEX: StorybookDocsIndex = {
  components: FIXTURE_COMPONENTS,
  docsIdByTitle: new Map([
    ['Tokens/Colors', 'tokens-colors--docs'],
    ['Tokens/Spacing & Radii', 'tokens-spacing-radii--docs'],
  ]),
};

export const FIXTURE_USAGE: UsageIndex = new Map([
  [
    'components-button--docs',
    { uses: new Set(['colors.primary', 'spacing.md']), documents: new Set<string>() },
  ],
  [
    'components-textarea--docs',
    { uses: new Set<string>(), documents: new Set(['colors.textPrimary']) },
  ],
]);

/** A Storybook `index.json` payload with one entry of each kind the parser must handle. */
export const FIXTURE_INDEX_PAYLOAD: unknown = {
  v: 5,
  entries: {
    'components-button--docs': {
      id: 'components-button--docs',
      title: 'Components/Button',
      name: 'Docs',
      type: 'docs',
      importPath: '../../packages/native-ui/stories/components/Button.stories.tsx',
    },
    'components-button--primary': {
      id: 'components-button--primary',
      title: 'Components/Button',
      name: 'Primary',
      type: 'story',
      importPath: '../../packages/native-ui/stories/components/Button.stories.tsx',
    },
    'primitives-icon-slot--docs': {
      id: 'primitives-icon-slot--docs',
      title: 'Primitives/Icon slot',
      name: 'Docs',
      type: 'docs',
      importPath: '../../packages/native-ui/stories/primitives/iconSlot.stories.tsx',
    },
    'tokens-colors--docs': {
      id: 'tokens-colors--docs',
      title: 'Tokens/Colors',
      name: 'Docs',
      type: 'docs',
      importPath: '../../packages/native-ui/stories/tokens/Colors.stories.tsx',
    },
    'broken--docs': { id: 'broken--docs', type: 'docs' },
  },
};
