#!/usr/bin/env node
/**
 * native-ui Consumer Audit Script
 *
 * Usage: node scripts/audit-consumer.mjs <path-to-app-src>
 * Example: node scripts/audit-consumer.mjs /path/to/your-app/src
 *
 * Scans a consumer app's source code and reports:
 * 1. Raw React Native usage (View, Text, StyleSheet) that should use primitives
 * 2. Hardcoded spacing/color/radius values
 * 3. Adoption rate (native-ui imports vs raw RN imports)
 * 4. Missing design token usage
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, basename } from 'node:path';

const RN_PRIMITIVE_REGEX = /import\s+\{([^}]*)\}\s+from\s+['"]react-native['"]/g;
const NATIVE_UI_IMPORT_REGEX =
  /import\s+\{([^}]*)\}\s+from\s+['"]@polprog\/native-ui(?:\/[^'"]*)?['"]/g;

const RAW_RN_PRIMITIVES = [
  'View',
  'Text',
  'ScrollView',
  'FlatList',
  'SectionList',
  'TouchableOpacity',
  'TouchableHighlight',
  'TouchableWithoutFeedback',
  'Pressable',
];

const HARDCODED_SPACING_REGEX =
  /(?:padding|margin|gap|top|bottom|left|right|paddingHorizontal|paddingVertical|marginHorizontal|marginVertical)\s*:\s*(\d+)/g;
const HARDCODED_COLOR_HEX_REGEX =
  /(?:color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*['"]#[0-9a-fA-F]{3,8}['"]/g;
const HARDCODED_COLOR_RGB_REGEX =
  /(?:color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*['"]rgba?\([^)]+\)['"]/g;
const HARDCODED_FONT_SIZE_REGEX = /fontSize\s*:\s*(\d+)/g;
const HARDCODED_FONT_WEIGHT_REGEX = /fontWeight\s*:\s*['"][^'"]+['"]/g;
const HARDCODED_BORDER_RADIUS_REGEX = /borderRadius\s*:\s*(\d+)/g;

/* Files to skip (non-UI concerns) */
const SKIP_PATTERNS = [
  /\.test\.[tj]sx?$/,
  /\.spec\.[tj]sx?$/,
  /__tests__\//,
  /__mocks__\//,
  /\.d\.ts$/,
  /\/services?\//,
  /\/api\//,
  /\/utils?\//,
  /\/helpers?\//,
  /\/hooks?\//,
  /\/types?\//,
  /\/constants?\//,
  /\/config\//,
  /\/store\//,
  /\/models?\//,
  /\/slices?\//,
  /\/reducers?\//,
  /\/selectors?\//,
];

/* Files to skip for hardcoded-value scanning but NOT for import scanning */
const SKIP_HARDCODED_PATTERNS = [
  /\/services?\//,
  /\/api\//,
  /\/utils?\//,
  /\/helpers?\//,
  /\/hooks?\//,
  /\/types?\//,
  /\/constants?\//,
  /\/config\//,
  /\/store\//,
  /\/models?\//,
  /\/slices?\//,
  /\/reducers?\//,
  /\/selectors?\//,
];

/**
 * Recursively collect all .ts/.tsx files under a directory.
 */
async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    files.push(...(await collectEntryFiles(dir, entry)));
  }

  return files;
}

function isIgnoredDirectory(name) {
  return name === 'node_modules' || name.startsWith('.');
}

async function collectEntryFiles(dir, entry) {
  const fullPath = join(dir, entry.name);

  if (entry.isDirectory()) {
    return isIgnoredDirectory(entry.name) ? [] : collectFiles(fullPath);
  }

  return /\.[tj]sx?$/.test(entry.name) ? [fullPath] : [];
}

function shouldSkipFile(filePath) {
  return SKIP_PATTERNS.some((re) => re.test(filePath));
}

function shouldSkipHardcoded(filePath) {
  return SKIP_HARDCODED_PATTERNS.some((re) => re.test(filePath));
}

function countMatches(content, regex) {
  const matches = content.match(new RegExp(regex.source, regex.flags));

  return matches ? matches.length : 0;
}

function extractImportNames(content, regex) {
  const names = [];
  let m;
  const re = new RegExp(regex.source, regex.flags);
  while ((m = re.exec(content)) !== null) {
    const imports = m[1].split(',').map((s) =>
      s
        .trim()
        .split(/\s+as\s+/)[0]
        .trim(),
    );
    names.push(...imports.filter(Boolean));
  }

  return names;
}

/**
 * JSX usage count per imported raw RN primitive (only primitives actually used).
 */
function countRawPrimitives(content, importedNames) {
  const usage = {};

  for (const prim of RAW_RN_PRIMITIVES) {
    if (!importedNames.includes(prim)) {
      continue;
    }

    const count = countMatches(content, new RegExp(`<${prim}[\\s/>]`, 'g'));

    if (count > 0) {
      usage[prim] = count;
    }
  }

  return usage;
}

