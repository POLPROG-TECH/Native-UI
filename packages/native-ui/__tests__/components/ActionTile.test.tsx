import { screen, fireEvent, act } from '@testing-library/react';
import { ActionTile } from '../../src/components/ActionTile';
import { renderWithTheme } from '../test-utils';

describe('ActionTile', () => {
  describe('GIVEN the ActionTile export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a React.memo exotic component', () => {
        const componentType: unknown = Reflect.get(ActionTile, '$$typeof');

        expect(componentType).toBe(Symbol.for('react.memo'));
      });
    });
  });

  describe('GIVEN an ActionTile with an icon child and a label', () => {
    describe('WHEN the icon and label are queried', () => {
      it('THEN both are present', () => {
        renderWithTheme(
          <ActionTile
            icon={<span data-testid="icon-child">+</span>}
            label="Add entry"
            onPress={() => {}}
          />,
        );

        expect(screen.getByTestId('icon-child')).toBeInTheDocument();
        expect(screen.getByText('Add entry')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an ActionTile without an explicit accessibilityLabel', () => {
    describe('WHEN queried by the label', () => {
      it('THEN it is discoverable', () => {
        renderWithTheme(<ActionTile icon={<span>+</span>} label="Budgets" onPress={() => {}} />);

        expect(screen.getByLabelText('Budgets')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an ActionTile with a distinct accessibility label', () => {
    describe('WHEN queried by the accessible name', () => {
      it('THEN the override wins', () => {
        renderWithTheme(
          <ActionTile
            icon={<span>+</span>}
            label="Add"
            accessibilityLabel="Add a new entry"
            onPress={() => {}}
          />,
        );

        expect(screen.getByLabelText('Add a new entry')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an ActionTile with a mocked onPress', () => {
    describe('WHEN it is clicked three times in quick succession', () => {
      it('THEN only the first click is forwarded', () => {
        jest.useFakeTimers();
        const onPress = jest.fn();
        renderWithTheme(<ActionTile icon={<span>+</span>} label="Click" onPress={onPress} />);

        const tile = screen.getByLabelText('Click');
        fireEvent.click(tile);
        fireEvent.click(tile);
        fireEvent.click(tile);

        expect(onPress).toHaveBeenCalledTimes(1);

        /* AND after the debounce window a second click is accepted */
        act(() => {
          jest.advanceTimersByTime(400);
        });
        fireEvent.click(tile);
        expect(onPress).toHaveBeenCalledTimes(2);
        jest.useRealTimers();
      });
    });
  });

  describe('GIVEN a disabled ActionTile', () => {
    describe('WHEN it is clicked', () => {
      it('THEN onPress is never invoked AND aria-disabled is true', () => {
        const onPress = jest.fn();
        renderWithTheme(
          <ActionTile icon={<span>+</span>} label="Nope" onPress={onPress} disabled />,
        );

        const tile = screen.getByLabelText('Nope');
        fireEvent.click(tile);

        expect(onPress).not.toHaveBeenCalled();
        expect(tile).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('GIVEN the full list of ActionTile tones', () => {
    describe('WHEN each tone is rendered', () => {
      it('THEN every tone renders without crashing', () => {
        const tones = ['primary', 'success', 'warning', 'error', 'neutral'] as const;

        const renderAll = () => {
          tones.forEach((tone) => {
            const { unmount } = renderWithTheme(
              <ActionTile
                icon={<span>+</span>}
                label={`tone-${tone}`}
                tone={tone}
                onPress={() => {}}
              />,
            );
            expect(screen.getByLabelText(`tone-${tone}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });
});
