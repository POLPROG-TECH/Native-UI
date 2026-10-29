import { Switch } from '../../src/components/Switch';
import { fireEvent, renderWithTheme, screen, userEvent } from './test-utils';

describe('Switch (real React Native renderer)', () => {
  /*
   * The label texts are hidden from assistive tech because the row announces
   * them as its name, so the text queries opt in to hidden elements.
   */
  describe('GIVEN a Switch with a "Notifications" label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the label is shown and names the switch', () => {
        renderWithTheme(<Switch value={false} onValueChange={() => {}} label="Notifications" />);

        expect(
          screen.getByText('Notifications', { includeHiddenElements: true }),
        ).toBeOnTheScreen();
        expect(screen.getByRole('switch', { name: 'Notifications' })).toBeOnTheScreen();
      });
    });
  });

  describe('GIVEN a Switch with a subtitle', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the subtitle is shown and completes the switch name', () => {
        renderWithTheme(
          <Switch value onValueChange={() => {}} label="Sounds" subtitle="Play a chirp on tap" />,
        );

        expect(
          screen.getByText('Play a chirp on tap', { includeHiddenElements: true }),
        ).toBeOnTheScreen();
        expect(
          screen.getByRole('switch', { name: 'Sounds, Play a chirp on tap' }),
        ).toBeOnTheScreen();
      });
    });
  });

  describe('GIVEN a labelled Switch that is on', () => {
    describe('WHEN it is rendered by the real React Native renderer', () => {
      it('THEN the row is the only switch announced, named by label and subtitle, because the native control inside it is hidden from accessibility', () => {
        renderWithTheme(
          <Switch value onValueChange={jest.fn()} label="Wi-Fi" subtitle="Connected" />,
        );

        expect(screen.getAllByRole('switch')).toHaveLength(1);
        const control = screen.getByRole('switch', { name: 'Wi-Fi, Connected' });
        expect(control).toBeChecked();
        expect(control).toBeEnabled();
      });
    });
  });

  describe('GIVEN a labelled Switch that is off', () => {
    describe('WHEN the user presses the row', () => {
      it('THEN the row reports unchecked and asks to turn on', async () => {
        const onValueChange = jest.fn();
        const user = userEvent.setup();
        renderWithTheme(<Switch value={false} onValueChange={onValueChange} label="Wi-Fi" />);
        const control = screen.getByRole('switch', { name: 'Wi-Fi' });

        await user.press(control);

        expect(control).not.toBeChecked();
        expect(onValueChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('GIVEN a disabled, labelled Switch', () => {
    describe('WHEN the user presses the row', () => {
      it('THEN it is announced as disabled and the value never changes', async () => {
        const onValueChange = jest.fn();
        const user = userEvent.setup();
        renderWithTheme(<Switch value onValueChange={onValueChange} label="Wi-Fi" disabled />);
        const control = screen.getByRole('switch', { name: 'Wi-Fi' });

        await user.press(control);

        expect(control).toBeDisabled();
        expect(onValueChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN an unlabelled Switch that is off', () => {
    describe('WHEN the native control emits a value change', () => {
      it('THEN the control itself carries the state and forwards the new value', () => {
        const onValueChange = jest.fn();
        renderWithTheme(<Switch value={false} onValueChange={onValueChange} />);
        const control = screen.getByRole('switch');

        fireEvent(control, 'valueChange', true);

        expect(control).not.toBeChecked();
        expect(onValueChange).toHaveBeenCalledWith(true);
      });
    });
  });
});
