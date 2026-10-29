import { screen, fireEvent, act } from '@testing-library/react';
import { IconButton } from '../../src/components/IconButton';
import { renderWithTheme } from '../test-utils';

describe('IconButton', () => {
  describe('GIVEN the IconButton export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a React.memo exotic component', () => {
        expect(IconButton).toHaveProperty('$$typeof', Symbol.for('react.memo'));
      });
    });
  });

  describe('GIVEN an IconButton with a span icon child', () => {
    describe('WHEN the icon is queried', () => {
      it('THEN it is present in the document', () => {
        renderWithTheme(
          <IconButton
            icon={<span data-testid="icon-child">★</span>}
            accessibilityLabel="Star"
            onPress={() => {}}
          />,
        );

        expect(screen.getByTestId('icon-child')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an IconButton with a custom accessibility label', () => {
    describe('WHEN the element is queried by its label', () => {
      it('THEN it is discoverable', () => {
        renderWithTheme(
          <IconButton icon={<span>★</span>} accessibilityLabel="Favourite" onPress={() => {}} />,
        );

        expect(screen.getByLabelText('Favourite')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an IconButton with a mocked onPress', () => {
    describe('WHEN the button is clicked three times in quick succession', () => {
      it('THEN only the first click is forwarded to onPress', () => {
        jest.useFakeTimers();
        const onPress = jest.fn();
        renderWithTheme(
          <IconButton icon={<span>★</span>} accessibilityLabel="Click" onPress={onPress} />,
        );

        const btn = screen.getByLabelText('Click');
        fireEvent.click(btn);
        fireEvent.click(btn);
        fireEvent.click(btn);

        expect(onPress).toHaveBeenCalledTimes(1);

        /* AND after the debounce window elapses a second click is accepted again */
        act(() => {
          jest.advanceTimersByTime(400);
        });
        fireEvent.click(btn);
        expect(onPress).toHaveBeenCalledTimes(2);
        jest.useRealTimers();
      });
    });
  });

  describe('GIVEN a disabled IconButton with a mocked onPress', () => {
    describe('WHEN the button is clicked', () => {
      it('THEN onPress is never invoked', () => {
        const onPress = jest.fn();
        renderWithTheme(
          <IconButton icon={<span>★</span>} accessibilityLabel="Nope" onPress={onPress} disabled />,
        );

        fireEvent.click(screen.getByLabelText('Nope'));

        expect(onPress).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a disabled IconButton', () => {
    describe('WHEN the button element is inspected', () => {
      it('THEN aria-disabled is "true"', () => {
        renderWithTheme(
          <IconButton
            icon={<span>★</span>}
            accessibilityLabel="Nope"
            onPress={() => {}}
            disabled
          />,
        );

        expect(screen.getByLabelText('Nope')).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('GIVEN the full list of IconButton variants', () => {
    describe('WHEN each variant is rendered with a matching accessibility label', () => {
      it('THEN every variant renders without crashing', () => {
        const variants = ['default', 'primary', 'ghost', 'danger'] as const;

        const renderAll = () => {
          variants.forEach((variant) => {
            const { unmount } = renderWithTheme(
              <IconButton
                icon={<span>★</span>}
                accessibilityLabel={`variant-${variant}`}
                onPress={() => {}}
                variant={variant}
              />,
            );
            expect(screen.getByLabelText(`variant-${variant}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });

  describe('GIVEN the full list of IconButton sizes', () => {
    describe('WHEN each size is rendered with a matching accessibility label', () => {
      it('THEN every size renders without crashing', () => {
        const sizes = ['sm', 'md', 'lg'] as const;

        const renderAll = () => {
          sizes.forEach((size) => {
            const { unmount } = renderWithTheme(
              <IconButton
                icon={<span>★</span>}
                accessibilityLabel={`size-${size}`}
                onPress={() => {}}
                size={size}
              />,
            );
            expect(screen.getByLabelText(`size-${size}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });
});
