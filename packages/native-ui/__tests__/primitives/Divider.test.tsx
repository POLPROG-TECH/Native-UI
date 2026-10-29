import { screen } from '@testing-library/react';
import { Divider } from '../../src/primitives/Divider';
import { renderWithTheme } from '../test-utils';

describe('Divider', () => {
  describe('GIVEN the Divider export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof Divider;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a Divider without any custom props', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN it renders a single DOM node', () => {
        const { container } = renderWithTheme(<Divider />);

        expect(container.childNodes.length).toBe(1);
      });
    });
  });

  describe('GIVEN a Divider with a custom inset of 24', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the computed inline margin styles reflect that inset', () => {
        const { container } = renderWithTheme(<Divider inset={24} />);
        const node = container.firstChild as HTMLElement;

        expect(node.style.marginLeft).toBe('24px');
        expect(node.style.marginRight).toBe('24px');
      });
    });
  });

  describe('GIVEN a Divider rendered on its own', () => {
    describe('WHEN the component is mounted', () => {
      it('THEN no `separator` role is exposed - the component is purely decorative', () => {
        renderWithTheme(<Divider />);

        expect(screen.queryByRole('separator')).not.toBeInTheDocument();
      });
    });
  });
});
