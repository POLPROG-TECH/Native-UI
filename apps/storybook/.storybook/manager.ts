import { addons, types } from 'storybook/manager-api';
import { defaultConfig, type TagBadgeParameters } from 'storybook-addon-tag-badges/manager-helpers';
import { AppearanceTool } from './manager/AppearanceTool';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import type { Globals } from 'storybook/internal/types';
import { globalsOf, schemeForGlobals, watchOsScheme } from './schemeSync';
import { darkTheme, lightTheme } from './theme';

const APPEARANCE_ADDON = 'native-ui/appearance';

/**
 * `native-only` marks components whose real behavior depends on native
 * modules (date picker, Alert.prompt, keyboard metrics); the web preview
 * shows a fallback. `beta` / `stable` describe API maturity. Default badges
 * (new, deprecated, ...) follow.
 */
const tagBadges: TagBadgeParameters = [
  {
    tags: 'native-only',
    badge: {
      text: 'Native only',
      style: 'orange',
      tooltip: 'Full behavior needs a device or simulator; the web preview shows a fallback.',
    },
  },
  {
    tags: 'stable',
    badge: { text: 'Stable', style: 'green', tooltip: 'Public API covered by semver.' },
    display: { sidebar: false, toolbar: ['docs', 'story'] },
  },
  ...defaultConfig,
];

addons.setConfig({
  theme: schemeForGlobals(undefined) === 'dark' ? darkTheme : lightTheme,
  tagBadges,
  sidebar: {
    showRoots: true,
    collapsedRoots: ['patterns', 'migration'],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});

addons.register(APPEARANCE_ADDON, (api) => {
  /*
   * The sidebar and toolbar follow the Mode global from the Appearance menu
   * (and the OS while Mode is "system"), like the docs pages do.
   */
  let globals: Globals | undefined;
  const apply = () => {
    api.setOptions({ theme: schemeForGlobals(globals) === 'dark' ? darkTheme : lightTheme });
  };

  const onGlobals = (payload: unknown) => {
    globals = globalsOf(payload) ?? globals;
    apply();
  };

  const channel = addons.getChannel();

  channel.on(SET_GLOBALS, onGlobals);
  channel.on(GLOBALS_UPDATED, onGlobals);
  watchOsScheme(apply);

  addons.add(`${APPEARANCE_ADDON}/tool`, {
    type: types.TOOL,
    title: 'Appearance',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: AppearanceTool,
  });
});
