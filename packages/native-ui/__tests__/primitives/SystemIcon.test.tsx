import { I18nManager } from 'react-native';
import { screen } from '@testing-library/react';
import { SystemIcon, type SystemIconName } from '../../src/primitives/SystemIcon';
import { renderWithTheme } from '../test-utils';

const NAMES: readonly SystemIconName[] = [
  'close',
  'check',
  'alert',
  'info',
  'chevronDown',
  'chevronUp',
  'chevronLeft',
  'chevronRight',
  'plus',
  'minus',
  'search',
  'more',
];

function chevronRotation(testID: string): string {
  const box = screen.getByTestId(testID);
  const stroke = box.firstElementChild;

  if (!(stroke instanceof HTMLElement)) {
    throw new Error('chevron stroke not rendered');
  }

  return stroke.style.transform;
}

describe('SystemIcon', () => {
  afterEach(() => {
    I18nManager.isRTL = false;
  });

  describe('GIVEN an icon of 24 points', () => {
    describe('WHEN it renders', () => {
      it.each(NAMES)(
        'THEN the box has the requested size and contains drawn strokes (%s)',
        (name) => {
          renderWithTheme(<SystemIcon name={name} size={24} testID="icon" />);

          const box = screen.getByTestId('icon');
          expect(box).toHaveStyle({ width: '24px', height: '24px' });
          expect(box.childElementCount).toBeGreaterThan(0);
        },
      );
    });
  });

  describe('GIVEN the plus and minus glyphs', () => {
    describe('WHEN both render', () => {
      it('THEN plus draws one more stroke than minus', () => {
        renderWithTheme(<SystemIcon name="plus" testID="plus" />);
        renderWithTheme(<SystemIcon name="minus" testID="minus" />);

        expect(screen.getByTestId('plus').childElementCount).toBe(2);
        expect(screen.getByTestId('minus').childElementCount).toBe(1);
      });
    });
  });

  describe('GIVEN the more glyph', () => {
    describe('WHEN it renders', () => {
      it('THEN three dots are drawn in the requested color', () => {
        renderWithTheme(<SystemIcon name="more" color="#ff0000" testID="more" />);

        const row = screen.getByTestId('more').firstElementChild;
        expect(row?.childElementCount).toBe(3);
        expect(row?.firstElementChild).toHaveStyle({ backgroundColor: '#ff0000' });
      });
    });
  });

  describe('GIVEN the search glyph', () => {
    describe('WHEN it renders', () => {
      it('THEN a ring lens in the requested color and a handle are drawn', () => {
        renderWithTheme(<SystemIcon name="search" color="#00ff00" testID="search" />);

        const box = screen.getByTestId('search');
        expect(box.childElementCount).toBe(2);
        expect(box.firstElementChild).toHaveStyle({ borderColor: '#00ff00' });
      });
    });
  });

  describe('GIVEN an icon without a size', () => {
    describe('WHEN it renders', () => {
      it('THEN the medium icon token is used', () => {
        renderWithTheme(<SystemIcon name="close" testID="icon" />);

        expect(screen.getByTestId('icon')).toHaveStyle({ width: '20px' });
      });
    });
  });

  describe('GIVEN the left-to-right rotation of a left chevron', () => {
    describe('WHEN the layout is right-to-left', () => {
      it('THEN the left chevron is drawn like a right one and vice versa', () => {
        renderWithTheme(<SystemIcon name="chevronLeft" testID="ltr" />);
        const ltr = chevronRotation('ltr');

        I18nManager.isRTL = true;
        renderWithTheme(<SystemIcon name="chevronLeft" testID="rtl" />);
        renderWithTheme(<SystemIcon name="chevronRight" testID="rtl-right" />);

        expect(chevronRotation('rtl')).not.toBe(ltr);
        expect(chevronRotation('rtl-right')).toBe(ltr);
      });
    });
  });
});
