import { useCallback, useMemo, useState } from 'react';
import { ResolvedThemes, type ThemePair } from './ResolvedThemes';
import { SearchPanel } from './panel/SearchPanel';
import { buildTokenCatalog } from './tokens/tokenCatalog';
import { readyData, useStorybookIndex, useTokenUsage } from './data/useSearchData';

function TokenSearchView({ light, dark }: ThemePair) {
  const tokens = useMemo(() => buildTokenCatalog(light, dark), [light, dark]);
  const index = useStorybookIndex();
  const [engaged, setEngaged] = useState(false);
  const usage = useTokenUsage(engaged, readyData(index), tokens);
  const engage = useCallback(() => setEngaged(true), []);

  return <SearchPanel tokens={tokens} index={index} usage={usage} onEngage={engage} />;
}

/**
 * Instant search across design tokens and component docs. Token values come
 * from the library theme; the component list comes from this Storybook's own
 * index, so neither can drift from what is published.
 */
export function TokenSearch() {
  return <ResolvedThemes>{(themes) => <TokenSearchView {...themes} />}</ResolvedThemes>;
}
