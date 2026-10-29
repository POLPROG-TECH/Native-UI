import { screen } from '@testing-library/react';
import { Avatar } from '../../src/components/Avatar';
import { renderWithTheme } from '../test-utils';

describe('Avatar', () => {
  describe('GIVEN the Avatar export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        expect(typeof Avatar).toBe('function');
      });
    });
  });

  describe('GIVEN initials provided directly as a prop', () => {
    describe('WHEN the avatar renders', () => {
      it('THEN they are displayed uppercased', () => {
        renderWithTheme(<Avatar initials="dk" />);

        expect(screen.getByText('DK')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a full display name', () => {
    describe('WHEN the avatar renders', () => {
      it('THEN the first letter of each of the first two words is shown', () => {
        renderWithTheme(<Avatar name="Zakk Wylde" />);

        expect(screen.getByText('ZW')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a name with three words', () => {
    describe('WHEN the avatar renders', () => {
      it('THEN only the first two initials are used', () => {
        renderWithTheme(<Avatar name="John Ronald Reuel Tolkien" />);

        expect(screen.getByText('JR')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an Avatar rendered without any identifying props', () => {
    describe('WHEN the component is mounted', () => {
      it('THEN the fallback question mark is displayed', () => {
        renderWithTheme(<Avatar />);

        expect(screen.getByText('?')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN the full set of supported Avatar sizes', () => {
    describe('WHEN each size is rendered in isolation', () => {
      it('THEN every size renders without throwing', () => {
        const sizes = ['sm', 'md', 'lg', 'xl'] as const;

        const renderAll = () => {
          sizes.forEach((size) => {
            const { unmount } = renderWithTheme(<Avatar initials="AB" size={size} />);
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });

  describe('GIVEN an Avatar with a remote image source', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN an accessibility-labelled image placeholder is rendered', () => {
        renderWithTheme(<Avatar source={{ uri: 'https://example.com/a.png' }} />);

        expect(screen.getByLabelText('Avatar')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an Avatar with both initials and an explicit accessibility label', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the provided accessibility label takes precedence', () => {
        renderWithTheme(<Avatar initials="dk" accessibilityLabel="User avatar" />);

        expect(screen.getByLabelText('User avatar')).toBeInTheDocument();
      });
    });
  });
});
