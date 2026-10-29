import { VStack, HStack } from '../../src/primitives/Stack';
import { spacing } from '../../src/tokens/spacing';
import { renderWithTheme } from '../test-utils';

describe('VStack', () => {
  describe('GIVEN the VStack export from the primitives module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof VStack;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a VStack with a single child span', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the container has a rendered child element', () => {
        const { container } = renderWithTheme(
          <VStack>
            <span>a</span>
          </VStack>,
        );

        expect(container.firstChild).toBeTruthy();
      });

      it('THEN flexDirection is set to column', () => {
        const { container } = renderWithTheme(
          <VStack>
            <span>a</span>
          </VStack>,
        );

        const el = container.firstChild as HTMLElement;
        expect(el.style.flexDirection).toBe('column');
      });
    });
  });

  describe('GIVEN a VStack with gap="md"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN gap matches the md spacing token', () => {
        const { container } = renderWithTheme(
          <VStack gap="md">
            <span>a</span>
          </VStack>,
        );

        const el = container.firstChild as HTMLElement;
        expect(el.style.gap).toBe(`${spacing.md}px`);
      });
    });
  });

  describe('GIVEN a VStack with align="center" and justify="space-between"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN alignItems and justifyContent match the provided values', () => {
        const { container } = renderWithTheme(
          <VStack align="center" justify="space-between">
            <span>a</span>
          </VStack>,
        );

        const el = container.firstChild as HTMLElement;
        expect(el.style.alignItems).toBe('center');
        expect(el.style.justifyContent).toBe('space-between');
      });
    });
  });

  describe('GIVEN a VStack with flex={1}', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the element\'s flex style contains "1"', () => {
        const { container } = renderWithTheme(
          <VStack flex={1}>
            <span>a</span>
          </VStack>,
        );

        const el = container.firstChild as HTMLElement;
        expect(el.style.flex).toContain('1');
      });
    });
  });

  describe('GIVEN a VStack with wrap enabled', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN flexWrap is set to wrap', () => {
        const { container } = renderWithTheme(
          <VStack wrap>
            <span>a</span>
          </VStack>,
        );

        const el = container.firstChild as HTMLElement;
        expect(el.style.flexWrap).toBe('wrap');
      });
    });
  });

  describe('GIVEN a VStack with p="lg" and mx="sm"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN padding and marginLeft match the respective spacing tokens', () => {
        const { container } = renderWithTheme(
          <VStack p="lg" mx="sm">
            <span>a</span>
          </VStack>,
        );

        const el = container.firstChild as HTMLElement;
        expect(el.style.padding).toBe(`${spacing.lg}px`);
        expect(el.style.marginLeft).toBe(`${spacing.sm}px`);
      });
    });
  });

  describe('GIVEN a VStack with bg="surface"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the element has a backgroundColor style applied', () => {
        const { container } = renderWithTheme(
          <VStack bg="surface">
            <span>a</span>
          </VStack>,
        );

        const el = container.firstChild as HTMLElement;
        expect(el.style.backgroundColor).toBeTruthy();
      });
    });
  });

  describe('GIVEN a VStack with radius="md"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the element has a borderRadius style applied', () => {
        const { container } = renderWithTheme(
          <VStack radius="md">
            <span>a</span>
          </VStack>,
        );

        const el = container.firstChild as HTMLElement;
        expect(el.style.borderRadius).toBeTruthy();
      });
    });
  });

  describe('GIVEN a VStack with two child spans', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN both children are present in the rendered output', () => {
        const { container } = renderWithTheme(
          <VStack>
            <span>one</span>
            <span>two</span>
          </VStack>,
        );

        const el = container.firstChild as HTMLElement;
        expect(el.children).toHaveLength(2);
      });
    });
  });
});

describe('HStack', () => {
  describe('GIVEN the HStack export from the primitives module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof HStack;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN an HStack with a single child span', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the container has a rendered child element', () => {
        const { container } = renderWithTheme(
          <HStack>
            <span>a</span>
          </HStack>,
        );

        expect(container.firstChild).toBeTruthy();
      });

      it('THEN flexDirection is set to row', () => {
        const { container } = renderWithTheme(
          <HStack>
            <span>a</span>
          </HStack>,
        );

        const el = container.firstChild as HTMLElement;
        expect(el.style.flexDirection).toBe('row');
      });
    });
  });

  describe('GIVEN an HStack without an align prop', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN alignItems defaults to center', () => {
        const { container } = renderWithTheme(
          <HStack>
            <span>a</span>
          </HStack>,
        );

        const el = container.firstChild as HTMLElement;
        expect(el.style.alignItems).toBe('center');
      });
    });
  });

  describe('GIVEN an HStack with gap="sm"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN gap matches the sm spacing token', () => {
        const { container } = renderWithTheme(
          <HStack gap="sm">
            <span>a</span>
          </HStack>,
        );

        const el = container.firstChild as HTMLElement;
        expect(el.style.gap).toBe(`${spacing.sm}px`);
      });
    });
  });

  describe('GIVEN an HStack with align="flex-start"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN alignItems is overridden to flex-start', () => {
        const { container } = renderWithTheme(
          <HStack align="flex-start">
            <span>a</span>
          </HStack>,
        );

        const el = container.firstChild as HTMLElement;
        expect(el.style.alignItems).toBe('flex-start');
      });
    });
  });
});
