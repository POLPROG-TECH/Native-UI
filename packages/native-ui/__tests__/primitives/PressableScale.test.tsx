import React from 'react';
import { Text } from 'react-native';
import { fireEvent, screen } from '@testing-library/react';
import { PressableScale } from '../../src/primitives/PressableScale';
import { renderWithTheme } from '../test-utils';

describe('PressableScale', () => {
  it('should be exported as a forwardRef object', () => {
    // GIVEN the PressableScale export

    // WHEN its runtime type is inspected
    const actualType = typeof PressableScale;

    // THEN it is a forwardRef object (truthy and not a plain function)
    expect(actualType).toBe('object');
  });

  it('should render its children when mounted', () => {
    // GIVEN a PressableScale wrapping a Text child
    // WHEN the component is rendered
    renderWithTheme(
      <PressableScale onPress={() => {}}>
        <Text>Tap</Text>
      </PressableScale>,
    );

    // THEN the child content is present
    expect(screen.getByText('Tap')).toBeInTheDocument();
  });

  it('should invoke `onPress` when the pressable is clicked', () => {
    // GIVEN a PressableScale with an onPress spy
    const onPress = jest.fn();
    renderWithTheme(
      <PressableScale onPress={onPress}>
        <Text>Action</Text>
      </PressableScale>,
    );

    // WHEN the underlying button is clicked
    fireEvent.click(screen.getByRole('button'));

    // THEN onPress is fired exactly once
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should invoke `onPressIn` and `onPressOut` through the press lifecycle', () => {
    // GIVEN PressableScale with onPressIn/onPressOut spies
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    renderWithTheme(
      <PressableScale onPress={() => {}} onPressIn={onPressIn} onPressOut={onPressOut}>
        <Text>Lifecycle</Text>
      </PressableScale>,
    );

    // WHEN mousedown/mouseup fires on the element
    const target = screen.getByRole('button');
    fireEvent.mouseDown(target);
    fireEvent.mouseUp(target);

    // THEN each lifecycle handler is called exactly once
    expect(onPressIn).toHaveBeenCalledTimes(1);
    expect(onPressOut).toHaveBeenCalledTimes(1);
  });

  it('should render successfully with a custom `scaleTo` factor', () => {
    // GIVEN a PressableScale configured with a custom scale target
    // WHEN the component is rendered
    renderWithTheme(
      <PressableScale onPress={() => {}} scaleTo={0.9}>
        <Text>Scaled</Text>
      </PressableScale>,
    );

    // THEN the child renders without crashing
    expect(screen.getByText('Scaled')).toBeInTheDocument();
  });

  it('should render successfully when `respectReduceAnimations` is false', () => {
    // GIVEN a PressableScale that opts out of reduce-motion behaviour
    // WHEN the component is rendered
    renderWithTheme(
      <PressableScale onPress={() => {}} respectReduceAnimations={false}>
        <Text>Essential</Text>
      </PressableScale>,
    );

    // THEN the child renders without crashing
    expect(screen.getByText('Essential')).toBeInTheDocument();
  });
});
