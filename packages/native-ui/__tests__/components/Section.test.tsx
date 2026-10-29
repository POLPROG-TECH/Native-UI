import { screen } from '@testing-library/react';
import { Text } from 'react-native';
import { Section } from '../../src/components/Section';
import { renderWithTheme } from '../test-utils';

describe('Section', () => {
  describe('GIVEN the Section export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof Section;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a Section with a title and a child', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN both the title and the child content are present', () => {
        renderWithTheme(
          <Section title="Stats">
            <Text>Body</Text>
          </Section>,
        );

        expect(screen.getByText('Stats')).toBeInTheDocument();
        expect(screen.getByText('Body')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Section with a custom action element', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the action element is present', () => {
        renderWithTheme(
          <Section title="Stats" action={<Text>MORE</Text>}>
            <Text>Body</Text>
          </Section>,
        );

        expect(screen.getByText('MORE')).toBeInTheDocument();
      });
    });
  });
});
