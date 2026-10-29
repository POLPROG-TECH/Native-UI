import { Text } from 'react-native';
import { fireEvent, screen } from '@testing-library/react';
import { PressableScale } from '../../src/primitives/PressableScale';
import { withSpring } from 'react-native-reanimated';
import { renderWithTheme } from '../test-utils';

describe('PressableScale', () => {
  describe('GIVEN the PressableScale export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a forwardRef object (truthy and not a plain function)', () => {
        const actualType = typeof PressableScale;

        expect(actualType).toBe('object');
      });
    });
  });

  describe('GIVEN a PressableScale wrapping a Text child', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the child content is present', () => {
        renderWithTheme(
          <PressableScale onPress={() => {}}>
            <Text>Tap</Text>
          </PressableScale>,
        );

        expect(screen.getByText('Tap')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a PressableScale with an onPress spy', () => {
    describe('WHEN the underlying button is clicked', () => {
      it('THEN onPress is fired exactly once', () => {
        const onPress = jest.fn();
        renderWithTheme(
          <PressableScale onPress={onPress}>
            <Text>Action</Text>
          </PressableScale>,
        );

        fireEvent.click(screen.getByRole('button'));

        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN PressableScale with onPressIn/onPressOut spies', () => {
    describe('WHEN mousedown/mouseup fires on the element', () => {
      it('THEN each lifecycle handler is called exactly once', () => {
        const onPressIn = jest.fn();
        const onPressOut = jest.fn();
        renderWithTheme(
          <PressableScale onPress={() => {}} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Text>Lifecycle</Text>
          </PressableScale>,
        );

        const target = screen.getByRole('button');
        fireEvent.mouseDown(target);
        fireEvent.mouseUp(target);

        expect(onPressIn).toHaveBeenCalledTimes(1);
        expect(onPressOut).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a PressableScale configured with a custom scale target', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the child renders without crashing', () => {
        renderWithTheme(
          <PressableScale onPress={() => {}} scaleTo={0.9}>
            <Text>Scaled</Text>
          </PressableScale>,
        );

        expect(screen.getByText('Scaled')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a PressableScale that opts out of reduce-motion behaviour', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the child renders without crashing', () => {
        renderWithTheme(
          <PressableScale onPress={() => {}} respectReduceAnimations={false}>
            <Text>Essential</Text>
          </PressableScale>,
        );

        expect(screen.getByText('Essential')).toBeInTheDocument();
      });
    });
  });
});

describe('PressableScale tokens', () => {
  const withSpringMock = jest.mocked(withSpring);

  beforeEach(() => {
    withSpringMock.mockClear();
  });

  function pressInAndOut() {
    const target = screen.getByRole('button');
    fireEvent.mouseDown(target);
    fireEvent.mouseUp(target);
  }

  describe('GIVEN a PressableScale without scaleTo under the default theme', () => {
    describe('WHEN it is pressed and released', () => {
      it('THEN it springs to 0.97 and back to 1 with the default spring config', () => {
        renderWithTheme(
          <PressableScale onPress={() => {}}>
            <Text>Default</Text>
          </PressableScale>,
        );

        pressInAndOut();

        const spring = { damping: 15, stiffness: 400 };
        expect(withSpringMock).toHaveBeenNthCalledWith(1, 0.97, spring);
        expect(withSpringMock).toHaveBeenNthCalledWith(2, 1, spring);
      });
    });
  });

  describe('GIVEN app-wide pressable token overrides', () => {
    describe('WHEN it is pressed and released', () => {
      it('THEN both springs use the overridden tokens', () => {
        renderWithTheme(
          <PressableScale onPress={() => {}}>
            <Text>Themed</Text>
          </PressableScale>,
          {
            config: {
              colorMode: 'light',
              components: { pressable: { scaleTo: 0.9, springDamping: 20, springStiffness: 300 } },
            },
          },
        );

        pressInAndOut();

        const spring = { damping: 20, stiffness: 300 };
        expect(withSpringMock).toHaveBeenNthCalledWith(1, 0.9, spring);
        expect(withSpringMock).toHaveBeenNthCalledWith(2, 1, spring);
      });
    });
  });

  describe('GIVEN a scale token and a conflicting scaleTo prop', () => {
    describe('WHEN it is pressed', () => {
      it('THEN the prop value is used', () => {
        renderWithTheme(
          <PressableScale onPress={() => {}} scaleTo={0.8}>
            <Text>Explicit</Text>
          </PressableScale>,
          { config: { colorMode: 'light', components: { pressable: { scaleTo: 0.9 } } } },
        );

        fireEvent.mouseDown(screen.getByRole('button'));

        expect(withSpringMock).toHaveBeenCalledWith(0.8, { damping: 15, stiffness: 400 });
      });
    });
  });
});
