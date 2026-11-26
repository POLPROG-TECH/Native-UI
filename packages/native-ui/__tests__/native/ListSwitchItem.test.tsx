import { ListSwitchItem } from '../../src/components/ListSwitchItem';
import { fireEvent, renderWithTheme, screen } from './test-utils';

describe('ListSwitchItem (real React Native renderer)', () => {
  describe('GIVEN a switch row that is off', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN one switch is announced, named by the row label and subtitle', async () => {
        await renderWithTheme(
          <ListSwitchItem
            label="Notifications"
            subtitle="Daily summary"
            value={false}
            onValueChange={() => {}}
          />,
        );

        expect(screen.getAllByRole('switch')).toHaveLength(1);
        expect(
          screen.getByRole('switch', { name: 'Notifications, Daily summary' }),
        ).toBeOnTheScreen();
      });
    });

    describe('WHEN the native switch is flipped', () => {
      it('THEN onValueChange receives the new value', async () => {
        const onValueChange = jest.fn();
        await renderWithTheme(
          <ListSwitchItem label="Notifications" value={false} onValueChange={onValueChange} />,
        );

        await fireEvent(screen.getByRole('switch', { name: 'Notifications' }), 'valueChange', true);

        expect(onValueChange).toHaveBeenCalledWith(true);
      });
    });
  });
});
