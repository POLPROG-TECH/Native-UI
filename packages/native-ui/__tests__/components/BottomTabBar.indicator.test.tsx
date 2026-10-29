import React from 'react';
import { screen } from '@testing-library/react';
import { BottomTabBar, type BottomTabBarItem } from '../../src/components/BottomTabBar';
import type { NativeUIConfig } from '../../src/theme/types';
import {
  animatedStyleMock,
  captureTheme,
  css,
  evaluateAnimatedStyles,
  renderWithTheme,
} from '../test-utils';

const BAR_ID = 'tabs';
const KEYS = ['home', 'search', 'profile'] as const;

type IconRenderer = BottomTabBarItem['icon'];

function makeItems(icon: IconRenderer = () => null): BottomTabBarItem[] {
  return KEYS.map((key) => ({ key, label: key, icon }));
}

function indicatorOf(key: string): HTMLElement | null {
  return screen.queryByTestId(`${BAR_ID}-${key}-indicator`);
}

describe('BottomTabBar indicator', () => {
  afterEach(() => {
    animatedStyleMock().mockImplementation(() => ({}));
  });

  describe('GIVEN the default tokens and "search" as the active tab', () => {
    describe('WHEN the bar is rendered', () => {
      it('THEN only the search pill is shown, at full width on the primaryLight fill', () => {
        evaluateAnimatedStyles();
        const theme = captureTheme();
        const tokens = theme.components.bottomTabBar;
        renderWithTheme(
          <BottomTabBar
            testID={BAR_ID}
            items={makeItems()}
            activeKey="search"
            onSelect={() => {}}
          />,
        );

        expect(indicatorOf('search')).toHaveStyle(
          css({
            opacity: '1',
            width: `${tokens.indicatorWidth}px`,
            height: `${tokens.indicatorHeight}px`,
            backgroundColor: theme.colors.primaryLight,
          }),
        );
        expect(indicatorOf('home')).toHaveStyle(css({ opacity: '0', width: '0px' }));
        expect(indicatorOf('profile')).toHaveStyle(css({ opacity: '0', width: '0px' }));
      });
    });
  });

  describe('GIVEN an indicatorColor token override', () => {
    describe('WHEN the bar is rendered', () => {
      it('THEN the active pill uses that fill', () => {
        evaluateAnimatedStyles();
        const config: NativeUIConfig = {
          colorMode: 'light',
          components: { bottomTabBar: { indicatorColor: '#ffeeaa' } },
        };
        renderWithTheme(
          <BottomTabBar testID={BAR_ID} items={makeItems()} activeKey="home" onSelect={() => {}} />,
          { config },
        );

        expect(indicatorOf('home')).toHaveStyle({ backgroundColor: '#ffeeaa' });
      });
    });
  });

  describe('GIVEN the indicator token set to "none"', () => {
    describe('WHEN the bar is rendered', () => {
      it('THEN no tab renders a pill', () => {
        const config: NativeUIConfig = {
          colorMode: 'light',
          components: { bottomTabBar: { indicator: 'none' } },
        };
        renderWithTheme(
          <BottomTabBar testID={BAR_ID} items={makeItems()} activeKey="home" onSelect={() => {}} />,
          { config },
        );

        expect(KEYS.map(indicatorOf)).toEqual([null, null, null]);
      });
    });
  });

  describe('GIVEN an icon renderer shared by every tab and "profile" as the active tab', () => {
    describe('WHEN the bar is rendered', () => {
      it('THEN the active icon gets primaryText and inactive icons get textSecondary', () => {
        const theme = captureTheme();
        const icon = jest.fn<React.ReactNode, Parameters<IconRenderer>>(() => null);
        renderWithTheme(
          <BottomTabBar items={makeItems(icon)} activeKey="profile" onSelect={() => {}} />,
        );

        const colorsByFocus = icon.mock.calls.map(([props]) => [props.focused, props.color]);

        expect(colorsByFocus).toEqual([
          [false, theme.colors.textSecondary],
          [false, theme.colors.textSecondary],
          [true, theme.colors.primaryText],
        ]);
      });
    });
  });

  describe('GIVEN "home" as the active tab', () => {
    describe('WHEN the labels are inspected', () => {
      it('THEN the active label stays primaryText and inactive labels textTertiary', () => {
        const theme = captureTheme();
        renderWithTheme(<BottomTabBar items={makeItems()} activeKey="home" onSelect={() => {}} />);

        expect(screen.getByText('home')).toHaveStyle({ color: theme.colors.primaryText });
        expect(screen.getByText('search')).toHaveStyle({ color: theme.colors.textTertiary });
      });
    });
  });

  describe('GIVEN a pill taller than the icon box', () => {
    describe('WHEN the bar is rendered', () => {
      it('THEN the icon box reserves the extra height as vertical margin', () => {
        const config: NativeUIConfig = {
          colorMode: 'light',
          components: { bottomTabBar: { iconWrapSize: 26, indicatorHeight: 32 } },
        };
        renderWithTheme(
          <BottomTabBar testID={BAR_ID} items={makeItems()} activeKey="home" onSelect={() => {}} />,
          { config },
        );

        const iconBox = indicatorOf('home')?.parentElement;

        expect(iconBox).toHaveStyle(css({ marginTop: '3px', marginBottom: '3px' }));
      });
    });
  });
});
