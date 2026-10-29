import { screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '../../src/components/Checkbox';
import { renderWithTheme } from '../test-utils';

/*
 * Press logic and drawing. Accessibility (role, name, checked and disabled
 * state) is proven by the real renderer in `__tests__/native/Checkbox.test.tsx`.
 */
describe('Checkbox', () => {
  describe('GIVEN the Checkbox export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a React.memo exotic component', () => {
        expect(Checkbox).toHaveProperty('$$typeof', Symbol.for('react.memo'));
      });
    });
  });

  describe('GIVEN an unchecked Checkbox with a mocked onChange', () => {
    describe('WHEN the row is clicked', () => {
      it('THEN onChange is invoked with true', () => {
        const onChange = jest.fn();
        renderWithTheme(<Checkbox checked={false} onChange={onChange} label="Toggle" />);

        fireEvent.click(screen.getByLabelText('Toggle'));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('GIVEN a checked Checkbox with a mocked onChange', () => {
    describe('WHEN the row is clicked', () => {
      it('THEN onChange is invoked with false', () => {
        const onChange = jest.fn();
        renderWithTheme(<Checkbox checked onChange={onChange} label="Toggle" />);

        fireEvent.click(screen.getByLabelText('Toggle'));

        expect(onChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('GIVEN a checked and an unchecked Checkbox', () => {
    describe('WHEN the drawn check marks are queried', () => {
      it('THEN only the checked box shows one', () => {
        renderWithTheme(
          <>
            <Checkbox checked onChange={() => {}} label="Done" testID="done" />
            <Checkbox checked={false} onChange={() => {}} label="Open" testID="open" />
          </>,
        );

        expect(screen.getByTestId('done-check')).toBeInTheDocument();
        expect(screen.queryByTestId('open-check')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a disabled Checkbox with a mocked onChange', () => {
    describe('WHEN the row is clicked', () => {
      it('THEN onChange is never invoked', () => {
        const onChange = jest.fn();
        renderWithTheme(<Checkbox checked={false} onChange={onChange} label="Disabled" disabled />);

        fireEvent.click(screen.getByLabelText('Disabled'));

        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN both supported sizes', () => {
    describe('WHEN each size is rendered with a matching label', () => {
      it('THEN every size renders its label without crashing', () => {
        const sizes = ['sm', 'md'] as const;

        const renderAll = () => {
          sizes.forEach((size) => {
            const { unmount } = renderWithTheme(
              <Checkbox checked onChange={() => {}} label={`size-${size}`} size={size} />,
            );
            expect(screen.getByText(`size-${size}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });
});