function emptyHardcoded() {
  return { spacing: 0, colors: 0, fontSize: 0, fontWeight: 0, borderRadius: 0 };
}

function countHardcoded(content) {
  return {
    spacing: countMatches(content, HARDCODED_SPACING_REGEX),
    colors:
      countMatches(content, HARDCODED_COLOR_HEX_REGEX) +
      countMatches(content, HARDCODED_COLOR_RGB_REGEX),
    fontSize: countMatches(content, HARDCODED_FONT_SIZE_REGEX),
    fontWeight: countMatches(content, HARDCODED_FONT_WEIGHT_REGEX),
    borderRadius: countMatches(content, HARDCODED_BORDER_RADIUS_REGEX),
  };
}

async function scanFile(filePath, rootDir) {
  const content = await readFile(filePath, 'utf-8');
  const relPath = relative(rootDir, filePath);
  const rnImports = extractImportNames(content, RN_PRIMITIVE_REGEX);

  return {
    path: relPath,
    rnImports,
    nativeUiImports: extractImportNames(content, NATIVE_UI_IMPORT_REGEX),
    rawPrimitiveUsage: countRawPrimitives(content, rnImports),
    stylesheetCreate: rnImports.includes('StyleSheet')
      ? countMatches(content, /StyleSheet\.create/g)
      : 0,
    /* Non-UI files (services, hooks, ...) legitimately hold raw values. */
    hardcoded: shouldSkipHardcoded(relPath) ? emptyHardcoded() : countHardcoded(content),
    /* Numeric spacing access: theme.spacing[16] instead of theme.spacing.lg */
    tokenCompliance: {
      numericSpacingAccess: countMatches(content, /theme\.spacing\[\d+\]/g),
    },
  };
}

function grade(pct) {
  if (pct >= 90) {
    return 'A';
  }

  if (pct >= 70) {
    return 'B';
  }

  if (pct >= 50) {
    return 'C';
  }

  return 'D';
}

function sumValues(counts) {
  return Object.values(counts).reduce((a, b) => a + b, 0);
}

function rawUsageScore(result) {
  return sumValues(result.rawPrimitiveUsage) + result.stylesheetCreate;
}

function addCounts(target, source) {
  for (const key of Object.keys(target)) {
    target[key] += source[key];
  }
}

/**
 * Fold per-file results into project totals and the per-section file lists.
 */
function aggregate(results) {
  const totals = {
    nativeUiImports: 0,
    rnImports: 0,
    styleSheetCreate: 0,
    numericSpacingAccess: 0,
    hardcoded: emptyHardcoded(),
  };
  const rawUsageFiles = [];
  const hardcodedFiles = [];
  const tokenIssueFiles = [];

  for (const r of results) {
    totals.nativeUiImports += r.nativeUiImports.length;
    totals.rnImports += r.rnImports.length;
    totals.styleSheetCreate += r.stylesheetCreate;
    totals.numericSpacingAccess += r.tokenCompliance.numericSpacingAccess;
    addCounts(totals.hardcoded, r.hardcoded);

    if (rawUsageScore(r) > 0) {
      rawUsageFiles.push(r);
    }

    if (sumValues(r.hardcoded) > 0) {
      hardcodedFiles.push({ ...r, hardcodedTotal: sumValues(r.hardcoded) });
    }

    if (r.tokenCompliance.numericSpacingAccess > 0) {
      tokenIssueFiles.push(r);
    }
  }

  return { totals, rawUsageFiles, hardcodedFiles, tokenIssueFiles };
}

function printHeader(appName, adoptionGrade, adoptionPct) {
  console.log('');
  console.log('native-ui consumer audit');
  console.log(`  App: ${appName}`);
  console.log(`  Score: ${adoptionGrade} (${adoptionPct}%)`);
  console.log('');
}

function printAdoptionMetrics(totals, adoptionPct) {
  console.log('Adoption metrics:');
  console.log(`  native-ui imports: ${totals.nativeUiImports}`);
  console.log(`  Raw RN imports: ${totals.rnImports}`);
  console.log(`  Adoption rate: ${adoptionPct}%`);
  console.log(`  StyleSheet.create calls: ${totals.styleSheetCreate}`);
  console.log('');
}

function printMoreFiles(total, limit, indent) {
  if (total <= limit) {
    return;
  }

  console.log(`${indent}... and ${total - limit} more files`);
}

function describeRawUsage(file) {
  const parts = Object.entries(file.rawPrimitiveUsage).map(([prim, count]) => `${count} <${prim}>`);

  if (file.stylesheetCreate > 0) {
    parts.push(`${file.stylesheetCreate} StyleSheet.create`);
  }

  return parts.join(', ');
}

