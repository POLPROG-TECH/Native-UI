#!/usr/bin/env node
/*
 * scripts/generate-stories.mjs
 * Usage: node scripts/generate-stories.mjs [--check] [--fix]
 *   --check: Only report missing stories (exit 1 if any found) - for CI
 *   --fix:   Generate stub stories for missing components (default)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SCAN_DIRS = [
  { src: 'src/components', stories: 'stories/components', storyPrefix: 'Components' },
  { src: 'src/primitives', stories: 'stories/primitives', storyPrefix: 'Primitives' },
];

const SKIP_FILES = new Set(['index.ts', 'index.tsx']);

/**
 * Find the props body of `interface FooProps {}` or `type FooProps = {}`.
 */
function matchPropsBody(source, propsName) {
  const name = escapeRegex(propsName);
  const ifaceRe = new RegExp(
    `(?:export\\s+)?interface\\s+${name}\\s*(?:extends\\s+[^{]+)?\\{([^}]*)\\}`,
    's',
  );
  const typeRe = new RegExp(`(?:export\\s+)?type\\s+${name}\\s*=\\s*\\{([^}]*)\\}`, 's');
  const match = source.match(ifaceRe) ?? source.match(typeRe);

  return match ? match[1] : null;
}

/* Parse each prop line:  name?: Type; */
function parsePropLines(body) {
  return [...body.matchAll(/(\w+)(\?)?:\s*([^;\n]+)/g)].map((m) => ({
    name: m[1],
    optional: m[2] === '?',
    type: m[3].trim(),
  }));
}

function parseSourceFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf-8');

  /*
   * Extract exported component name(s)
   * Matches: export function Foo, export const Foo, export default function Foo
   */
  const exportMatches = [
    ...source.matchAll(/export\s+(?:default\s+)?function\s+(\w+)/g),
    ...source.matchAll(/export\s+const\s+(\w+)\s*[=:]/g),
  ];
  const componentName = exportMatches.length > 0 ? exportMatches[0][1] : null;
  const propsName = componentName ? `${componentName}Props` : null;
  const body = propsName ? matchPropsBody(source, propsName) : null;
  const props = body === null ? [] : parsePropLines(body);

  return { componentName, propsName, props };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* Union of string literals becomes a select; anything unparseable falls back to text. */
function selectControl(type) {
  const options = [...type.matchAll(/'([^']+)'/g)].map((m) => `'${m[1]}'`);

  if (options.length === 0) {
    return `{ control: 'text' }`;
  }

  return `{ control: 'select', options: [${options.join(', ')}] }`;
}

/* Returns null for complex types (ReactNode, ViewStyle, etc.) that get no control. */
function controlFor(prop) {
  const t = prop.type.replace(/\s+/g, ' ');

  if (t === 'boolean') {
    return `{ control: 'boolean' }`;
  }

  if (t === 'string') {
    return `{ control: 'text' }`;
  }

  if (t === 'number') {
    return `{ control: 'number' }`;
  }

  if (t.includes("'") && t.includes('|')) {
    return selectControl(t);
  }

  if (t.startsWith('(') || t.includes('=>')) {
    return `{ action: '${prop.name}' }`;
  }

  return null;
}

function generateArgTypes(props) {
  return props
    .map((prop) => ({ prop, control: controlFor(prop) }))
    .filter(({ control }) => control !== null)
    .map(({ prop, control }) => `    ${prop.name}: ${control},`)
    .join('\n');
}

/*
 * Matches the hand-written stories: automatic JSX runtime (no React import),
 * props-typed meta, and action args declared in argTypes so no import is needed.
 */
function generateStub({ componentName, propsName, props, storyPrefix, relativeSrcPath }) {
  const argTypesBlock = generateArgTypes(props);
  const metaType = propsName ?? `React.ComponentProps<typeof ${componentName}>`;

  const imports = [
    propsName ? null : `import type React from 'react';`,
    `import type { Meta, StoryObj } from '@storybook/react';`,
    `import { ${componentName} } from '${relativeSrcPath}';`,
    propsName ? `import type { ${propsName} } from '${relativeSrcPath}';` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return `${imports}

const meta: Meta<${metaType}> = {
  title: '${storyPrefix}/${componentName}',
  component: ${componentName},
  parameters: {
    docs: {
      description: {
        component: '## ${componentName}\\n\\nGenerated story stub. Add a description and real variants.',
      },
    },
  },
  argTypes: {
${argTypesBlock}
  },
};

export default meta;
type Story = StoryObj<${metaType}>;

export const Default: Story = {
  args: {},
};
`;
}

/**
 * Components in one scan dir whose `<Name>.stories.tsx` does not exist yet.
 */
function missingStoriesIn(dir) {
  const srcDir = path.join(ROOT, dir.src);
  const storiesDir = path.join(ROOT, dir.stories);

  if (!fs.existsSync(srcDir)) {
    return [];
  }

  return fs
    .readdirSync(srcDir)
    .filter((f) => f.endsWith('.tsx') && !SKIP_FILES.has(f))
    .map((file) => {
      const baseName = file.replace(/\.tsx$/, '');
      const storyFile = `${baseName}.stories.tsx`;

      return {
        component: baseName,
        srcPath: path.join(srcDir, file),
        storyPath: path.join(storiesDir, storyFile),
        storyFile,
        storyPrefix: dir.storyPrefix,
        relativeSrcPath: `../../${dir.src}/${baseName}`,
      };
    })
    .filter((entry) => !fs.existsSync(entry.storyPath));
}

function findMissingStories() {
  return SCAN_DIRS.flatMap(missingStoriesIn);
}

function reportMissing(missing) {
  console.log(`${missing.length} component(s) missing stories:\n`);

  for (const m of missing) {
    console.log(`   • ${m.component}  (expected: ${path.relative(ROOT, m.storyPath)})`);
  }

  console.log('\nRun "node scripts/generate-stories.mjs --fix" to generate stubs.');
}

/* Writes one stub and returns whether it was generated (false when the component name is unknown). */
function writeStub(m) {
  const parsed = parseSourceFile(m.srcPath);

  if (!parsed.componentName) {
    console.log(`Skipping ${m.component}: could not detect exported component name.`);

    return false;
  }

  const stub = generateStub({
    componentName: parsed.componentName,
    propsName: parsed.propsName,
    props: parsed.props,
    storyPrefix: m.storyPrefix,
    relativeSrcPath: m.relativeSrcPath,
  });

  fs.mkdirSync(path.dirname(m.storyPath), { recursive: true });
  fs.writeFileSync(m.storyPath, stub, 'utf-8');
  console.log(`Generated: ${path.relative(ROOT, m.storyPath)}`);

  return true;
}

function main() {
  const checkOnly = process.argv.slice(2).includes('--check');
  const missing = findMissingStories();

  if (missing.length === 0) {
    console.log('All components have stories.');
    process.exit(0);
  }

  if (checkOnly) {
    reportMissing(missing);
    process.exit(1);
  }

  /* --fix (default): generate stubs */
  const generated = missing.filter(writeStub).length;

  console.log(
    `\nGenerated ${generated} story stub(s). Add a description and real variants before committing.`,
  );
}

main();
