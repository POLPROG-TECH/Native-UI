import { screen, fireEvent } from '@testing-library/react';
import { Text } from 'react-native';
import { Card } from '../../src/components/Card';
import { renderWithTheme } from '../test-utils';

describe('Card', () => {
  describe('GIVEN the Card export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof Card;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a Card wrapping a text child', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the child content is present in the document', () => {
        renderWithTheme(
          <Card>
            <Text>Hello card</Text>
          </Card>,
        );

        expect(screen.getByText('Hello card')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Card with renderHeader and renderFooter render props', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN header, body, and footer are all present', () => {
        renderWithTheme(
          <Card renderHeader={() => <Text>HEADER</Text>} renderFooter={() => <Text>FOOTER</Text>}>
            <Text>BODY</Text>
          </Card>,
        );

        expect(screen.getByText('HEADER')).toBeInTheDocument();
        expect(screen.getByText('BODY')).toBeInTheDocument();
        expect(screen.getByText('FOOTER')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN the full list of Card sizes', () => {
    describe('WHEN each size is rendered with a matching body', () => {
      it('THEN every size renders its body without crashing', () => {
        const sizes = ['compact', 'regular', 'spacious'] as const;

        const renderAll = () => {
          sizes.forEach((size) => {
            const { unmount } = renderWithTheme(
              <Card size={size}>
                <Text>{`size-${size}`}</Text>
              </Card>,
            );
            expect(screen.getByText(`size-${size}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });

  describe('GIVEN the full list of Card elevations', () => {
    describe('WHEN each elevation is rendered with a matching body', () => {
      it('THEN every elevation renders its body without crashing', () => {
        const elevations = ['xs', 'sm', 'md', 'lg'] as const;

        const renderAll = () => {
          elevations.forEach((el) => {
            const { unmount } = renderWithTheme(
              <Card elevation={el}>
                <Text>{`el-${el}`}</Text>
              </Card>,
            );
            expect(screen.getByText(`el-${el}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });

  describe('GIVEN a Card with a mocked onPress callback', () => {
    describe('WHEN the card surface is clicked', () => {
      it('THEN the onPress callback is invoked exactly once', () => {
        const onPress = jest.fn();
        renderWithTheme(
          <Card onPress={onPress}>
            <Text>Tap me</Text>
          </Card>,
        );

        fireEvent.click(screen.getByRole('button'));

        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a Card configured with padded={false}', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the child content is still present', () => {
        renderWithTheme(
          <Card padded={false}>
            <Text>No pad</Text>
          </Card>,
        );

        expect(screen.getByText('No pad')).toBeInTheDocument();
      });
    });
  });
});
