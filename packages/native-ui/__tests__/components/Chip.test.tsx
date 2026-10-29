import { screen, fireEvent } from '@testing-library/react';
import { Text } from 'react-native';
import { Chip, ChipGroup } from '../../src/components/Chip';
import { renderWithTheme } from '../test-utils';

describe('Chip', () => {
  describe('GIVEN the Chip export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof Chip;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a Chip configured with a "Filter" label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the label text is present in the document', () => {
        renderWithTheme(<Chip label="Filter" />);

        expect(screen.getByText('Filter')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Chip with a mocked onPress callback', () => {
    describe('WHEN the chip is clicked', () => {
      it('THEN onPress is called exactly once', () => {
        const onPress = jest.fn();
        renderWithTheme(<Chip label="Click" onPress={onPress} />);

        fireEvent.click(screen.getByLabelText('Click'));

        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a Chip with a "🔥" icon and a "Hot" label', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN both the icon and the label appear', () => {
        renderWithTheme(<Chip label="Hot" icon="🔥" />);

        expect(screen.getByText('🔥')).toBeInTheDocument();
        expect(screen.getByText('Hot')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Chip supplying both a string icon and a renderIcon render prop', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN only the custom render prop output is present', () => {
        renderWithTheme(
          <Chip
            label="Tag"
            icon="★"
            renderIcon={() => <span data-testid="custom-icon">custom</span>}
          />,
        );

        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
        expect(screen.queryByText('★')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN the full list of Chip shapes', () => {
    describe('WHEN each shape is rendered with a matching label', () => {
      it('THEN every shape renders its label without crashing', () => {
        const shapes = ['pill', 'rounded', 'square'] as const;

        const renderAll = () => {
          shapes.forEach((shape) => {
            const { unmount } = renderWithTheme(<Chip label={`shape-${shape}`} shape={shape} />);
            expect(screen.getByText(`shape-${shape}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });

  describe('GIVEN the full list of Chip variants in both selection states', () => {
    describe('WHEN each variant is rendered both selected and unselected', () => {
      it('THEN every variant renders its label without crashing', () => {
        const variants = ['solid', 'soft', 'outline'] as const;

        const renderAll = () => {
          variants.forEach((variant) => {
            [false, true].forEach((selected) => {
              const label = `${variant}-${String(selected)}`;
              const { unmount } = renderWithTheme(
                <Chip label={label} variant={variant} selected={selected} />,
              );
              expect(screen.getByText(label)).toBeInTheDocument();
              unmount();
            });
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });

  describe('GIVEN both supported sizes', () => {
    describe('WHEN each size is rendered with a matching label', () => {
      it('THEN every size renders its label without crashing', () => {
        const sizes = ['sm', 'md'] as const;

        const renderAll = () => {
          sizes.forEach((size) => {
            const { unmount } = renderWithTheme(<Chip label={`size-${size}`} size={size} />);
            expect(screen.getByText(`size-${size}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });

  describe('GIVEN a disabled Chip with a mocked onPress', () => {
    describe('WHEN the chip is clicked', () => {
      it('THEN onPress is never invoked', () => {
        const onPress = jest.fn();
        renderWithTheme(<Chip label="Nope" onPress={onPress} disabled />);

        fireEvent.click(screen.getByLabelText('Nope'));

        expect(onPress).not.toHaveBeenCalled();
      });
    });
  });
});

describe('ChipGroup', () => {
  describe('GIVEN a ChipGroup wrapping two Chips', () => {
    describe('WHEN the composition is rendered inside a theme provider', () => {
      it('THEN both chip labels appear', () => {
        renderWithTheme(
          <ChipGroup>
            <Chip label="One" />
            <Chip label="Two" />
          </ChipGroup>,
        );

        expect(screen.getByText('One')).toBeInTheDocument();
        expect(screen.getByText('Two')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ChipGroup wrapping a plain Text child', () => {
    describe('WHEN the composition is rendered inside a theme provider', () => {
      it('THEN the child text is present', () => {
        renderWithTheme(
          <ChipGroup>
            <Text>Plain</Text>
          </ChipGroup>,
        );

        expect(screen.getByText('Plain')).toBeInTheDocument();
      });
    });
  });
});
