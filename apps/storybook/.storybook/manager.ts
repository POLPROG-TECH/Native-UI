import { addons } from 'storybook/manager-api';
import { nativeTheme } from './theme';

addons.setConfig({
  theme: nativeTheme,
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
