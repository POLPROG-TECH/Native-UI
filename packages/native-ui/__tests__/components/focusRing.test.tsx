import React from 'react';
import { Platform } from 'react-native';
import { act, fireEvent, screen } from '@testing-library/react';
import { DatePickerInput } from '../../src/components/DatePickerInput';
import { SearchBar } from '../../src/components/SearchBar';
import { SegmentedControl } from '../../src/components/SegmentedControl';
import { captureTheme, renderWithTheme } from '../test-utils';

const OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
] as const;

/** Every control below that draws the ring from a plain (non-callback) style. */
const controls: ReadonlyArray<[string, React.ReactElement, string]> = [
  [
    'a SegmentedControl segment',
    <SegmentedControl options={OPTIONS} value="day" onChange={() => {}} />,
    'Week',
  ],
  [
    'a DatePickerInput trigger',
    <DatePickerInput label="Start" value="2025-01-15" onChange={() => {}} />,
    'Start',
  ],
  [
    'a DatePickerInput clear button',
    <DatePickerInput
      label="Start"
      value="2025-01-15"
      onChange={() => {}}
      clearable
      clearAccessibilityLabel="Clear date"
    />,
    'Clear date',
  ],
  [
    'a SearchBar clear button',
    <SearchBar value="abc" onChangeText={() => {}} placeholder="Search" />,
    'Clear search',
  ],
];

/** The themed ring as jest-dom compares it: computed CSS strings. */
function readExpectedRing(): Record<string, string> {
  const theme = captureTheme();
  const tokens = theme.components.focusRing;

  return {
    outlineStyle: 'solid',
    outlineWidth: `${tokens.width}px`,
    outlineColor: tokens.color ?? theme.colors.primaryText,
  };
}

/** The modality tracker listens on `document` in the capture phase. */
function pressKey(): void {
  act(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
  });
}

function pressPointer(): void {
  act(() => {
    document.dispatchEvent(new Event('pointerdown'));
  });
}

function focusTarget(name: string): HTMLElement {
  const target = screen.getByLabelText(name);
  fireEvent.focus(target);

  return target;
}

describe('focus ring on raw Pressable controls', () => {
  const originalOs = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOs;
  });

  describe.each(controls)('GIVEN %s on web', (_name, ui, accessibleName) => {
    describe('WHEN it receives focus right after a key press', () => {
      it('THEN it draws the themed outline', () => {
        Platform.OS = 'web';
        const expectedRing = readExpectedRing();
        renderWithTheme(ui);

        pressKey();
        const target = focusTarget(accessibleName);

        expect(target).toHaveStyle(expectedRing);
      });
    });

    describe('WHEN it receives focus right after a pointer press', () => {
      it('THEN it suppresses the outline', () => {
        Platform.OS = 'web';
        renderWithTheme(ui);

        pressPointer();
        const target = focusTarget(accessibleName);

        expect(target.style.outlineWidth).toBe('0');
        expect(target.style.outlineStyle).toBe('');
      });
    });

    describe('WHEN it loses keyboard focus', () => {
      it('THEN the outline is removed', () => {
        Platform.OS = 'web';
        renderWithTheme(ui);

        pressKey();
        const target = focusTarget(accessibleName);
        fireEvent.blur(target);

        expect(target.style.outlineWidth).toBe('0');
        expect(target.style.outlineStyle).toBe('');
      });
    });
  });
});
