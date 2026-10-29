import { Text } from 'react-native';
import { render, screen } from '@testing-library/react';
import { renderIconSlot } from '../../src/primitives/iconSlot';

const PROPS = { color: '#123456', size: 22 };

describe('renderIconSlot', () => {
  describe('GIVEN an emoji string slot', () => {
    describe('WHEN it is rendered', () => {
      it('THEN the emoji is shown as text sized by the requested size', () => {
        render(<>{renderIconSlot('📁', PROPS)}</>);

        expect(screen.getByText('📁').style.fontSize).toBe('22px');
      });
    });
  });

  describe('GIVEN a render function slot', () => {
    describe('WHEN it is rendered', () => {
      it('THEN the function receives the color and size and its output is shown', () => {
        const slot = jest.fn(({ color, size }: { color: string; size: number }) => (
          <Text>{`${color}/${size}`}</Text>
        ));

        render(<>{renderIconSlot(slot, PROPS)}</>);

        expect(slot).toHaveBeenCalledWith(PROPS);
        expect(screen.getByText('#123456/22')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a React node slot', () => {
    describe('WHEN it is rendered', () => {
      it('THEN the node is shown unchanged', () => {
        render(<>{renderIconSlot(<Text>NODE</Text>, PROPS)}</>);

        expect(screen.getByText('NODE')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN no slot', () => {
    describe('WHEN it is rendered', () => {
      it('THEN nothing is produced', () => {
        const result = renderIconSlot(undefined, PROPS);

        expect(result).toBeUndefined();
      });
    });
  });
});
