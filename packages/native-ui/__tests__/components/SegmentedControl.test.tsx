import { fireEvent, screen } from '@testing-library/react';
import { SegmentedControl } from '../../src/components/SegmentedControl';
import { configureHaptics } from '../../src/utils/haptics';
import { createHapticsMock, renderWithTheme } from '../test-utils';

type Mode = 'light' | 'dark' | 'system';

const OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System', disabled: true },
] as const;

/*
 * Selection logic, haptics and tokens. Accessibility (radiogroup, checked and
 * disabled segments) is proven by the real renderer in
 * `__tests__/native/SegmentedControl.test.tsx`.
 */
describe('SegmentedControl', () => {
  describe('GIVEN a control with injected haptics', () => {
    describe('WHEN another segment is pressed', () => {
      it('THEN onChange receives it and the light haptic fires', () => {
        const haptics = createHapticsMock();
        configureHaptics(haptics);
        const onChange = jest.fn();
        renderWithTheme(
          <SegmentedControl<Mode> options={OPTIONS} value="dark" onChange={onChange} />,
        );

        fireEvent.click(screen.getByRole('radio', { name: 'Light' }));

        expect(onChange).toHaveBeenCalledWith('light');
        expect(haptics.light).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a control with "dark" selected', () => {
    describe('WHEN the selected segment is pressed again', () => {
      it('THEN nothing is reported', () => {
        const onChange = jest.fn();
        renderWithTheme(
          <SegmentedControl<Mode> options={OPTIONS} value="dark" onChange={onChange} />,
        );

        fireEvent.click(screen.getByRole('radio', { name: 'Dark' }));

        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN token overrides for the control', () => {
    describe('WHEN the track is inspected', () => {
      it('THEN the overrides apply', () => {
        renderWithTheme(
          <SegmentedControl<Mode>
            options={OPTIONS}
            value="dark"
            onChange={() => {}}
            testID="seg"
          />,
          {
            config: {
              colorMode: 'light',
              components: { segmentedControl: { trackPadding: 6, trackColor: '#112233' } },
            },
          },
        );

        const track = screen.getByTestId('seg');

        expect(track).toHaveStyle({ padding: '6px', backgroundColor: '#112233' });
      });
    });
  });
});
