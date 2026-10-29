import { Text } from 'react-native';
import { screen } from '@testing-library/react';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { renderWithTheme } from '../test-utils';

describe('ScreenContainer', () => {
  describe('GIVEN the ScreenContainer export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof ScreenContainer;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a ScreenContainer wrapping some body text', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the children are present in the document', () => {
        renderWithTheme(
          <ScreenContainer>
            <Text>Body</Text>
          </ScreenContainer>,
        );

        expect(screen.getByText('Body')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ScreenContainer configured with padded={false}', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the child content is still rendered', () => {
        renderWithTheme(
          <ScreenContainer padded={false}>
            <Text>Edge-to-edge</Text>
          </ScreenContainer>,
        );

        expect(screen.getByText('Edge-to-edge')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ScreenContainer configured to inset on both top and bottom', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the child content is still rendered', () => {
        renderWithTheme(
          <ScreenContainer edges={['top', 'bottom']}>
            <Text>Safe</Text>
          </ScreenContainer>,
        );

        expect(screen.getByText('Safe')).toBeInTheDocument();
      });
    });
  });
});
