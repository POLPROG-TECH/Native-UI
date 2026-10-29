import { Text } from 'react-native';
import { fireEvent, screen } from '@testing-library/react';
import { Modal } from '../../src/components/Modal';
import { renderWithTheme } from '../test-utils';

describe('Modal', () => {
  describe('GIVEN the Modal export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof Modal;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a Modal configured with visible={false}', () => {
    describe('WHEN the component is mounted', () => {
      it('THEN its children are not present in the DOM', () => {
        renderWithTheme(
          <Modal visible={false} onClose={() => {}}>
            <Text>Hidden body</Text>
          </Modal>,
        );

        expect(screen.queryByText('Hidden body')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Modal configured with a title and body content', () => {
    describe('WHEN the component is mounted with visible={true}', () => {
      it('THEN both the title and body are rendered', () => {
        renderWithTheme(
          <Modal visible onClose={() => {}} title="Confirm">
            <Text>Body text</Text>
          </Modal>,
        );

        expect(screen.getByText('Confirm')).toBeInTheDocument();
        expect(screen.getByText('Body text')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Modal configured with a footer React node', () => {
    describe('WHEN the component is mounted', () => {
      it('THEN the footer content is rendered alongside the body', () => {
        renderWithTheme(
          <Modal visible onClose={() => {}} footer={<Text>Actions</Text>}>
            <Text>Body</Text>
          </Modal>,
        );

        expect(screen.getByText('Actions')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a visible, dismissable Modal with an onClose spy', () => {
    describe('WHEN the backdrop is clicked', () => {
      it('THEN onClose is fired exactly once', () => {
        const onClose = jest.fn();
        const { container } = renderWithTheme(
          <Modal visible onClose={onClose}>
            <Text>Dismissable body</Text>
          </Modal>,
        );

        const backdrop = container.querySelectorAll('[role="button"]')[0] as HTMLElement;
        fireEvent.click(backdrop);

        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a visible Modal configured with dismissable={false}', () => {
    describe('WHEN the backdrop is clicked', () => {
      it('THEN onClose is never called', () => {
        const onClose = jest.fn();
        const { container } = renderWithTheme(
          <Modal visible onClose={onClose} dismissable={false}>
            <Text>Locked body</Text>
          </Modal>,
        );

        const backdrop = container.querySelectorAll('[role="button"]')[0] as HTMLElement;
        fireEvent.click(backdrop);

        expect(onClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN the Modal export with its compound API', () => {
    describe('WHEN each subcomponent type is inspected', () => {
      it('THEN all three are function components', () => {
        expect(typeof Modal.Header).toBe('function');
        expect(typeof Modal.Body).toBe('function');
        expect(typeof Modal.Footer).toBe('function');
      });
    });
  });

  describe('GIVEN a Modal composed with Header / Body / Footer children', () => {
    describe('WHEN the component is mounted', () => {
      it('THEN every slot renders its children', () => {
        renderWithTheme(
          <Modal visible onClose={() => {}}>
            <Modal.Header>
              <Text>H</Text>
            </Modal.Header>
            <Modal.Body>
              <Text>B</Text>
            </Modal.Body>
            <Modal.Footer>
              <Text>F</Text>
            </Modal.Footer>
          </Modal>,
        );

        expect(screen.getByText('H')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
        expect(screen.getByText('F')).toBeInTheDocument();
      });
    });
  });
});
