import { Box } from '../../src/primitives/Box';
import { spacing, borderRadius } from '../../src/tokens/spacing';
import { renderWithTheme } from '../test-utils';

describe('Box', () => {
  describe('GIVEN the Box export from the primitives module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof Box;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN an empty Box element', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the container has a rendered child element', () => {
        const { container } = renderWithTheme(<Box />);

        expect(container.firstChild).toBeTruthy();
      });
    });
  });

  describe('GIVEN a Box element containing a child span', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the child text is present in the document', () => {
        const { getByText } = renderWithTheme(
          <Box>
            <span>child</span>
          </Box>,
        );

        expect(getByText('child')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Box element with p="md"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it("THEN the element's padding matches the md spacing token", () => {
        const { container } = renderWithTheme(<Box p="md" />);

        const el = container.firstChild as HTMLElement;
        expect(el.style.padding).toBe(`${spacing.md}px`);
      });
    });
  });

  describe('GIVEN a Box element with px="lg"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN paddingLeft and paddingRight match the lg spacing token', () => {
        const { container } = renderWithTheme(<Box px="lg" />);

        const el = container.firstChild as HTMLElement;
        expect(el.style.paddingLeft).toBe(`${spacing.lg}px`);
        expect(el.style.paddingRight).toBe(`${spacing.lg}px`);
      });
    });
  });

  describe('GIVEN a Box element with py="sm"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN paddingTop and paddingBottom match the sm spacing token', () => {
        const { container } = renderWithTheme(<Box py="sm" />);

        const el = container.firstChild as HTMLElement;
        expect(el.style.paddingTop).toBe(`${spacing.sm}px`);
        expect(el.style.paddingBottom).toBe(`${spacing.sm}px`);
      });
    });
  });

  describe('GIVEN a Box element with m="xl"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it("THEN the element's margin matches the xl spacing token", () => {
        const { container } = renderWithTheme(<Box m="xl" />);

        const el = container.firstChild as HTMLElement;
        expect(el.style.margin).toBe(`${spacing.xl}px`);
      });
    });
  });

  describe('GIVEN a Box element with radius="md"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it("THEN the element's borderRadius matches the md radius token", () => {
        const { container } = renderWithTheme(<Box radius="md" />);

        const el = container.firstChild as HTMLElement;
        expect(el.style.borderRadius).toBe(`${borderRadius.md}px`);
      });
    });
  });

  describe('GIVEN a Box element with bg="surface"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the element has a backgroundColor style applied', () => {
        const { container } = renderWithTheme(<Box bg="surface" />);

        const el = container.firstChild as HTMLElement;
        expect(el.style.backgroundColor).toBeTruthy();
      });
    });
  });

  describe('GIVEN a Box element with flex={1}', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the element\'s flex style contains "1"', () => {
        const { container } = renderWithTheme(<Box flex={1} />);

        const el = container.firstChild as HTMLElement;
        expect(el.style.flex).toContain('1');
      });
    });
  });

  describe('GIVEN a Box element with elevation="sm"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the element renders without error', () => {
        const { container } = renderWithTheme(<Box elevation="sm" />);

        const el = container.firstChild as HTMLElement;
        expect(el).toBeTruthy();
      });
    });
  });

  describe('GIVEN a Box element with p="md" and a custom width style', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN both token padding and custom width styles are applied', () => {
        const { container } = renderWithTheme(<Box p="md" style={{ width: 100 }} />);

        const el = container.firstChild as HTMLElement;
        expect(el.style.padding).toBe(`${spacing.md}px`);
        expect(el.style.width).toBe('100px');
      });
    });
  });
});
