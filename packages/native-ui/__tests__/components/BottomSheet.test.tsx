import React from 'react';
import { Text } from 'react-native';
import { fireEvent, screen } from '@testing-library/react';
import { BottomSheet } from '../../src/components/BottomSheet';
import { renderWithTheme } from '../test-utils';

describe('BottomSheet', () => {
  it('should be exported as a function component', () => {
    // GIVEN the BottomSheet export

    // WHEN its runtime type is inspected
    const actualType = typeof BottomSheet;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render nothing when `visible` is false', () => {
    // GIVEN a BottomSheet configured with visible={false}
    // WHEN the component is mounted
    renderWithTheme(
      <BottomSheet visible={false} onClose={() => {}}>
        <Text>Hidden</Text>
      </BottomSheet>,
    );

    // THEN the children are not present in the DOM
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('should render its children when `visible` is true', () => {
    // GIVEN a visible BottomSheet with body content
    // WHEN the component is mounted
    renderWithTheme(
      <BottomSheet visible onClose={() => {}}>
        <Text>Visible body</Text>
      </BottomSheet>,
    );

    // THEN the body is rendered
    expect(screen.getByText('Visible body')).toBeInTheDocument();
  });

  it('should render a Header compound slot when used', () => {
    // GIVEN a visible BottomSheet composed with a Header child
    // WHEN the component is mounted
    renderWithTheme(
      <BottomSheet visible onClose={() => {}}>
        <BottomSheet.Header>
          <Text>Options</Text>
        </BottomSheet.Header>
      </BottomSheet>,
    );

    // THEN the header content is present
    expect(screen.getByText('Options')).toBeInTheDocument();
  });

  it('should invoke onClose when the backdrop is pressed', () => {
    // GIVEN a visible BottomSheet with an onClose spy
    const onClose = jest.fn();
    const { container } = renderWithTheme(
      <BottomSheet visible onClose={onClose}>
        <Text>Body</Text>
      </BottomSheet>,
    );

    // WHEN the backdrop element is clicked
    const backdrop = container.querySelectorAll('[role="button"]')[0] as HTMLElement;
    fireEvent.click(backdrop);

    // THEN onClose is called once
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should NOT invoke onClose on backdrop press when `dismissable` is false', () => {
    // GIVEN a visible, non-dismissable BottomSheet
    const onClose = jest.fn();
    const { container } = renderWithTheme(
      <BottomSheet visible onClose={onClose} dismissable={false}>
        <Text>Body</Text>
      </BottomSheet>,
    );

    // WHEN the backdrop is clicked
    const backdrop = container.querySelectorAll('[role="button"]')[0] as HTMLElement;
    fireEvent.click(backdrop);

    // THEN onClose is never called
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should render the BottomSheet.Footer compound slot when used', () => {
    // GIVEN a visible BottomSheet composed with a Footer child
    // WHEN the component is mounted
    renderWithTheme(
      <BottomSheet visible onClose={() => {}}>
        <BottomSheet.Footer>
          <Text>Footer</Text>
        </BottomSheet.Footer>
      </BottomSheet>,
    );

    // THEN the footer content is present
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
