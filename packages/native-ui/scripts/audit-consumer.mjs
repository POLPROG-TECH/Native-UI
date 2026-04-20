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
import { join, relative, basename, extname } from 'node:path';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const RN_PRIMITIVE_REGEX =
  /import\s+\{([^}]*)\}\s+from\s+['"]react-native['"]/g;
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

const RAW_RN_STYLING = ['StyleSheet'];

const HARDCODED_SPACING_REGEX =
  /(?:padding|margin|gap|top|bottom|left|right|paddingHorizontal|paddingVertical|marginHorizontal|marginVertical)\s*:\s*(\d+)/g;
const HARDCODED_COLOR_HEX_REGEX =
  /(?:color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*['"]#[0-9a-fA-F]{3,8}['"]/g;
const HARDCODED_COLOR_RGB_REGEX =
  /(?:color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*['"]rgba?\([^)]+\)['"]/g;
const HARDCODED_FONT_SIZE_REGEX = /fontSize\s*:\s*(\d+)/g;
const HARDCODED_FONT_WEIGHT_REGEX = /fontWeight\s*:\s*['"][^'"]+['"]/g;
const HARDCODED_BORDER_RADIUS_REGEX = /borderRadius\s*:\s*(\d+)/g;

// Files to skip (non-UI concerns)
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

// Files to skip for hardcoded-value scanning but NOT for import scanning
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Recursively collect all .ts/.tsx files under a directory.
 */
async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      files.push(...(await collectFiles(fullPath)));
    } else if (/\.[tj]sx?$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
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
    const imports = m[1].split(',').map((s) => s.trim().split(/\s+as\s+/)[0].trim());
    names.push(...imports.filter(Boolean));
  }
  return names;
}

// ---------------------------------------------------------------------------
// Scanning
// ---------------------------------------------------------------------------

async function scanFile(filePath, rootDir) {
  const content = await readFile(filePath, 'utf-8');
  const relPath = relative(rootDir, filePath);

  const result = {
    path: relPath,
    rnImports: [],
    nativeUiImports: [],
    rawPrimitiveUsage: {},
    stylesheetCreate: 0,
    hardcoded: {
      spacing: 0,
      colors: 0,
      fontSize: 0,
      fontWeight: 0,
      borderRadius: 0,
    },
    tokenCompliance: {
      numericSpacingAccess: 0,
    },
  };

  // --- Import analysis (always) ---
  const rnImportNames = extractImportNames(content, RN_PRIMITIVE_REGEX);
  result.rnImports = rnImportNames;

  const nativeUiImportNames = extractImportNames(
    content,
    NATIVE_UI_IMPORT_REGEX,
  );
  result.nativeUiImports = nativeUiImportNames;

  // Count raw RN primitive JSX usage
  for (const prim of RAW_RN_PRIMITIVES) {
    if (rnImportNames.includes(prim)) {
      const jsxOpen = new RegExp(`<${prim}[\\s/>]`, 'g');
      const count = countMatches(content, jsxOpen);
      if (count > 0) {
        result.rawPrimitiveUsage[prim] = count;
      }
    }
  }

  // StyleSheet.create
  if (rnImportNames.includes('StyleSheet')) {
    const ssCount = countMatches(content, /StyleSheet\.create/g);
    result.stylesheetCreate = ssCount;
  }

  // --- Hardcoded values (skip non-UI files) ---
  if (!shouldSkipHardcoded(relPath)) {
    result.hardcoded.spacing = countMatches(content, HARDCODED_SPACING_REGEX);
    result.hardcoded.colors =
      countMatches(content, HARDCODED_COLOR_HEX_REGEX) +
      countMatches(content, HARDCODED_COLOR_RGB_REGEX);
    result.hardcoded.fontSize = countMatches(content, HARDCODED_FONT_SIZE_REGEX);
    result.hardcoded.fontWeight = countMatches(
      content,
      HARDCODED_FONT_WEIGHT_REGEX,
    );
    result.hardcoded.borderRadius = countMatches(
      content,
      HARDCODED_BORDER_RADIUS_REGEX,
    );
  }

  // --- Token compliance ---
  // Numeric spacing access: theme.spacing[16] instead of theme.spacing.lg
  const numericAccess = countMatches(
    content,
    /theme\.spacing\[\d+\]/g,
  );
  result.tokenCompliance.numericSpacingAccess = numericAccess;

  return result;
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function grade(pct) {
  if (pct >= 90) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 50) return 'C';
  return 'D';
}

function printReport(results, rootDir) {
  // Aggregate
  let totalNativeUiImports = 0;
  let totalRnImports = 0;
  let totalHardcodedSpacing = 0;
  let totalHardcodedColors = 0;
  let totalHardcodedFontSize = 0;
  let totalHardcodedFontWeight = 0;
  let totalHardcodedBorderRadius = 0;
  let totalStyleSheetCreate = 0;
  let totalNumericSpacingAccess = 0;
  let totalStyleValues = 0;

  const rawUsageFiles = [];
  const hardcodedFiles = [];
  const tokenIssueFiles = [];

  for (const r of results) {
    totalNativeUiImports += r.nativeUiImports.length;
    totalRnImports += r.rnImports.length;

    const rawCount = Object.values(r.rawPrimitiveUsage).reduce(
      (a, b) => a + b,
      0,
    );
    if (rawCount > 0 || r.stylesheetCreate > 0) {
      rawUsageFiles.push(r);
    }

    const hTotal =
      r.hardcoded.spacing +
      r.hardcoded.colors +
      r.hardcoded.fontSize +
      r.hardcoded.fontWeight +
      r.hardcoded.borderRadius;
    if (hTotal > 0) {
      hardcodedFiles.push({ ...r, hardcodedTotal: hTotal });
    }
    totalHardcodedSpacing += r.hardcoded.spacing;
    totalHardcodedColors += r.hardcoded.colors;
    totalHardcodedFontSize += r.hardcoded.fontSize;
    totalHardcodedFontWeight += r.hardcoded.fontWeight;
    totalHardcodedBorderRadius += r.hardcoded.borderRadius;
    totalStyleSheetCreate += r.stylesheetCreate;

    if (r.tokenCompliance.numericSpacingAccess > 0) {
      tokenIssueFiles.push(r);
    }
    totalNumericSpacingAccess += r.tokenCompliance.numericSpacingAccess;

    totalStyleValues +=
      r.hardcoded.spacing +
      r.hardcoded.fontSize +
      r.hardcoded.borderRadius;
  }

  const totalImports = totalNativeUiImports + totalRnImports;
  const adoptionPct =
    totalImports > 0
      ? ((totalNativeUiImports / totalImports) * 100).toFixed(1)
      : '0.0';
  const adoptionGrade = grade(parseFloat(adoptionPct));

  const appName = basename(rootDir) === 'src'
    ? basename(join(rootDir, '..'))
    : basename(rootDir);

  const totalHardcoded =
    totalHardcodedSpacing +
    totalHardcodedColors +
    totalHardcodedFontSize +
    totalHardcodedFontWeight +
    totalHardcodedBorderRadius;

  // Token compliance: percentage of style values using tokens vs hardcoded
  // Simple heuristic: count native-ui imports as "compliant" style values
  const complianceBase = totalNativeUiImports + totalHardcoded;
  const compliancePct =
    complianceBase > 0
      ? ((totalNativeUiImports / complianceBase) * 100).toFixed(1)
      : '100.0';

  // --- Print ---
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║     native-ui Consumer Audit Report      ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║ App: ${appName.padEnd(35)}║`);
  console.log(
    `║ Score: ${adoptionGrade} (${adoptionPct}%)`.padEnd(43) + '║',
  );
  console.log('╚══════════════════════════════════════════╝');
  console.log('');

  // --- Adoption Metrics ---
  console.log('📊 Adoption Metrics:');
  console.log(`  native-ui imports: ${totalNativeUiImports}`);
  console.log(`  Raw RN imports: ${totalRnImports}`);
  console.log(`  Adoption rate: ${adoptionPct}%`);
  console.log(`  StyleSheet.create calls: ${totalStyleSheetCreate}`);
  console.log('');

  // --- Raw RN Usage ---
  if (rawUsageFiles.length > 0) {
    console.log('🔍 Raw RN Usage (should migrate):');
    const sorted = rawUsageFiles.sort((a, b) => {
      const aCount =
        Object.values(a.rawPrimitiveUsage).reduce((x, y) => x + y, 0) +
        a.stylesheetCreate;
      const bCount =
        Object.values(b.rawPrimitiveUsage).reduce((x, y) => x + y, 0) +
        b.stylesheetCreate;
      return bCount - aCount;
    });

    for (const file of sorted.slice(0, 20)) {
      const parts = [];
      for (const [prim, count] of Object.entries(file.rawPrimitiveUsage)) {
        parts.push(`${count} <${prim}>`);
      }
      if (file.stylesheetCreate > 0) {
        parts.push(`${file.stylesheetCreate} StyleSheet.create`);
      }
      console.log(`  ${file.path}: ${parts.join(', ')}`);
    }
    if (sorted.length > 20) {
      console.log(`  ... and ${sorted.length - 20} more files`);
    }
  } else {
    console.log('🔍 Raw RN Usage: None found! 🎉');
  }
  console.log('');

  // --- Hardcoded Values ---
  if (hardcodedFiles.length > 0) {
    console.log('⚠️  Hardcoded Values Found:');
    console.log(
      `  Spacing (padding/margin/gap): ${totalHardcodedSpacing} occurrences`,
    );
    console.log(`  Colors (hex/rgb): ${totalHardcodedColors} occurrences`);
    console.log(`  Font sizes: ${totalHardcodedFontSize} occurrences`);
    console.log(`  Font weights: ${totalHardcodedFontWeight} occurrences`);
    console.log(`  Border radii: ${totalHardcodedBorderRadius} occurrences`);
    console.log('');
    console.log('  Top offenders:');

    const sortedHardcoded = hardcodedFiles.sort(
      (a, b) => b.hardcodedTotal - a.hardcodedTotal,
    );
    for (const file of sortedHardcoded.slice(0, 15)) {
      const details = [];
      if (file.hardcoded.spacing > 0) details.push(`spacing: ${file.hardcoded.spacing}`);
      if (file.hardcoded.colors > 0) details.push(`colors: ${file.hardcoded.colors}`);
      if (file.hardcoded.fontSize > 0) details.push(`fontSize: ${file.hardcoded.fontSize}`);
      if (file.hardcoded.fontWeight > 0) details.push(`fontWeight: ${file.hardcoded.fontWeight}`);
      if (file.hardcoded.borderRadius > 0) details.push(`borderRadius: ${file.hardcoded.borderRadius}`);
      console.log(`    ${file.path} (${details.join(', ')})`);
    }
    if (sortedHardcoded.length > 15) {
      console.log(`    ... and ${sortedHardcoded.length - 15} more files`);
    }
  } else {
    console.log('⚠️  Hardcoded Values: None found! 🎉');
  }
  console.log('');

  // --- Token Compliance ---
  console.log(`✅ Token Compliance: ${compliancePct}%`);
  if (totalNumericSpacingAccess > 0) {
    console.log(
      `  ⚠ ${totalNumericSpacingAccess} numeric spacing accesses (use theme.spacing.md, not theme.spacing[16])`,
    );
    for (const file of tokenIssueFiles.slice(0, 10)) {
      console.log(
        `    ${file.path}: ${file.tokenCompliance.numericSpacingAccess} occurrences`,
      );
    }
  }
  if (totalHardcodedColors > 0) {
    console.log(
      `  ⚠ ${totalHardcodedColors} direct color hex/rgb values in style objects`,
    );
  }
  console.log('');

  // --- Summary ---
  console.log('─'.repeat(44));
  console.log(`Files scanned: ${results.length}`);
  console.log(
    `Total issues: ${
      Object.values(rawUsageFiles).length +
      hardcodedFiles.length +
      tokenIssueFiles.length
    } files with findings`,
  );
  console.log('');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const targetDir = process.argv[2];

  if (!targetDir) {
    console.error(
      'Usage: node scripts/audit-consumer.mjs <path-to-app-src>',
    );
    console.error(
      'Example: node scripts/audit-consumer.mjs /path/to/your-app/src',
    );
    process.exit(1);
  }

  // Validate the directory exists
  try {
    const s = await stat(targetDir);
    if (!s.isDirectory()) {
      console.error(`Error: ${targetDir} is not a directory`);
      process.exit(1);
    }
  } catch {
    console.error(`Error: ${targetDir} does not exist`);
    process.exit(1);
  }

  const allFiles = await collectFiles(targetDir);
  const uiFiles = allFiles.filter((f) => !shouldSkipFile(f));

  if (uiFiles.length === 0) {
    console.error('No .ts/.tsx files found in the target directory.');
    process.exit(1);
  }

  const results = await Promise.all(
    uiFiles.map((f) => scanFile(f, targetDir)),
  );

  printReport(results, targetDir);
}

main().catch((err) => {
  console.error('Audit failed:', err.message);
  process.exit(1);
});
