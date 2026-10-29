import React from 'react';
import { Platform } from 'react-native';
import { act, fireEvent, screen } from '@testing-library/react';
import { Chip } from '../../src/components/Chip';
import { ListItem } from '../../src/components/ListItem';
import { captureTheme, renderWithTheme } from '../test-utils';

function readOutlineColor(): string {
  const theme = captureTheme();

  return theme.components.focusRing.color ?? theme.colors.primaryText;
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

const targets: ReadonlyArray<[string, React.ReactElement, string]> = [
  ['a pressable ListItem', <ListItem title="Profile" onPress={() => undefined} />, 'Profile'],
  ['a Chip', <Chip label="Filter" onPress={() => undefined} />, 'Filter'],
];

describe('focus ring on rows and chips', () => {
  const originalOs = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOs;
  });

  describe.each(targets)('GIVEN %s on web', (_name, ui, accessibleName) => {
    describe('WHEN it receives focus right after a key press', () => {
      it('THEN it draws the themed outline', () => {
        Platform.OS = 'web';
        renderWithTheme(ui);

        pressKey();
        const target = screen.getByLabelText(accessibleName);
        fireEvent.focus(target);

        expect(target).toHaveStyle({ outlineColor: readOutlineColor() });
      });
    });

    describe('WHEN it receives focus from a pointer', () => {
      it('THEN no outline is drawn', () => {
        Platform.OS = 'web';
        renderWithTheme(ui);

        pressPointer();
        const target = screen.getByLabelText(accessibleName);
        fireEvent.focus(target);

        expect(target).not.toHaveStyle({ outlineStyle: 'solid' });
      });
    });

    describe('WHEN it loses focus after keyboard focus', () => {
      it('THEN the outline is removed', () => {
        Platform.OS = 'web';
        renderWithTheme(ui);

        pressKey();
        const target = screen.getByLabelText(accessibleName);
        fireEvent.focus(target);
        fireEvent.blur(target);

        expect(target).not.toHaveStyle({ outlineStyle: 'solid' });
      });
    });
  });
});