function printRawUsageSection(files) {
  if (files.length === 0) {
    console.log('Raw React Native usage: none found.');

    return;
  }

  console.log('Raw React Native usage (should migrate):');
  const sorted = files.sort((a, b) => rawUsageScore(b) - rawUsageScore(a));

  for (const file of sorted.slice(0, 20)) {
    console.log(`  ${file.path}: ${describeRawUsage(file)}`);
  }

  printMoreFiles(sorted.length, 20, '  ');
}

function describeHardcoded(file) {
  return Object.keys(file.hardcoded)
    .filter((key) => file.hardcoded[key] > 0)
    .map((key) => `${key}: ${file.hardcoded[key]}`)
    .join(', ');
}

function printHardcodedSection(files, hardcoded) {
  if (files.length === 0) {
    console.log('Hardcoded values: none found.');

    return;
  }

  console.log('Hardcoded values found:');
  console.log(`  Spacing (padding/margin/gap): ${hardcoded.spacing} occurrences`);
  console.log(`  Colors (hex/rgb): ${hardcoded.colors} occurrences`);
  console.log(`  Font sizes: ${hardcoded.fontSize} occurrences`);
  console.log(`  Font weights: ${hardcoded.fontWeight} occurrences`);
  console.log(`  Border radii: ${hardcoded.borderRadius} occurrences`);
  console.log('');
  console.log('  Top offenders:');
  const sorted = files.sort((a, b) => b.hardcodedTotal - a.hardcodedTotal);

  for (const file of sorted.slice(0, 15)) {
    console.log(`    ${file.path} (${describeHardcoded(file)})`);
  }

  printMoreFiles(sorted.length, 15, '    ');
}

function printNumericSpacingIssues(count, files) {
  if (count === 0) {
    return;
  }

  console.log(`  ${count} numeric spacing accesses (use theme.spacing.md, not theme.spacing[16])`);

  for (const file of files.slice(0, 10)) {
    console.log(`    ${file.path}: ${file.tokenCompliance.numericSpacingAccess} occurrences`);
  }
}

function printTokenCompliance(compliancePct, totals, tokenIssueFiles) {
  console.log(`Token compliance: ${compliancePct}%`);
  printNumericSpacingIssues(totals.numericSpacingAccess, tokenIssueFiles);

  if (totals.hardcoded.colors > 0) {
    console.log(`  ${totals.hardcoded.colors} direct color hex/rgb values in style objects`);
  }

  console.log('');
}

function printSummary(fileCount, issueFileCount) {
  console.log('─'.repeat(44));
  console.log(`Files scanned: ${fileCount}`);
  console.log(`Total issues: ${issueFileCount} files with findings`);
  console.log('');
}

function printReport(results, rootDir) {
  const { totals, rawUsageFiles, hardcodedFiles, tokenIssueFiles } = aggregate(results);
  const totalImports = totals.nativeUiImports + totals.rnImports;
  const adoptionPct =
    totalImports > 0 ? ((totals.nativeUiImports / totalImports) * 100).toFixed(1) : '0.0';
  const appName = basename(rootDir) === 'src' ? basename(join(rootDir, '..')) : basename(rootDir);

  /*
   * Token compliance heuristic: native-ui imports count as "compliant" style
   * values against the hardcoded ones.
   */
  const complianceBase = totals.nativeUiImports + sumValues(totals.hardcoded);
  const compliancePct =
    complianceBase > 0 ? ((totals.nativeUiImports / complianceBase) * 100).toFixed(1) : '100.0';

  printHeader(appName, grade(parseFloat(adoptionPct)), adoptionPct);
  printAdoptionMetrics(totals, adoptionPct);
  printRawUsageSection(rawUsageFiles);
  console.log('');
  printHardcodedSection(hardcodedFiles, totals.hardcoded);
  console.log('');
  printTokenCompliance(compliancePct, totals, tokenIssueFiles);
  printSummary(
    results.length,
    rawUsageFiles.length + hardcodedFiles.length + tokenIssueFiles.length,
  );
}

async function assertDirectory(targetDir) {
  let info;

  try {
    info = await stat(targetDir);
  } catch {
    console.error(`Error: ${targetDir} does not exist`);
    process.exit(1);
  }

  if (!info.isDirectory()) {
    console.error(`Error: ${targetDir} is not a directory`);
    process.exit(1);
  }
}

async function main() {
  const targetDir = process.argv[2];

  if (!targetDir) {
    console.error('Usage: node scripts/audit-consumer.mjs <path-to-app-src>');
    console.error('Example: node scripts/audit-consumer.mjs /path/to/your-app/src');
    process.exit(1);
  }

  await assertDirectory(targetDir);

  const allFiles = await collectFiles(targetDir);
  const uiFiles = allFiles.filter((f) => !shouldSkipFile(f));

  if (uiFiles.length === 0) {
    console.error('No .ts/.tsx files found in the target directory.');
    process.exit(1);
  }

  const results = await Promise.all(uiFiles.map((f) => scanFile(f, targetDir)));

  printReport(results, targetDir);
}

main().catch((err) => {
  console.error('Audit failed:', err.message);
  process.exit(1);
});
