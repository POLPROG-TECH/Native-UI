import type { ComponentProps } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { Accordion } from '../../src/components/Accordion';
import { Text } from '../../src/primitives/Text';
import { configureHaptics } from '../../src/utils/haptics';
import { createHapticsMock, renderWithTheme } from '../test-utils';

const CONTENT = 'Orders placed before noon ship the same day.';

function renderAccordion(props: Partial<ComponentProps<typeof Accordion>> = {}) {
  return renderWithTheme(
    <Accordion title="Shipping" {...props}>
      <Text>{CONTENT}</Text>
    </Accordion>,
  );
}

/*
 * Open state, callbacks and haptics. The expanded / collapsed announcement is
 * proven by the real renderer in `__tests__/native/Accordion.test.tsx`.
 */
describe('Accordion', () => {
  describe('GIVEN an uncontrolled, collapsed item', () => {
    describe('WHEN it is rendered', () => {
      it('THEN the content is not mounted', () => {
        renderAccordion();

        expect(screen.queryByText(CONTENT)).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
          'aria-expanded',
          'false',
        );
      });
    });

    describe('WHEN the header is pressed', () => {
      it('THEN the content appears, the change is reported and the light haptic fires', () => {
        const haptics = createHapticsMock();
        configureHaptics(haptics);
        const onExpandedChange = jest.fn();
        renderAccordion({ onExpandedChange });

        fireEvent.click(screen.getByRole('button', { name: 'Shipping' }));

        expect(screen.getByText(CONTENT)).toBeInTheDocument();
        expect(onExpandedChange).toHaveBeenCalledWith(true);
        expect(haptics.light).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN the header is pressed twice', () => {
      it('THEN the item collapses again', () => {
        renderAccordion();
        const header = screen.getByRole('button', { name: 'Shipping' });

        fireEvent.click(header);
        fireEvent.click(header);

        expect(screen.queryByText(CONTENT)).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an item that starts expanded', () => {
    describe('WHEN it is rendered', () => {
      it('THEN the content is visible and the header reports expanded', () => {
        renderAccordion({ defaultExpanded: true });

        expect(screen.getByText(CONTENT)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
          'aria-expanded',
          'true',
        );
      });
    });
  });

  describe('GIVEN a controlled item kept collapsed by the app', () => {
    describe('WHEN the header is pressed', () => {
      it('THEN the request is reported but the content stays hidden', () => {
        const onExpandedChange = jest.fn();
        renderAccordion({ expanded: false, onExpandedChange });

        fireEvent.click(screen.getByRole('button', { name: 'Shipping' }));

        expect(onExpandedChange).toHaveBeenCalledWith(true);
        expect(screen.queryByText(CONTENT)).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a disabled item', () => {
    describe('WHEN the header is pressed', () => {
      it('THEN nothing opens and nothing is reported', () => {
        const onExpandedChange = jest.fn();
        renderAccordion({ disabled: true, onExpandedChange });

        fireEvent.click(screen.getByRole('button', { name: 'Shipping' }));

        expect(onExpandedChange).not.toHaveBeenCalled();
        expect(screen.queryByText(CONTENT)).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN haptics are turned off for the item', () => {
    describe('WHEN the header is pressed', () => {
      it('THEN no haptic fires', () => {
        const haptics = createHapticsMock();
        configureHaptics(haptics);
        renderAccordion({ haptic: false });

        fireEvent.click(screen.getByRole('button', { name: 'Shipping' }));

        expect(haptics.light).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN an item with a subtitle and no divider', () => {
    describe('WHEN it is rendered', () => {
      it('THEN the subtitle shows and the root has no bottom border', () => {
        renderWithTheme(
          <Accordion title="Returns" subtitle="Within 30 days" divider={false} testID="item">
            <Text>{CONTENT}</Text>
          </Accordion>,
        );

        expect(screen.getByText('Within 30 days')).toBeInTheDocument();
        expect(screen.getByTestId('item').style.borderBottomWidth).toBe('');
      });
    });
  });
});
