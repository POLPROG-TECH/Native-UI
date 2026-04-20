#!/usr/bin/env node
// scripts/generate-stories.mjs
// Usage: node scripts/generate-stories.mjs [--check] [--fix]
//   --check: Only report missing stories (exit 1 if any found) — for CI
//   --fix:   Generate stub stories for missing components (default)

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

// ---------------------------------------------------------------------------
// Source file parsing
// ---------------------------------------------------------------------------

function parseSourceFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf-8');

  // Extract exported component name(s)
  // Matches: export function Foo, export const Foo, export default function Foo
  const exportMatches = [
    ...source.matchAll(/export\s+(?:default\s+)?function\s+(\w+)/g),
    ...source.matchAll(/export\s+const\s+(\w+)\s*[=:]/g),
  ];
  const componentName = exportMatches.length > 0 ? exportMatches[0][1] : null;

  // Extract Props interface/type
  // Matches: interface FooProps { ... } or type FooProps = { ... }
  const propsName = componentName ? `${componentName}Props` : null;
  const props = [];

  if (propsName) {
    // Try interface first
    const ifaceRe = new RegExp(
      `(?:export\\s+)?interface\\s+${escapeRegex(propsName)}\\s*(?:extends\\s+[^{]+)?\\{([^}]*)\\}`,
      's',
    );
    let match = source.match(ifaceRe);

    // Try type alias
    if (!match) {
      const typeRe = new RegExp(
        `(?:export\\s+)?type\\s+${escapeRegex(propsName)}\\s*=\\s*\\{([^}]*)\\}`,
        's',
      );
      match = source.match(typeRe);
    }

    if (match) {
      const body = match[1];
      // Parse each prop line:  name?: Type;
      const propRe = /(\w+)(\?)?:\s*([^;\n]+)/g;
      let propMatch;
      while ((propMatch = propRe.exec(body)) !== null) {
        props.push({
          name: propMatch[1],
          optional: propMatch[2] === '?',
          type: propMatch[3].trim(),
        });
      }
    }
  }

  return { componentName, propsName, props };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// Story stub generation
// ---------------------------------------------------------------------------

function generateArgTypes(props) {
  const lines = [];
  for (const prop of props) {
    const t = prop.type.replace(/\s+/g, ' ');
    // Determine control type
    let control;
    if (t === 'boolean') {
      control = `{ control: 'boolean' }`;
    } else if (t === 'string') {
      control = `{ control: 'text' }`;
    } else if (t === 'number') {
      control = `{ control: 'number' }`;
    } else if (t.includes("'") && t.includes('|')) {
      // Union of string literals → select
      const options = [...t.matchAll(/'([^']+)'/g)].map((m) => `'${m[1]}'`);
      if (options.length > 0) {
        control = `{ control: 'select', options: [${options.join(', ')}] }`;
      } else {
        control = `{ control: 'text' }`;
      }
    } else if (t.startsWith('(') || t.includes('=>')) {
      control = `{ action: '${prop.name}' }`;
    } else {
      continue; // skip complex types (ReactNode, ViewStyle, etc.)
    }
    lines.push(`    ${prop.name}: ${control},`);
  }
  return lines.join('\n');
}

function generateStub({ componentName, propsName, props, storyPrefix, relativeSrcPath }) {
  const hasActions = props.some((p) => p.type.startsWith('(') || p.type.includes('=>'));
  const argTypesBlock = generateArgTypes(props);

  const imports = [
    `import React from 'react';`,
    `import type { Meta, StoryObj } from '@storybook/react';`,
    hasActions ? `import { action } from '@storybook/addon-actions';` : null,
    `import { ${componentName} } from '${relativeSrcPath}';`,
    propsName ? `import type { ${propsName} } from '${relativeSrcPath}';` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const typeAnnotation = propsName ? `<${propsName}>` : '<any>';
  const storyType = propsName ? `StoryObj<${propsName}>` : 'StoryObj<any>';

  return `// TODO: Flesh out this auto-generated story with more variants and examples.
${imports}

const meta: Meta${typeAnnotation} = {
  title: '${storyPrefix}/${componentName}',
  component: ${componentName},
  parameters: {
    docs: {
      description: {
        component: '## ${componentName}\\n\\nAuto-generated story stub. Add a description and more stories.',
      },
    },
  },
  argTypes: {
${argTypesBlock}
  },
};

export default meta;
type Story = ${storyType};

export const Default: Story = {
  args: {},
};
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function findMissingStories() {
  const missing = [];

  for (const dir of SCAN_DIRS) {
    const srcDir = path.join(ROOT, dir.src);
    const storiesDir = path.join(ROOT, dir.stories);

    if (!fs.existsSync(srcDir)) continue;

    const srcFiles = fs.readdirSync(srcDir).filter((f) => f.endsWith('.tsx') && !SKIP_FILES.has(f));

    for (const file of srcFiles) {
      const baseName = file.replace(/\.tsx$/, '');
      const storyFile = `${baseName}.stories.tsx`;
      const storyPath = path.join(storiesDir, storyFile);

      if (!fs.existsSync(storyPath)) {
        const srcPath = path.join(srcDir, file);
        const relativeSrcPath = `../../${dir.src}/${baseName}`;
        missing.push({
          component: baseName,
          srcPath,
          storyPath,
          storyFile,
          storyPrefix: dir.storyPrefix,
          relativeSrcPath,
        });
      }
    }
  }

  return missing;
}

function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check');

  const missing = findMissingStories();

  if (missing.length === 0) {
    console.log('✅ All components have stories.');
    process.exit(0);
  }

  if (checkOnly) {
    console.log(`❌ ${missing.length} component(s) missing stories:\n`);
    for (const m of missing) {
      console.log(`   • ${m.component}  (expected: ${path.relative(ROOT, m.storyPath)})`);
    }
    console.log('\nRun "node scripts/generate-stories.mjs --fix" to generate stubs.');
    process.exit(1);
  }

  // --fix (default): generate stubs
  let generated = 0;
  for (const m of missing) {
    const parsed = parseSourceFile(m.srcPath);

    if (!parsed.componentName) {
      console.log(`⚠️  Skipping ${m.component} — could not detect exported component name.`);
      continue;
    }

    const stub = generateStub({
      componentName: parsed.componentName,
      propsName: parsed.propsName,
      props: parsed.props,
      storyPrefix: m.storyPrefix,
      relativeSrcPath: m.relativeSrcPath,
    });

    // Ensure stories directory exists
    const dir = path.dirname(m.storyPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(m.storyPath, stub, 'utf-8');
    console.log(`📝 Generated: ${path.relative(ROOT, m.storyPath)}`);
    generated++;
  }

  console.log(`\n✅ Generated ${generated} story stub(s). Review and flesh them out!`);
}

main();
