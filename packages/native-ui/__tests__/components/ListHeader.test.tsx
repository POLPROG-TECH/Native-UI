import { screen } from '@testing-library/react';
import { ListHeader } from '../../src/components/ListHeader';
import { renderWithTheme } from '../test-utils';

describe('ListHeader', () => {
  describe('GIVEN the ListHeader export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof ListHeader;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a ListHeader with a "Settings" title', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the heading is present in the document', () => {
        renderWithTheme(<ListHeader title="Settings" />);

        expect(screen.getByRole('header')).toHaveTextContent('Settings');
      });
    });
  });

  describe('GIVEN a ListHeader with a subtitle', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the subtitle text is present', () => {
        renderWithTheme(<ListHeader title="Home" subtitle="Welcome back" />);

        expect(screen.getByText('Welcome back')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ListHeader configured with an uppercase transform', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the visible text matches the original (transform is a CSS style)', () => {
        renderWithTheme(<ListHeader title="hello" transform="uppercase" />);

        expect(screen.getByText('hello')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ListHeader whose transform function reverses the title', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the displayed title is the transformed value', () => {
        renderWithTheme(
          <ListHeader title="abc" transform={(s) => s.split('').reverse().join('')} />,
        );

        expect(screen.getByText('cba')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ListHeader with transform="none"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the title appears unchanged', () => {
        renderWithTheme(<ListHeader title="Plain" transform="none" />);

        expect(screen.getByText('Plain')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN the full list of string-based transforms', () => {
    describe('WHEN each transform is rendered with a matching title', () => {
      it('THEN every transform renders without crashing', () => {
        const transforms = ['uppercase', 'lowercase', 'capitalize', 'none'] as const;

        const renderAll = () => {
          transforms.forEach((t) => {
            const { unmount } = renderWithTheme(<ListHeader title={`t-${t}`} transform={t} />);
            expect(screen.getByText(`t-${t}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });
});
