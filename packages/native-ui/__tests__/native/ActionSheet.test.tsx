import { ActionSheet } from '../../src/components/ActionSheet';
import { captureTheme, renderWithTheme, screen, userEvent } from './test-utils';

describe('ActionSheet (real React Native renderer)', () => {
  describe('GIVEN an open sheet with one enabled and one disabled action', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN the actions are menu items inside a menu and cancel is a button', async () => {
        const { cancel } = (await captureTheme()).labels;
        await renderWithTheme(
          <ActionSheet
            visible
            onClose={() => {}}
            title="Invoice 2026/11"
            testID="sheet"
            actions={[
              { label: 'Share', onPress: () => {} },
              { label: 'Archive', onPress: () => {}, disabled: true },
            ]}
          />,
        );

        expect(screen.getByTestId('sheet-actions')).toHaveProp('accessibilityRole', 'menu');
        expect(screen.getByRole('menuitem', { name: 'Share' })).toBeEnabled();
        expect(screen.getByRole('menuitem', { name: 'Archive' })).toBeDisabled();
        expect(screen.getByRole('header', { name: 'Invoice 2026/11' })).toBeOnTheScreen();
        expect(screen.getByRole('button', { name: cancel })).toBeOnTheScreen();
      });
    });

    describe('WHEN the user presses an action', () => {
      it('THEN the sheet closes first and the action runs after it', async () => {
        const calls: string[] = [];
        const user = userEvent.setup();
        await renderWithTheme(
          <ActionSheet
            visible
            onClose={() => calls.push('close')}
            actions={[{ label: 'Share', onPress: () => calls.push('share') }]}
          />,
        );

        await user.press(screen.getByRole('menuitem', { name: 'Share' }));

        expect(calls).toEqual(['close', 'share']);
      });
    });
  });
});
