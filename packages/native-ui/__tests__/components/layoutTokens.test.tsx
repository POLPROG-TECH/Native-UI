import React from 'react';
import { Text } from 'react-native';
import { act, screen } from '@testing-library/react';
import { renderWithTheme } from '../test-utils';
import type { NativeUIConfig } from '../../src/theme/types';
import { ActionTile } from '../../src/components/ActionTile';
import { BottomTabBar, type BottomTabBarItem } from '../../src/components/BottomTabBar';
import { Card } from '../../src/components/Card';
import { ConfettiOverlay } from '../../src/components/ConfettiOverlay';
import { Countdown } from '../../src/components/Countdown';
import { ListHeader } from '../../src/components/ListHeader';
import { ListItem } from '../../src/components/ListItem';
import { ListSection } from '../../src/components/ListSection';
import { ListSwitchItem } from '../../src/components/ListSwitchItem';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Section } from '../../src/components/Section';
import { SettingsRow, SettingsSwitchRow } from '../../src/components/SettingsRow';
import { StatTile } from '../../src/components/StatTile';

type ComponentOverrides = NonNullable<NativeUIConfig['components']>;

const TEST_ID = 'subject';

const tabItems: readonly BottomTabBarItem[] = [
  { key: 'home', label: 'Home', icon: () => null, badge: 150 },
];

function renderWithOverrides(ui: React.ReactElement, components?: ComponentOverrides) {
  return renderWithTheme(ui, { config: { colorMode: 'light', components } });
}

/** Every layout component, rendered with `testID` so the root is addressable. */
const subjects: ReadonlyArray<[string, React.ReactElement]> = [
  ['Card', <Card testID={TEST_ID}>{null}</Card>],
  [
    'pressable Card',
    <Card testID={TEST_ID} onPress={() => {}}>
      {null}
    </Card>,
  ],
  ['ListItem', <ListItem testID={TEST_ID} title="Row" />],
  ['pressable ListItem', <ListItem testID={TEST_ID} title="Row" onPress={() => {}} />],
  [
    'ListSwitchItem',
    <ListSwitchItem testID={TEST_ID} label="Wifi" value onValueChange={() => {}} />,
  ],
  ['ListHeader', <ListHeader testID={TEST_ID} title="Title" />],
  ['ListSection', <ListSection testID={TEST_ID}>{null}</ListSection>],
  [
    'Section',
    <Section testID={TEST_ID} title="Title">
      {null}
    </Section>,
  ],
  ['SettingsRow', <SettingsRow testID={TEST_ID} label="Folders" icon="📁" />],
  [
    'SettingsSwitchRow',
    <SettingsSwitchRow testID={TEST_ID} label="Dark" value onValueChange={() => {}} />,
  ],
  ['StatTile', <StatTile testID={TEST_ID} label="TIME" value="01:24" />],
  ['ActionTile', <ActionTile testID={TEST_ID} icon={null} label="Add" onPress={() => {}} />],
  [
    'BottomTabBar',
    <BottomTabBar testID={TEST_ID} items={tabItems} activeKey="home" onSelect={() => {}} />,
  ],
  ['ScreenContainer', <ScreenContainer testID={TEST_ID}>{null}</ScreenContainer>],
  ['Countdown', <Countdown testID={TEST_ID} to={Date.now() + 60_000} />],
  ['ConfettiOverlay', <ConfettiOverlay testID={TEST_ID} visible forceAnimation />],
];

describe('layout components: testID', () => {
  describe('GIVEN a component rendered with a testID', () => {
    describe('WHEN the root is queried by that testID', () => {
      it.each(subjects)('THEN it is found (%s)', (_name, ui) => {
        renderWithTheme(ui);

        const root = screen.getByTestId(TEST_ID);

        expect(root).toBeInTheDocument();
      });
    });
  });
});

/** Returns the element whose style the token drives, given the root. */
type TargetOf = (root: HTMLElement) => Element | null;
const rootItself: TargetOf = (root) => root;
const firstChild: TargetOf = (root) => root.firstElementChild;

const overrideCases: ReadonlyArray<
  [string, React.ReactElement, ComponentOverrides, TargetOf, Record<string, string>]
