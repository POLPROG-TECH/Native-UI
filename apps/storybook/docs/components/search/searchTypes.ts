/** Token families the search page resolves through the library theme. */
export type TokenKind = 'color' | 'spacing' | 'radius' | 'typography';

/** Every result group, in the order the page can show them. */
export type ResultKind = TokenKind | 'component';

/** Shared identity of a token: its key in the theme scale and its dotted path. */
interface TokenIdentity {
  /** Key inside the scale, e.g. `primary` or `2xl`. */
  key: string;
  /** Path as written in code, e.g. `colors.primary`. */
  path: string;
}

/** A color token with its resolved value in both color modes. */
export interface ColorToken extends TokenIdentity {
  kind: 'color';
  light: string;
  dark: string;
}

/** A spacing or radius step; both are plain numbers in density-independent pixels. */
export interface ScaleToken extends TokenIdentity {
  kind: 'spacing' | 'radius';
  value: number;
}

/** A typography variant, reduced to the metrics people look up. */
export interface TypographyToken extends TokenIdentity {
  kind: 'typography';
  fontSize: number;
  lineHeight: number;
  fontWeight: string;
}

export type TokenEntry = ColorToken | ScaleToken | TypographyToken;

/** A component (or primitive) docs page found in the Storybook index. */
export interface ComponentDoc {
  /** Storybook docs entry id, e.g. `components-button--docs`. */
  id: string;
  /** Last title segment, e.g. `Button`. */
  name: string;
  /** First title segment, e.g. `Components` or `Primitives`. */
  section: string;
  /** Story file the docs page is generated from, relative to the Storybook app. */
  importPath: string;
}

/** Docs pages the search page links to, as read from the Storybook index. */
export interface StorybookDocsIndex {
  components: readonly ComponentDoc[];
  /** Docs entry id by full title, used to link token results to their token page. */
  docsIdByTitle: ReadonlyMap<string, string>;
}

/** How a component relates to a token: its source reads it, or its docs mention it. */
export type TokenRelation = 'uses' | 'documents';

/** Token paths a component reads in its source and mentions in its docs. */
export interface TokenUsage {
  uses: ReadonlySet<string>;
  documents: ReadonlySet<string>;
}

/** Token usage per component docs id. */
export type UsageIndex = ReadonlyMap<string, TokenUsage>;

/** A token result with its relevance score and docs link. */
export interface TokenHit {
  entry: TokenEntry;
  score: number;
  href: string | null;
}

/** A token that put a component into the results. */
export interface MatchedTokenRef {
  path: string;
  relation: TokenRelation;
}

/** A component result with the tokens that matched the query. */
export interface ComponentHit {
  doc: ComponentDoc;
  score: number;
  href: string;
  matchedTokens: readonly MatchedTokenRef[];
}

/** One group of results; `total` counts matches before the per-group cap. */
export type ResultGroup =
  | { kind: TokenKind; hits: readonly TokenHit[]; total: number }
  | { kind: 'component'; hits: readonly ComponentHit[]; total: number };

/** Loading state of an asynchronous data source the page depends on. */
export type AsyncState<T> =
  { status: 'idle' } | { status: 'loading' } | { status: 'ready'; data: T } | { status: 'error' };
