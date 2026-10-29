import { screen } from '@testing-library/react';
import { ListSection } from '../../src/components/ListSection';
import { ListItem } from '../../src/components/ListItem';
import { renderWithTheme } from '../test-utils';

describe('ListSection', () => {
  describe('GIVEN the ListSection export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof ListSection;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a ListSection with a title', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the title text is present', () => {
        renderWithTheme(
          <ListSection title="Account">
            <ListItem title="Profile" />
          </ListSection>,
        );

        expect(screen.getByText('Account')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ListSection with a footer', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the footer text is present', () => {
        renderWithTheme(
          <ListSection footer="Need help? Contact support.">
            <ListItem title="Profile" />
          </ListSection>,
        );

        expect(screen.getByText('Need help? Contact support.')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a non-grouped ListSection wrapping two list items', () => {
    describe('WHEN the section is rendered inside a theme provider', () => {
      it('THEN both list items are present', () => {
        renderWithTheme(
          <ListSection>
            <ListItem title="Alpha" />
            <ListItem title="Beta" />
          </ListSection>,
        );

        expect(screen.getByText('Alpha')).toBeInTheDocument();
        expect(screen.getByText('Beta')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a grouped ListSection wrapping three list items', () => {
    describe('WHEN the section is rendered inside a theme provider', () => {
      it('THEN every list item is present', () => {
        renderWithTheme(
          <ListSection grouped>
            <ListItem title="Alpha" />
            <ListItem title="Beta" />
            <ListItem title="Gamma" />
          </ListSection>,
        );

        expect(screen.getByText('Alpha')).toBeInTheDocument();
        expect(screen.getByText('Beta')).toBeInTheDocument();
        expect(screen.getByText('Gamma')).toBeInTheDocument();
      });
    });
  });
});
