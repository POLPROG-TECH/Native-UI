import { Text } from 'react-native';
import { KeyboardLiftedFooter } from '../../src/components/KeyboardLiftedFooter';
import type { MeasurableView } from '../../src/hooks/useKeyboardLift';
import { captureKeyboardListeners, keyboardAt } from '../shared/keyboard';
import { act, captureTheme, css, renderWithTheme, screen } from '../test-utils';

type MeasureCallback = Parameters<MeasurableView['measure']>[0];

const FOOTER_ID = 'footer';

/**
 * jsdom elements have no `measure`; give the rendered footer one that
 * reports its bottom edge at y = 600 + 56 = 656 in screen coordinates.
 */
function placeFooterEndingAt656(): void {
  const footer = screen.getByTestId(FOOTER_ID);
  Object.assign(footer, {
    measure: (callback: MeasureCallback) => callback(0, 0, 320, 56, 0, 600),
  });
}

function renderFooter(enabled?: boolean) {
  return renderWithTheme(
    <KeyboardLiftedFooter testID={FOOTER_ID} enabled={enabled} style={{ padding: 8 }}>
      <Text>Save</Text>
    </KeyboardLiftedFooter>,
  );
}

describe('KeyboardLiftedFooter', () => {
  beforeEach(() => {
    jest.spyOn(global, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);

      return 0;
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GIVEN an enabled footer ending at y = 656', () => {
    describe('WHEN the keyboard shows with its top edge at y = 400', () => {
      it('THEN the footer moves up by the overlap and is raised above the content', () => {
        const listeners = captureKeyboardListeners();
        const { liftedElevation } = captureTheme().components.keyboardLiftedFooter;
        renderFooter(true);
        placeFooterEndingAt656();

        act(() => listeners.get('keyboardDidShow')?.(keyboardAt(400)));

        expect(screen.getByTestId(FOOTER_ID)).toHaveStyle(
          css({
            padding: '8px',
            transform: 'translateY(-256px)',
            zIndex: String(liftedElevation),
          }),
        );
      });
    });

    describe('WHEN the keyboard shows and then hides', () => {
      it('THEN the footer returns to its place in the layout', () => {
        const listeners = captureKeyboardListeners();
        renderFooter(true);
        placeFooterEndingAt656();

        act(() => listeners.get('keyboardDidShow')?.(keyboardAt(400)));
        act(() => listeners.get('keyboardDidHide')?.(keyboardAt(812)));

        const footer = screen.getByTestId(FOOTER_ID);
        expect(footer).toHaveStyle({ padding: '8px' });
        expect(footer.style.transform).toBe('');
        expect(footer.style.zIndex).toBe('');
      });
    });
  });

  describe('GIVEN a footer with the default `enabled` on iOS', () => {
    describe('WHEN it mounts', () => {
      it('THEN it shows its content and does not listen to the keyboard', () => {
        const listeners = captureKeyboardListeners();

        renderFooter();

        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(listeners.size).toBe(0);
      });
    });
  });
});
