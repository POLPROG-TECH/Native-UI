import { screen } from '@testing-library/react';
import { SectionLabel } from '../../src/primitives/SectionLabel';
import { renderWithTheme } from '../test-utils';

describe('SectionLabel', () => {
  describe('GIVEN the SectionLabel export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof SectionLabel;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a SectionLabel with body text', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the label text appears in the document', () => {
        renderWithTheme(<SectionLabel>Account</SectionLabel>);

        expect(screen.getByText('Account')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a SectionLabel without a custom `transform` prop', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the inline textTransform style is uppercase', () => {
        renderWithTheme(<SectionLabel>Account</SectionLabel>);
        const label = screen.getByText('Account');

        expect(label.style.textTransform).toBe('uppercase');
      });
    });
  });

  describe('GIVEN a SectionLabel configured with transform="capitalize"', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the inline textTransform style matches the override', () => {
        renderWithTheme(<SectionLabel transform="capitalize">hello world</SectionLabel>);
        const label = screen.getByText('hello world');

        expect(label.style.textTransform).toBe('capitalize');
      });
    });
  });

  describe('GIVEN a SectionLabel configured with an explicit color', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the inline color style carries the value', () => {
        renderWithTheme(<SectionLabel color="#ff0000">Red</SectionLabel>);
        const label = screen.getByText('Red');

        expect(label.style.color).toBe('rgb(255, 0, 0)');
      });
    });
  });
});
