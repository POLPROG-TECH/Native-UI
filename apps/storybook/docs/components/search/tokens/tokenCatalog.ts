import type { Theme } from '@polprog/native-ui';
import { TOKEN_PATH_PREFIX } from '../searchConfig';
import type {
  ColorToken,
  ScaleToken,
  TokenEntry,
  TokenKind,
  TypographyToken,
} from '../searchTypes';

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

/** Token path as written in code: `colors.primary`, or `spacing['2xl']` for keys that need quotes. */
export function tokenPath(kind: TokenKind, key: string): string {
  const prefix = TOKEN_PATH_PREFIX[kind];

  return IDENTIFIER.test(key) ? `${prefix}.${key}` : `${prefix}['${key}']`;
}

/**
 * Color tokens with string values in both modes. `chart` is a list of series
 * colors rather than one token, so it is left out.
 */
function colorTokens(light: Theme, dark: Theme): ColorToken[] {
  const darkByKey = new Map<string, unknown>(Object.entries(dark.colors));

  return Object.entries(light.colors).flatMap(([key, lightValue]) => {
    const darkValue = darkByKey.get(key);

    if (typeof lightValue !== 'string' || typeof darkValue !== 'string') {
      return [];
    }

    const token: ColorToken = {
      kind: 'color',
      key,
      path: tokenPath('color', key),
      light: lightValue,
      dark: darkValue,
    };

    return [token];
  });
}

function scaleTokens(kind: ScaleToken['kind'], scale: Record<string, number>): ScaleToken[] {
  return Object.entries(scale).map(([key, value]) => ({
    kind,
    key,
    path: tokenPath(kind, key),
    value,
  }));
}

function typographyTokens(typography: Theme['typography']): TypographyToken[] {
  return Object.entries(typography).map(([key, style]) => ({
    kind: 'typography',
    key,
    path: tokenPath('typography', key),
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    fontWeight: style.fontWeight,
  }));
}

/**
 * Every searchable token, read from resolved themes. Only colors differ
 * between modes; spacing, radius and typography come from the light theme.
 */
export function buildTokenCatalog(light: Theme, dark: Theme): TokenEntry[] {
  return [
    ...colorTokens(light, dark),
    ...scaleTokens('spacing', light.spacing),
    ...scaleTokens('radius', light.borderRadius),
    ...typographyTokens(light.typography),
  ];
}

/** The value a token row shows and copies. */
export function tokenValueText(entry: Exclude<TokenEntry, ColorToken>): string {
  if (entry.kind === 'typography') {
    return `${entry.fontSize}/${entry.lineHeight} ${entry.fontWeight}`;
  }

  return String(entry.value);
}
