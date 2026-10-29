import { screen } from '@testing-library/react';
import { Badge } from '../../src/components/Badge';
import { renderWithTheme } from '../test-utils';

describe('Badge', () => {
  describe('GIVEN a Badge configured with a "New" label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the label text appears in the document', () => {
        renderWithTheme(<Badge label="New" />);

        expect(screen.getByText('New')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Badge configured with a count greater than its max', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the displayed text shows the capped value followed by +', () => {
        renderWithTheme(<Badge count={250} max={99} />);

        expect(screen.getByText('99+')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Badge configured with a count well below its max', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the displayed text equals the raw count', () => {
        renderWithTheme(<Badge count={7} max={99} />);

        expect(screen.getByText('7')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Badge configured with the info variant and an "info" label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the component mounts and shows the label', () => {
        const { container } = renderWithTheme(<Badge label="info" variant="info" />);

        expect(container).toBeTruthy();
        expect(screen.getByText('info')).toBeInTheDocument();
      });
    });
  });
});
