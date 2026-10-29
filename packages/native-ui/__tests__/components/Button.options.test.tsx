import { Text } from 'react-native';
import { act, fireEvent, screen } from '@testing-library/react';
import { Button } from '../../src/components/Button';
import { configureHaptics } from '../../src/utils/haptics';
import { createHapticsMock, renderWithTheme } from '../test-utils';

describe('Button options', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('GIVEN two buttons with different haptic settings', () => {
    describe('WHEN both are pressed', () => {
      it('THEN only the light haptic fires once', () => {
        const haptics = createHapticsMock();
        configureHaptics(haptics);
        renderWithTheme(
          <>
            <Button title="Soft" haptic="light" onPress={() => {}} />
            <Button title="Silent" haptic={false} onPress={() => {}} />
          </>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Soft' }));
        fireEvent.click(screen.getByRole('button', { name: 'Silent' }));
        act(() => {
          jest.advanceTimersByTime(1000);
        });

        expect(haptics.light).toHaveBeenCalledTimes(1);
        expect(haptics.medium).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a button with explicit accessibility props', () => {
    describe('WHEN it is looked up', () => {
      it('THEN the explicit name replaces the title', () => {
        renderWithTheme(
          <Button
            title="+"
            accessibilityLabel="Add entry"
            accessibilityHint="Opens the entry form"
            onPress={() => {}}
            testID="add"
          />,
        );

        const button = screen.getByTestId('add');

        expect(button).toHaveAttribute('aria-label', 'Add entry');
      });
    });
  });

  describe('GIVEN a button with a background render prop', () => {
    describe('WHEN it is inspected', () => {
      it('THEN the background is rendered and the variant fill is cleared', () => {
        renderWithTheme(
          <Button
            title="Gradient"
            renderBackground={() => <Text>BG</Text>}
            onPress={() => {}}
            testID="cta"
          />,
        );

        const button = screen.getByTestId('cta');

        expect(screen.getByText('BG')).toBeInTheDocument();
        expect(button).toHaveStyle({ overflow: 'hidden' });
        expect(button.style.backgroundColor).toMatch(/transparent|rgba\(0, 0, 0, 0\)/);
      });
    });
  });

  describe('GIVEN tokens with a taller md button and a short debounce', () => {
    describe('WHEN it is pressed twice, past the token debounce window', () => {
      it('THEN the token size applies and both presses count', () => {
        const onPress = jest.fn();
        renderWithTheme(<Button title="Tall" onPress={onPress} testID="tall" />, {
          config: {
            colorMode: 'light',
            components: {
              button: {
                md: { paddingVertical: 16, paddingHorizontal: 24, minHeight: 60 },
                debounceMs: 100,
              },
            },
          },
        });
        const button = screen.getByTestId('tall');

        fireEvent.click(button);
        act(() => {
          jest.advanceTimersByTime(150);
        });
        fireEvent.click(button);

        expect(button).toHaveStyle({ minHeight: '60px', paddingTop: '16px' });
        expect(onPress).toHaveBeenCalledTimes(2);
      });
    });
  });
});
