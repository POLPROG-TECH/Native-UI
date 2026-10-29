import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../test-utils';
import type { NativeUIConfig } from '../../src/theme/types';
import { Box } from '../../src/primitives/Box';
import { VStack, HStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';
import { Heading } from '../../src/primitives/Heading';
import { Divider } from '../../src/primitives/Divider';
import { SectionLabel } from '../../src/primitives/SectionLabel';
import { MarqueeText } from '../../src/primitives/MarqueeText';
import { PaginationDots } from '../../src/primitives/PaginationDots';
import { PressableScale } from '../../src/primitives/PressableScale';
import { planMarqueeScroll, shouldMarqueeScroll } from '../../src/primitives/marqueeMotion';

type ComponentOverrides = NonNullable<NativeUIConfig['components']>;

const TEST_ID = 'subject';

function renderWithOverrides(ui: React.ReactElement, components?: ComponentOverrides) {
  return renderWithTheme(ui, { config: { colorMode: 'light', components } });
}

const subjects: ReadonlyArray<[string, React.ReactElement]> = [
  ['Box', <Box testID={TEST_ID} />],
  ['VStack', <VStack testID={TEST_ID} />],
  ['HStack', <HStack testID={TEST_ID} />],
  ['Text', <Text testID={TEST_ID}>Body</Text>],
  ['Heading', <Heading testID={TEST_ID}>Title</Heading>],
  ['Divider', <Divider testID={TEST_ID} />],
  ['SectionLabel', <SectionLabel testID={TEST_ID}>Account</SectionLabel>],
  ['MarqueeText', <MarqueeText testID={TEST_ID} text="Scrolling" />],
  ['PaginationDots', <PaginationDots testID={TEST_ID} count={3} current={0} />],
  ['PressableScale', <PressableScale testID={TEST_ID}>{null}</PressableScale>],
];

describe('primitives: testID', () => {
  describe('GIVEN a primitive rendered with a testID', () => {
    describe('WHEN the root is queried by that testID', () => {
      it.each(subjects)('THEN it is found (%s)', (_name, ui) => {
        renderWithTheme(ui);

        const root = screen.getByTestId(TEST_ID);

        expect(root).toBeInTheDocument();
      });
    });
  });
});

type TargetOf = (root: HTMLElement) => Element | null;
const rootItself: TargetOf = (root) => root;

const overrideCases: ReadonlyArray<
  [string, React.ReactElement, ComponentOverrides, TargetOf, Record<string, string>]
> = [
  [
    'Divider thickness',
    <Divider testID={TEST_ID} />,
    { divider: { thickness: 2 } },
    rootItself,
    { height: '2px' },
  ],
  [
    'SectionLabel spacing',
    <SectionLabel testID={TEST_ID}>Account</SectionLabel>,
    { sectionLabel: { marginTop: 4, paddingHorizontal: 10 } },
    rootItself,
    { marginTop: '4px', paddingLeft: '10px' },
  ],
  [
    'PaginationDots gap',
    <PaginationDots testID={TEST_ID} count={3} current={0} />,
    { paginationDots: { gap: 10 } },
    rootItself,
    { gap: '10px' },
  ],
  [
    'PaginationDots dot height',
    <PaginationDots testID={TEST_ID} count={3} current={0} />,
    { paginationDots: { height: 8 } },
    (root) => root.firstElementChild,
    { height: '8px', borderRadius: '4px' },
  ],
];

describe('primitives: component token overrides', () => {
  describe('GIVEN the primitive rendered under a provider with token overrides', () => {
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

  describe('GIVEN dots without overrides', () => {
    describe('WHEN the row and its first dot are inspected', () => {
      it('THEN the gap is 6 and the dot height 5', () => {
        renderWithOverrides(<PaginationDots testID={TEST_ID} count={3} current={0} />);

        const root = screen.getByTestId(TEST_ID);

        expect(root).toHaveStyle({ gap: '6px' });
        expect(root.firstElementChild).toHaveStyle({ height: '5px' });
      });
    });
  });

  describe('GIVEN a gap token and a conflicting gap prop', () => {
    describe('WHEN the row is inspected', () => {
      it('THEN the prop value is used', () => {
        renderWithOverrides(<PaginationDots testID={TEST_ID} count={3} current={0} gap={2} />, {
          paginationDots: { gap: 10 },
        });

        expect(screen.getByTestId(TEST_ID)).toHaveStyle({ gap: '2px' });
      });
    });
  });
});

describe('marqueeMotion', () => {
  describe('GIVEN 60pt of overflow, the default 40pt gap and 30pt/s', () => {
    describe('WHEN the scroll leg is planned', () => {
      it('THEN it travels 100pt in 100/30 s', () => {
        const plan = planMarqueeScroll(60, 40, 30);

        expect(plan.distance).toBe(100);
        expect(plan.durationMs).toBeCloseTo((100 / 30) * 1000);
      });
    });
  });

  describe('GIVEN measured widths and a tolerance', () => {
    describe('WHEN the scroll decision is made', () => {
      it.each([
        ['overflow above the tolerance', 110, 100, 2, true],
        ['overflow equal to the tolerance', 102, 100, 2, false],
        ['text that fits', 80, 100, 2, false],
        ['an unmeasured container', 110, 0, 2, false],
        ['an unmeasured text', 0, 100, 2, false],
      ])('THEN it matches the expectation (%s)', (_case, text, container, tolerance, expected) => {
        const actual = shouldMarqueeScroll(text, container, tolerance);

        expect(actual).toBe(expected);
      });
    });
  });
});
