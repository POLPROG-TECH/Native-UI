import { Tabs } from '../../src/components/Tabs';
import { renderWithTheme, screen, userEvent } from './test-utils';

type OrderTab = 'open' | 'done' | 'archived';

const TABS = [
  { value: 'open', label: 'Open' },
  { value: 'done', label: 'Completed' },
  { value: 'archived', label: 'Archived', disabled: true },
] as const;

describe('Tabs (real React Native renderer)', () => {
  describe('GIVEN tabs with "open" selected', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN a named tab list holds the tabs and only the selected one is selected', async () => {
        /*
         * The list cannot be `accessible` without swallowing its tabs on iOS,
         * so RNTL does not expose it by role; TalkBack reads these props.
         */
        await renderWithTheme(
          <Tabs<OrderTab>
            accessibilityLabel="Orders"
            tabs={TABS}
            value="open"
            onChange={() => {}}
          />,
        );

        expect(screen.getByLabelText('Orders')).toHaveProp('accessibilityRole', 'tablist');
        expect(screen.getByRole('tab', { name: 'Open' })).toBeSelected();
        expect(screen.getByRole('tab', { name: 'Completed' })).not.toBeSelected();
      });
    });

    describe('WHEN the user presses another tab', () => {
      it('THEN onChange receives its value', async () => {
        const onChange = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(<Tabs<OrderTab> tabs={TABS} value="open" onChange={onChange} />);

        await user.press(screen.getByRole('tab', { name: 'Completed' }));

        expect(onChange).toHaveBeenCalledWith('done');
      });
    });

    describe('WHEN the user presses a disabled tab', () => {
      it('THEN the change is blocked and the tab is announced as disabled', async () => {
        const onChange = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(<Tabs<OrderTab> tabs={TABS} value="open" onChange={onChange} />);
        const archived = screen.getByRole('tab', { name: 'Archived' });

        await user.press(archived);

        expect(onChange).not.toHaveBeenCalled();
        expect(archived).toBeDisabled();
      });
    });
  });
});
