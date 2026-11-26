import { fireEvent, screen } from '@testing-library/react';
import { ActionSheet } from '../../src/components/ActionSheet';
import { captureTheme, renderWithTheme } from '../test-utils';

/*
 * Action handling, cancel and labels. The menu roles as a screen reader sees
 * them are proven in `__tests__/native/ActionSheet.test.tsx`.
 */
describe('ActionSheet', () => {
  describe('GIVEN an open sheet with a share and a delete action', () => {
    describe('WHEN an action is pressed', () => {
      it('THEN the sheet is asked to close before the action runs', () => {
        const calls: string[] = [];
        renderWithTheme(
          <ActionSheet
            visible
            onClose={() => calls.push('close')}
            actions={[
              { label: 'Share', onPress: () => calls.push('share') },
              { label: 'Delete', onPress: () => calls.push('delete'), destructive: true },
            ]}
          />,
        );

        fireEvent.click(screen.getByRole('menuitem', { name: 'Share' }));

        expect(calls).toEqual(['close', 'share']);
      });
    });

    describe('WHEN the destructive action is drawn', () => {
      it('THEN its label uses the readable error color', () => {
        renderWithTheme(
          <ActionSheet
            visible
            onClose={() => {}}
            actions={[{ label: 'Delete', onPress: () => {}, destructive: true }]}
          />,
        );

        expect(screen.getByText('Delete')).toHaveStyle({ color: captureTheme().colors.errorText });
      });
    });

    describe('WHEN the cancel button is pressed', () => {
      it('THEN only onClose is called', () => {
        const onClose = jest.fn();
        const share = jest.fn();
        renderWithTheme(
          <ActionSheet visible onClose={onClose} actions={[{ label: 'Share', onPress: share }]} />,
        );

        fireEvent.click(screen.getByRole('button', { name: captureTheme().labels.cancel }));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(share).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a sheet with a disabled action', () => {
    describe('WHEN the disabled action is pressed', () => {
      it('THEN neither the action nor onClose runs', () => {
        const onClose = jest.fn();
        const archive = jest.fn();
        renderWithTheme(
          <ActionSheet
            visible
            onClose={onClose}
            actions={[{ label: 'Archive', onPress: archive, disabled: true }]}
          />,
        );

        fireEvent.click(screen.getByRole('menuitem', { name: 'Archive' }));

        expect(archive).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a sheet with a title and a custom cancel label', () => {
    describe('WHEN it is rendered', () => {
      it('THEN the title is a header and the cancel button uses the custom label', () => {
        renderWithTheme(
          <ActionSheet
            visible
            onClose={() => {}}
            title="Invoice 2026/11"
            cancelLabel="Keep"
            actions={[{ label: 'Share', onPress: () => {} }]}
          />,
        );

        expect(screen.getByRole('header')).toHaveTextContent('Invoice 2026/11');
        expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a sheet without a cancel button', () => {
    describe('WHEN it is rendered', () => {
      it('THEN the actions are the only menu content', () => {
        renderWithTheme(
          <ActionSheet
            visible
            onClose={() => {}}
            showCancel={false}
            testID="sheet"
            actions={[{ label: 'Share', onPress: () => {} }]}
          />,
        );

        expect(screen.queryByTestId('sheet-cancel')).not.toBeInTheDocument();
        expect(screen.getByTestId('sheet-actions').children).toHaveLength(1);
      });
    });
  });

  describe('GIVEN a closed sheet', () => {
    describe('WHEN it is rendered', () => {
      it('THEN no action is in the tree', () => {
        renderWithTheme(
          <ActionSheet
            visible={false}
            onClose={() => {}}
            actions={[{ label: 'Share', onPress: () => {} }]}
          />,
        );

        expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
      });
    });
  });
});
