import { fireEvent, screen } from '@testing-library/react';
import { Tabs } from '../../src/components/Tabs';
import { configureHaptics } from '../../src/utils/haptics';
import { createHapticsMock, renderWithTheme } from '../test-utils';

type OrderTab = 'open' | 'done' | 'archived';

const TABS = [
  { value: 'open', label: 'Open' },
  { value: 'done', label: 'Completed' },
  { value: 'archived', label: 'Archived', disabled: true },
] as const;

/*
 * Selection logic, haptics and tokens. The tab roles and the selected state
 * as a screen reader sees them are proven in `__tests__/native/Tabs.test.tsx`.
 */
describe('Tabs', () => {
  describe('GIVEN tabs with "open" selected', () => {
    describe('WHEN another tab is pressed', () => {
      it('THEN onChange receives it and the light haptic fires', () => {
        const haptics = createHapticsMock();
        configureHaptics(haptics);
        const onChange = jest.fn();
        renderWithTheme(<Tabs<OrderTab> tabs={TABS} value="open" onChange={onChange} />);

        fireEvent.click(screen.getByRole('tab', { name: 'Completed' }));

        expect(onChange).toHaveBeenCalledWith('done');
        expect(haptics.light).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN the selected tab is pressed again', () => {
      it('THEN nothing is reported', () => {
        const onChange = jest.fn();
        renderWithTheme(<Tabs<OrderTab> tabs={TABS} value="open" onChange={onChange} />);

        fireEvent.click(screen.getByRole('tab', { name: 'Open' }));

        expect(onChange).not.toHaveBeenCalled();
      });
    });

    describe('WHEN a disabled tab is pressed', () => {
      it('THEN nothing is reported', () => {
        const onChange = jest.fn();
        renderWithTheme(<Tabs<OrderTab> tabs={TABS} value="open" onChange={onChange} />);

        fireEvent.click(screen.getByRole('tab', { name: 'Archived' }));

        expect(onChange).not.toHaveBeenCalled();
      });
    });

    describe('WHEN the tab list is inspected', () => {
      it('THEN only the selected tab is marked selected', () => {
        renderWithTheme(
          <Tabs<OrderTab>
            accessibilityLabel="Orders"
            tabs={TABS}
            value="open"
            onChange={() => {}}
          />,
        );

        expect(screen.getByRole('tablist', { name: 'Orders' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Open' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: 'Completed' })).toHaveAttribute(
          'aria-selected',
          'false',
        );
      });
    });
  });

  describe('GIVEN the whole tab row is disabled', () => {
    describe('WHEN an enabled tab is pressed', () => {
      it('THEN nothing is reported', () => {
        const onChange = jest.fn();
        renderWithTheme(<Tabs<OrderTab> tabs={TABS} value="open" onChange={onChange} disabled />);

        fireEvent.click(screen.getByRole('tab', { name: 'Completed' }));

        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN scrollable tabs', () => {
    describe('WHEN a tab is pressed', () => {
      it('THEN selection works the same inside the scroll container', () => {
        const onChange = jest.fn();
        renderWithTheme(
          <Tabs<OrderTab> tabs={TABS} value="open" onChange={onChange} scrollable haptic={false} />,
        );

        fireEvent.click(screen.getByRole('tab', { name: 'Completed' }));

        expect(onChange).toHaveBeenCalledWith('done');
      });
    });
  });

  describe('GIVEN an active color override', () => {
    describe('WHEN the selected tab is rendered', () => {
      it('THEN its label uses the override', () => {
        renderWithTheme(<Tabs<OrderTab> tabs={TABS} value="open" onChange={() => {}} />, {
          config: { colorMode: 'light', components: { tabs: { activeColor: '#112233' } } },
        });

        expect(screen.getByText('Open')).toHaveStyle({ color: '#112233' });
      });
    });
  });
});