> = [
  [
    'Card regular size',
    <Card testID={TEST_ID}>{null}</Card>,
    { card: { regular: { padding: 30, radius: 12 } } },
    rootItself,
    { padding: '30px', borderRadius: '12px' },
  ],
  [
    'Card compact size',
    <Card testID={TEST_ID} size="compact">
      {null}
    </Card>,
    { card: { compact: { padding: 6, radius: 4 } } },
    rootItself,
    { padding: '6px', borderRadius: '4px' },
  ],
  [
    'ListItem row height',
    <ListItem testID={TEST_ID} title="Row" />,
    { listItem: { minHeight: 60, paddingVertical: 10 } },
    firstChild,
    { minHeight: '60px', paddingTop: '10px' },
  ],
  [
    'ListSwitchItem row (listItem tokens)',
    <ListSwitchItem testID={TEST_ID} label="Wifi" value onValueChange={() => {}} />,
    { listItem: { paddingHorizontal: 10 } },
    firstChild,
    { paddingLeft: '10px' },
  ],
  [
    'ListHeader size margins',
    <ListHeader testID={TEST_ID} title="Title" size="md" />,
    { listHeader: { md: { marginTop: 4, marginBottom: 30, letterSpacing: undefined } } },
    rootItself,
    { marginTop: '4px', marginBottom: '30px' },
  ],
  [
    'ListSection spacing',
    <ListSection testID={TEST_ID}>{null}</ListSection>,
    { listSection: { marginBottom: 40 } },
    rootItself,
    { marginBottom: '40px' },
  ],
  [
    'Section padding',
    <Section testID={TEST_ID} title="Title">
      {null}
    </Section>,
    { section: { paddingHorizontal: 10, marginBottom: 6 } },
    rootItself,
    { paddingLeft: '10px', marginBottom: '6px' },
  ],
  [
    'StatTile caption spacing',
    <StatTile testID={TEST_ID} label="TIME" value="01:24" caption="best" />,
    { statTile: { captionMarginTop: 6 } },
    (root) => root.lastElementChild,
    { marginTop: '6px' },
  ],
  [
    'ActionTile padding',
    <ActionTile testID={TEST_ID} icon={null} label="Add" onPress={() => {}} />,
    { actionTile: { paddingVertical: 30, radius: 4 } },
    rootItself,
    { paddingTop: '30px', borderRadius: '4px' },
  ],
  [
    'ActionTile icon chip',
    <ActionTile testID={TEST_ID} icon={null} label="Add" onPress={() => {}} />,
    { actionTile: { iconChipSize: 40 } },
    firstChild,
    { width: '40px', height: '40px', borderRadius: '20px' },
  ],
  [
    'BottomTabBar bar padding',
    <BottomTabBar testID={TEST_ID} items={tabItems} activeKey="home" onSelect={() => {}} />,
    { bottomTabBar: { paddingTop: 10, paddingBottomIos: 3 } },
    rootItself,
    { paddingTop: '10px', paddingBottom: '3px' },
  ],
  [
    /*
     * The Pressable mock passes function styles through unflattened, so the
     * icon box (a plain View) carries the assertion for the tab geometry.
     */
    'BottomTabBar icon box',
    <BottomTabBar testID={TEST_ID} items={tabItems} activeKey="home" onSelect={() => {}} />,
    { bottomTabBar: { iconWrapSize: 30 } },
    (root) => root.firstElementChild?.firstElementChild ?? null,
    { width: '30px', height: '30px' },
  ],
  [
    'ScreenContainer padding',
    <ScreenContainer testID={TEST_ID}>{null}</ScreenContainer>,
    { screenContainer: { paddingHorizontal: 10 } },
    rootItself,
    { paddingLeft: '10px' },
  ],
  [
    'ScreenContainer content cap (mock window is 375 wide)',
    <ScreenContainer testID={TEST_ID}>
      <Text>content</Text>
    </ScreenContainer>,
    { screenContainer: { maxContentWidth: 300 } },
    firstChild,
    { maxWidth: '300px' },
  ],
  [
    'ConfettiOverlay layer',
    <ConfettiOverlay testID={TEST_ID} visible forceAnimation particleCount={1} />,
    { confetti: { zIndex: 5 } },
    rootItself,
    { zIndex: '5' },
  ],
];

