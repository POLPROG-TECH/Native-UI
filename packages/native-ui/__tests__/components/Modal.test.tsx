import React from 'react';
import { Text } from 'react-native';
import { fireEvent, screen } from '@testing-library/react';
import { Modal } from '../../src/components/Modal';
import { renderWithTheme } from '../test-utils';

describe('Modal', () => {
  it('should be exported as a function component', () => {
    // GIVEN the Modal export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof Modal;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render nothing when `visible` is false', () => {
    // GIVEN a Modal configured with visible={false}
    // WHEN the component is mounted
    renderWithTheme(
      <Modal visible={false} onClose={() => {}}>
        <Text>Hidden body</Text>
      </Modal>,
    );

    // THEN its children are not present in the DOM
    expect(screen.queryByText('Hidden body')).not.toBeInTheDocument();
  });

  it('should render its children and title when `visible` is true', () => {
    // GIVEN a Modal configured with a title and body content
    // WHEN the component is mounted with visible={true}
    renderWithTheme(
      <Modal visible onClose={() => {}} title="Confirm">
        <Text>Body text</Text>
      </Modal>,
    );

    // THEN both the title and body are rendered
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('should render the footer slot when provided', () => {
    // GIVEN a Modal configured with a footer React node
    // WHEN the component is mounted
    renderWithTheme(
      <Modal visible onClose={() => {}} footer={<Text>Actions</Text>}>
        <Text>Body</Text>
      </Modal>,
    );

    // THEN the footer content is rendered alongside the body
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should invoke onClose when the backdrop is pressed and the modal is dismissable', () => {
    // GIVEN a visible, dismissable Modal with an onClose spy
    const onClose = jest.fn();
    const { container } = renderWithTheme(
      <Modal visible onClose={onClose}>
        <Text>Dismissable body</Text>
      </Modal>,
    );

    // WHEN the backdrop is clicked
    const backdrop = container.querySelectorAll('[role="button"]')[0] as HTMLElement;
    fireEvent.click(backdrop);

    // THEN onClose is fired exactly once
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should NOT invoke onClose on backdrop press when `dismissable` is false', () => {
    // GIVEN a visible Modal configured with dismissable={false}
    const onClose = jest.fn();
    const { container } = renderWithTheme(
      <Modal visible onClose={onClose} dismissable={false}>
        <Text>Locked body</Text>
      </Modal>,
    );

    // WHEN the backdrop is clicked
    const backdrop = container.querySelectorAll('[role="button"]')[0] as HTMLElement;
    fireEvent.click(backdrop);

    // THEN onClose is never called
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should expose Header, Body, and Footer as attached static subcomponents', () => {
    // GIVEN the Modal export with its compound API

    // WHEN each subcomponent type is inspected
    // THEN all three are function components
    expect(typeof Modal.Header).toBe('function');
    expect(typeof Modal.Body).toBe('function');
    expect(typeof Modal.Footer).toBe('function');
  });

  it('should render every compound subcomponent with its children when used as a compound', () => {
    // GIVEN a Modal composed with Header / Body / Footer children
    // WHEN the component is mounted
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

    // THEN every slot renders its children
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
  });
});
