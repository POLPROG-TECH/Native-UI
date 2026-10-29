import { screen } from '@testing-library/react';
import { Text } from 'react-native';
import { EmptyState } from '../../src/components/EmptyState';
import { renderWithTheme } from '../test-utils';

describe('EmptyState', () => {
  describe('GIVEN the EmptyState export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof EmptyState;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN an EmptyState with just a title', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the title text is present in the document', () => {
        renderWithTheme(<EmptyState title="Nothing here" />);

        expect(screen.getByText('Nothing here')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an EmptyState with an "📭" icon', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the icon glyph is present', () => {
        renderWithTheme(<EmptyState icon="📭" title="No mail" />);

        expect(screen.getByText('📭')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an EmptyState with a message', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the message text is present', () => {
        renderWithTheme(<EmptyState title="Caught up" message="You are all caught up!" />);

        expect(screen.getByText('You are all caught up!')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an EmptyState with a custom action element', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the action element is present', () => {
        renderWithTheme(<EmptyState title="Empty" action={<Text>Refresh</Text>} />);

        expect(screen.getByText('Refresh')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an EmptyState without an icon', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the rendered DOM does not contain any common test-emoji glyph', () => {
        const { container } = renderWithTheme(<EmptyState title="Empty" />);

        expect(container.textContent).toBe('Empty');
      });
    });
  });
});