describe('layout components: component token overrides', () => {
  describe('GIVEN the component rendered under a provider with token overrides', () => {
    describe('WHEN the token-driven element is located from the root', () => {
      it.each(overrideCases)(
        'THEN its style reflects the overridden tokens (%s)',
        (_name, ui, components, targetOf, expected) => {
          renderWithOverrides(ui, components);

          const target = targetOf(screen.getByTestId(TEST_ID));

          expect(target).toHaveStyle(expected);
        },
      );
    });
  });

  describe('GIVEN a regular Card without overrides', () => {
    describe('WHEN the root is inspected', () => {
      it('THEN it uses the historical spacing.lg padding and borderRadius.lg radius', () => {
        renderWithOverrides(<Card testID={TEST_ID}>{null}</Card>);

        const root = screen.getByTestId(TEST_ID);

        expect(root).toHaveStyle({ padding: '24px', borderRadius: '18px' });
      });
    });
  });

  describe('GIVEN a tab badge of 150 and a cap of 9', () => {
    describe('WHEN the badge is rendered', () => {
      it('THEN the overflow suffix uses the token cap', () => {
        renderWithOverrides(
          <BottomTabBar items={tabItems} activeKey="home" onSelect={() => {}} />,
          {
            bottomTabBar: { maxNumericBadge: 9 },
          },
        );

        const badge = screen.getByText('9+');

        expect(badge).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a tab badge of 150 and no overrides', () => {
    describe('WHEN the badge is rendered', () => {
      it('THEN it is capped at 99', () => {
        renderWithOverrides(<BottomTabBar items={tabItems} activeKey="home" onSelect={() => {}} />);

        expect(screen.getByText('99+')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a particle count token of 3', () => {
    describe('WHEN the overlay mounts', () => {
      it('THEN exactly three pieces render', () => {
        renderWithOverrides(<ConfettiOverlay testID={TEST_ID} visible forceAnimation />, {
          confetti: { particleCount: 3 },
        });

        const pieces = screen.getByTestId(TEST_ID).children;

        expect(pieces).toHaveLength(3);
      });
    });
  });
});

describe('SettingsRow icon colors', () => {
  describe('GIVEN an app-wide emoji color and alpha override', () => {
    describe('WHEN the emoji square is inspected', () => {
      it('THEN it uses the token color at the token alpha', () => {
        renderWithOverrides(<SettingsRow label="Rocket" icon="🚀" />, {
          settingsRow: { iconColors: { '🚀': '#FF0000' }, iconTintAlpha: 0.5 },
        });

        const square = screen.getByText('🚀').parentElement;

        expect(square).toHaveStyle({ backgroundColor: 'rgba(255,0,0,0.5)' });
      });
    });
  });

  describe('GIVEN a built-in emoji and no overrides', () => {
    describe('WHEN the emoji square is inspected', () => {
      it('THEN it uses the historical #3B82F6 at ~9% alpha and a 32pt box', () => {
        renderWithOverrides(<SettingsRow label="Folders" icon="📁" />);

        const square = screen.getByText('📁').parentElement;

        expect(square).toHaveStyle({
          backgroundColor: 'rgba(59,130,246,0.094)',
          width: '32px',
          height: '32px',
        });
      });
    });
  });

  describe('GIVEN a token color and a conflicting per-instance color', () => {
    describe('WHEN the emoji square is inspected', () => {
      it('THEN the prop color is used', () => {
        renderWithOverrides(
          <SettingsRow label="Rocket" icon="🚀" iconColorMap={{ '🚀': '#00FF00' }} />,
          { settingsRow: { iconColors: { '🚀': '#FF0000' } } },
        );

        const square = screen.getByText('🚀').parentElement;

        expect(square).toHaveStyle({ backgroundColor: 'rgba(0,255,0,0.094)' });
      });
    });
  });

  describe('GIVEN an unmapped emoji and a custom fallback', () => {
    describe('WHEN the emoji square is inspected', () => {
      it('THEN the fallback color and box size are used', () => {
        renderWithOverrides(<SettingsRow label="Pizza" icon="🍕" />, {
          settingsRow: { fallbackIconColor: '#000000', iconBoxSize: 40 },
        });

        const square = screen.getByText('🍕').parentElement;

        expect(square).toHaveStyle({ backgroundColor: 'rgba(0,0,0,0.094)', width: '40px' });
      });
    });
  });
});

describe('Countdown tick token', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2030-01-01T00:00:00Z'));
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('GIVEN a 10 minute countdown with a 5 s tick token', () => {
    describe('WHEN one second passes the full tick interval passes', () => {
      it('THEN the display has not ticked yet the display catches up', () => {
        renderWithOverrides(<Countdown to={Date.now() + 600_000} format="ms" />, {
          countdown: { tickMs: 5000 },
        });
        expect(screen.getByText('10m 00s')).toBeInTheDocument();

        act(() => {
          jest.advanceTimersByTime(1000);
        });
        expect(screen.getByText('10m 00s')).toBeInTheDocument();

        act(() => {
          jest.advanceTimersByTime(4000);
        });
        expect(screen.getByText('9m 55s')).toBeInTheDocument();
      });
    });
  });
});
