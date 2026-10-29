import { screen, fireEvent } from '@testing-library/react';
import { Text } from 'react-native';
import { ListItem } from '../../src/components/ListItem';
import { renderWithTheme } from '../test-utils';

describe('ListItem', () => {
  describe('GIVEN the ListItem export from the components module', () => {
    describe('WHEN its runtime type is inspected React.memo wraps a function component into an object with $$typeof', () => {
      it('THEN it is a memoized component (object) or function component', () => {
        const actualType = typeof ListItem;

        expect(['function', 'object']).toContain(actualType);
        expect(ListItem).toBeDefined();
      });
    });
  });

  describe('GIVEN a ListItem with a "Profile" title', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the title text is present', () => {
        renderWithTheme(<ListItem title="Profile" />);

        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ListItem with a subtitle', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the subtitle text is present', () => {
        renderWithTheme(<ListItem title="Profile" subtitle="View and edit" />);

        expect(screen.getByText('View and edit')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ListItem with a trailing value', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the value text is present', () => {
        renderWithTheme(<ListItem title="Items" value="42" />);

        expect(screen.getByText('42')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ListItem with a mocked onPress callback', () => {
    describe('WHEN the row is clicked', () => {
      it('THEN onPress is called exactly once', () => {
        const onPress = jest.fn();
        renderWithTheme(<ListItem title="Tap me" onPress={onPress} />);

        fireEvent.click(screen.getByLabelText('Tap me'));

        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a pressable ListItem without a trailing element', () => {
    describe('WHEN the drawn chevron icon is queried', () => {
      it('THEN it is present in the document', () => {
        renderWithTheme(<ListItem title="Go" onPress={() => {}} testID="row" />);

        expect(screen.getByTestId('row-chevron')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a pressable ListItem with a custom trailing element', () => {
    describe('WHEN the trailing element is rendered', () => {
      it('THEN only the trailing element is present and no default chevron', () => {
        renderWithTheme(
          <ListItem title="Go" onPress={() => {}} trailing={<Text>NEXT</Text>} testID="row" />,
        );

        expect(screen.getByText('NEXT')).toBeInTheDocument();
        expect(screen.queryByTestId('row-chevron')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ListItem supplying both an icon node and a renderIcon render prop', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN only the render prop output is present', () => {
        renderWithTheme(
          <ListItem
            title="Icons"
            icon={<Text>RAW</Text>}
            renderIcon={() => <Text>RENDERED</Text>}
          />,
        );

        expect(screen.getByText('RENDERED')).toBeInTheDocument();
        expect(screen.queryByText('RAW')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ListItem supplying both a trailing node and a renderTrailing render prop', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN only the render prop output is present', () => {
        renderWithTheme(
          <ListItem
            title="Trail"
            trailing={<Text>RAW</Text>}
            renderTrailing={() => <Text>RENDERED</Text>}
          />,
        );

        expect(screen.getByText('RENDERED')).toBeInTheDocument();
        expect(screen.queryByText('RAW')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a pressable ListItem with a custom chevron renderer', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the custom chevron is present and the default icon is not', () => {
        renderWithTheme(
          <ListItem
            title="Custom"
            onPress={() => {}}
            renderChevron={() => <Text>▶</Text>}
            testID="row"
          />,
        );

        expect(screen.getByText('▶')).toBeInTheDocument();
        expect(screen.queryByTestId('row-chevron')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a disabled ListItem with a mocked onPress', () => {
    describe('WHEN the list item is queried by its title', () => {
      it('THEN no pressable role is attached to the row', () => {
        const onPress = jest.fn();
        renderWithTheme(<ListItem title="Nope" onPress={onPress} disabled />);

        expect(screen.queryByLabelText('Nope')).not.toBeInTheDocument();
        expect(onPress).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a destructive ListItem', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the title text is present', () => {
        renderWithTheme(<ListItem title="Delete" destructive onPress={() => {}} />);

        expect(screen.getByText('Delete')).toBeInTheDocument();
      });
    });
  });
});
