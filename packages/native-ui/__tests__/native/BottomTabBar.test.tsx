import { BottomTabBar } from '../../src/components/BottomTabBar';
import { renderWithTheme, screen, userEvent } from './test-utils';

const ITEMS = [
  { key: 'home', label: 'Home', icon: () => null },
  { key: 'inbox', label: 'Inbox', icon: () => null },
];

describe('BottomTabBar (real React Native renderer)', () => {
  describe('GIVEN a tab bar with "home" active', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN each item is a tab and only the active one is selected', async () => {
        await renderWithTheme(<BottomTabBar items={ITEMS} activeKey="home" onSelect={() => {}} />);

        expect(screen.getByRole('tab', { name: 'Home' })).toBeSelected();
        expect(screen.getByRole('tab', { name: 'Inbox' })).not.toBeSelected();
      });
    });

    describe('WHEN the user presses another tab', () => {
      it('THEN onSelect receives its key', async () => {
        const onSelect = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(<BottomTabBar items={ITEMS} activeKey="home" onSelect={onSelect} />);

        await user.press(screen.getByRole('tab', { name: 'Inbox' }));

        expect(onSelect).toHaveBeenCalledWith('inbox');
      });
    });
  });
});
