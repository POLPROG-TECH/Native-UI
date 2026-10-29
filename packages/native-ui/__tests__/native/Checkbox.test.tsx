import { Checkbox } from '../../src/components/Checkbox';
import { renderWithTheme, screen, userEvent } from './test-utils';

describe('Checkbox (real React Native renderer)', () => {
  describe('GIVEN a Checkbox configured with an "Accept terms" label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the label text is on screen', () => {
        renderWithTheme(<Checkbox checked={false} onChange={() => {}} label="Accept terms" />);

        expect(screen.getByText('Accept terms')).toBeOnTheScreen();
      });
    });
  });

  describe('GIVEN a checked Checkbox labelled "Accept terms"', () => {
    describe('WHEN it is rendered by the real React Native renderer', () => {
      it('THEN assistive technology sees a checked checkbox with that name', () => {
        renderWithTheme(<Checkbox checked onChange={jest.fn()} label="Accept terms" />);

        expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeChecked();
      });
    });
  });

  describe('GIVEN an unchecked Checkbox', () => {
    describe('WHEN the user presses it', () => {
      it('THEN it is announced as unchecked and asks to become checked', async () => {
        const onChange = jest.fn();
        const user = userEvent.setup();
        renderWithTheme(<Checkbox checked={false} onChange={onChange} label="Accept terms" />);
        const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

        await user.press(checkbox);

        expect(checkbox).not.toBeChecked();
        expect(onChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('GIVEN a disabled Checkbox', () => {
    describe('WHEN the user presses it', () => {
      it('THEN it is announced as disabled and onChange never runs', async () => {
        const onChange = jest.fn();
        const user = userEvent.setup();
        renderWithTheme(
          <Checkbox checked={false} onChange={onChange} label="Accept terms" disabled />,
        );
        const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

        await user.press(checkbox);

        expect(checkbox).toBeDisabled();
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });
});
