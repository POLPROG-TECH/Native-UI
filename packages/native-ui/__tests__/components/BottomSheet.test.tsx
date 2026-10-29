import { Text } from 'react-native';
import { fireEvent, screen } from '@testing-library/react';
import { BottomSheet } from '../../src/components/BottomSheet';
import { renderWithTheme } from '../test-utils';

describe('BottomSheet', () => {
  describe('GIVEN the BottomSheet export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof BottomSheet;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a BottomSheet configured with visible={false}', () => {
    describe('WHEN the component is mounted', () => {
      it('THEN the children are not present in the DOM', () => {
        renderWithTheme(
          <BottomSheet visible={false} onClose={() => {}}>
            <Text>Hidden</Text>
          </BottomSheet>,
        );

        expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a visible BottomSheet with body content', () => {
    describe('WHEN the component is mounted', () => {
      it('THEN the body is rendered', () => {
        renderWithTheme(
          <BottomSheet visible onClose={() => {}}>
            <Text>Visible body</Text>
          </BottomSheet>,
        );

        expect(screen.getByText('Visible body')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a visible BottomSheet composed with a Header child', () => {
    describe('WHEN the component is mounted', () => {
      it('THEN the header content is present', () => {
        renderWithTheme(
          <BottomSheet visible onClose={() => {}}>
            <BottomSheet.Header>
              <Text>Options</Text>
            </BottomSheet.Header>
          </BottomSheet>,
        );

        expect(screen.getByText('Options')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a visible BottomSheet with an onClose spy', () => {
    describe('WHEN the backdrop element is clicked', () => {
      it('THEN onClose is called once', () => {
        const onClose = jest.fn();
        const { container } = renderWithTheme(
          <BottomSheet visible onClose={onClose}>
            <Text>Body</Text>
          </BottomSheet>,
        );

        const backdrop = container.querySelectorAll('[role="button"]')[0] as HTMLElement;
        fireEvent.click(backdrop);

        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a visible, non-dismissable BottomSheet', () => {
    describe('WHEN the backdrop is clicked', () => {
      it('THEN onClose is never called', () => {
        const onClose = jest.fn();
        const { container } = renderWithTheme(
          <BottomSheet visible onClose={onClose} dismissable={false}>
            <Text>Body</Text>
          </BottomSheet>,
        );

        const backdrop = container.querySelectorAll('[role="button"]')[0] as HTMLElement;
        fireEvent.click(backdrop);

        expect(onClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a visible BottomSheet composed with a Footer child', () => {
    describe('WHEN the component is mounted', () => {
      it('THEN the footer content is present', () => {
        renderWithTheme(
          <BottomSheet visible onClose={() => {}}>
            <BottomSheet.Footer>
              <Text>Footer</Text>
            </BottomSheet.Footer>
          </BottomSheet>,
        );

        expect(screen.getByText('Footer')).toBeInTheDocument();
      });
    });
  });
});

describe('BottomSheet tokens and layout', () => {
  describe('GIVEN a provider overriding the bottom sheet tokens', () => {
    describe('WHEN the sheet container is inspected', () => {
      it('THEN the token values are used', () => {
        renderWithTheme(
          <BottomSheet visible onClose={() => {}} testID="sheet">
            <Text>Body</Text>
          </BottomSheet>,
          {
            config: {
              colorMode: 'light',
              components: { bottomSheet: { radius: 28, backgroundColor: '#123456' } },
            },
          },
        );

        const sheet = screen.getByTestId('sheet');

        expect(sheet).toHaveStyle({ borderTopLeftRadius: '28px', backgroundColor: '#123456' });
      });
    });
  });

  describe('GIVEN the default bottom sheet tokens', () => {
    describe('WHEN the sheet container is inspected', () => {
      it('THEN it fills the width up to 640 points and centers beyond that', () => {
        renderWithTheme(
          <BottomSheet visible onClose={() => {}} testID="sheet">
            <Text>Body</Text>
          </BottomSheet>,
        );

        const sheet = screen.getByTestId('sheet');

        expect(sheet).toHaveStyle({ width: '100%', maxWidth: '640px', alignSelf: 'center' });
      });
    });
  });

  describe('GIVEN a provider overriding the sheet maxWidth token', () => {
    describe('WHEN the sheet container is inspected', () => {
      it('THEN the sheet is capped at the token width', () => {
        renderWithTheme(
          <BottomSheet visible onClose={() => {}} testID="sheet">
            <Text>Body</Text>
          </BottomSheet>,
          { config: { colorMode: 'light', components: { bottomSheet: { maxWidth: 520 } } } },
        );

        const sheet = screen.getByTestId('sheet');

        expect(sheet).toHaveStyle({ maxWidth: '520px' });
      });
    });
  });

  describe('GIVEN a footer with the given layout', () => {
    describe('WHEN the footer is inspected', () => {
      it.each([
        ['row', 'row'],
        ['stacked', 'column'],
        ['fill', 'row'],
      ] as const)('THEN the direction matches the layout (%s, %s)', (layout, direction) => {
        renderWithTheme(
          <BottomSheet visible onClose={() => {}}>
            <BottomSheet.Footer layout={layout} testID="footer">
              <Text>One</Text>
              <Text>Two</Text>
            </BottomSheet.Footer>
          </BottomSheet>,
        );

        const footer = screen.getByTestId('footer');

        expect(footer).toHaveStyle({ flexDirection: direction });
      });
    });
  });

  describe('GIVEN tokens that make every footer stacked', () => {
    describe('WHEN the footer is inspected', () => {
      it('THEN the token layout applies without a prop', () => {
        renderWithTheme(
          <BottomSheet visible onClose={() => {}}>
            <BottomSheet.Footer testID="footer">
              <Text>Only</Text>
            </BottomSheet.Footer>
          </BottomSheet>,
          {
            config: {
              colorMode: 'light',
              components: { bottomSheet: { footerLayout: 'stacked' } },
            },
          },
        );

        const footer = screen.getByTestId('footer');

        expect(footer).toHaveStyle({ flexDirection: 'column' });
      });
    });
  });

  describe('GIVEN Polish labels', () => {
    describe('WHEN the backdrop is looked up by its accessible name', () => {
      it('THEN the localized label is used', () => {
        renderWithTheme(
          <BottomSheet visible onClose={() => {}}>
            <Text>Body</Text>
          </BottomSheet>,
          { config: { colorMode: 'light', labels: { close: 'Zamknij' } } },
        );

        const backdrop = screen.getByRole('button', { name: 'Zamknij' });

        expect(backdrop).toBeInTheDocument();
      });
    });
  });
});
