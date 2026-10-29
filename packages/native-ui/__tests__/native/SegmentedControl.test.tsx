import { SegmentedControl } from '../../src/components/SegmentedControl';
import { renderWithTheme, screen, userEvent } from './test-utils';

type Mode = 'light' | 'dark' | 'system';

const OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System', disabled: true },
] as const;

describe('SegmentedControl (real React Native renderer)', () => {
  describe('GIVEN a control with "dark" selected', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN a named radiogroup holds the segments and only the selected one is checked', () => {
        /*
         * The group cannot be `accessible` without swallowing its segments on
         * iOS, so RNTL does not expose it by role; TalkBack reads these props.
         */
        renderWithTheme(
          <SegmentedControl<Mode>
            accessibilityLabel="Theme"
            options={OPTIONS}
            value="dark"
            onChange={() => {}}
          />,
        );

        expect(screen.getByLabelText('Theme')).toHaveProp('accessibilityRole', 'radiogroup');
        expect(screen.getByRole('radio', { name: 'Dark' })).toBeChecked();
        expect(screen.getByRole('radio', { name: 'Light' })).not.toBeChecked();
      });
    });
  });

  describe('GIVEN a control whose "system" option is disabled', () => {
    describe('WHEN the disabled segment is pressed', () => {
      it('THEN the change is blocked and the segment is announced as disabled', async () => {
        const onChange = jest.fn();
        const user = userEvent.setup();
        renderWithTheme(
          <SegmentedControl<Mode> options={OPTIONS} value="dark" onChange={onChange} />,
        );
        const system = screen.getByRole('radio', { name: 'System' });

        await user.press(system);

        expect(onChange).not.toHaveBeenCalled();
        expect(system).toBeDisabled();
      });
    });
  });
});
