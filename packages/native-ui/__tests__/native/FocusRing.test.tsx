import React from 'react';
import { Platform } from 'react-native';
import { BottomTabBar } from '../../src/components/BottomTabBar';
import { Checkbox } from '../../src/components/Checkbox';
import { Radio } from '../../src/components/Radio';
import { act, captureTheme, fireEvent, renderWithTheme, screen } from './test-utils';

/*
 * Native platforms move focus only from a hardware keyboard or D-pad, so a
 * focus event alone must draw the ring. These controls compute their style
 * from the pressed state, which only the real Pressable resolves.
 */

function readThemeOutlineColor(): string {
  const theme = captureTheme();

  return theme.components.focusRing.color ?? theme.colors.primaryText;
}

/** Stand-in for the browser `document` the input modality tracker listens on. */
const fakeDocument = new EventTarget();

/** Runs the rest of the test as React Native Web, where focus can also follow a click. */
function emulateWeb(): void {
  jest.replaceProperty(Platform, 'OS', 'web');
  Reflect.set(globalThis, 'document', fakeDocument);
}

function focusAfter(
  inputEvent: 'keydown' | 'pointerdown',
  target: ReturnType<typeof screen.getByLabelText>,
) {
  act(() => {
    fakeDocument.dispatchEvent(new Event(inputEvent));
  });
  act(() => {
    fireEvent(target, 'focus');
  });
}

const controls: ReadonlyArray<[string, React.ReactElement, string]> = [
  ['a Checkbox', <Checkbox checked={false} onChange={() => {}} label="Accept" />, 'Accept'],
  ['a Radio', <Radio selected={false} onPress={() => {}} label="Weekly" />, 'Weekly'],
  [
    'a BottomTabBar tab',
    <BottomTabBar
      items={[
        { key: 'home', label: 'Home', icon: () => null },
        { key: 'inbox', label: 'Inbox', icon: () => null },
      ]}
      activeKey="home"
      onSelect={() => {}}
    />,
    'Inbox',
  ],
];

describe('focus ring (real React Native renderer)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    Reflect.deleteProperty(globalThis, 'document');
  });

  describe.each(controls)('GIVEN %s', (_name, ui, accessibleName) => {
    describe('WHEN it receives focus', () => {
      it('THEN it draws the themed outline', () => {
        const outlineColor = readThemeOutlineColor();
        renderWithTheme(ui);
        const target = screen.getByLabelText(accessibleName);

        act(() => {
          fireEvent(target, 'focus');
        });

        expect(target).toHaveStyle({ outlineStyle: 'solid', outlineWidth: 2, outlineColor });
      });
    });

    describe('WHEN it receives focus and then loses it', () => {
      it('THEN the outline is gone', () => {
        renderWithTheme(ui);
        const target = screen.getByLabelText(accessibleName);

        act(() => {
          fireEvent(target, 'focus');
        });
        act(() => {
          fireEvent(target, 'blur');
        });

        expect(target).not.toHaveStyle({ outlineStyle: 'solid' });
      });
    });

    describe('WHEN it is rendered without focus', () => {
      it('THEN no outline is drawn', () => {
        renderWithTheme(ui);

        const target = screen.getByLabelText(accessibleName);

        expect(target).not.toHaveStyle({ outlineStyle: 'solid' });
      });
    });

    describe('WHEN it receives focus on web right after a key press', () => {
      it('THEN it draws the themed outline', () => {
        const outlineColor = readThemeOutlineColor();
        emulateWeb();
        renderWithTheme(ui);
        const target = screen.getByLabelText(accessibleName);

        focusAfter('keydown', target);

        expect(target).toHaveStyle({ outlineStyle: 'solid', outlineWidth: 2, outlineColor });
      });
    });

    describe('WHEN it receives focus on web right after a pointer press', () => {
      it('THEN only the browser outline is suppressed and no ring is drawn', () => {
        emulateWeb();
        renderWithTheme(ui);
        const target = screen.getByLabelText(accessibleName);

        focusAfter('pointerdown', target);

        expect(target).toHaveStyle({ outlineWidth: 0 });
        expect(target).not.toHaveStyle({ outlineStyle: 'solid' });
      });
    });
  });
});
