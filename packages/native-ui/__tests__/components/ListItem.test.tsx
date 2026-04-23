import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Text } from 'react-native';
import { ListItem } from '../../src/components/ListItem';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('ListItem', () => {
  it('should be exported as a function component', () => {
    // GIVEN the ListItem export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof ListItem;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render the title when a title is provided', () => {
    // GIVEN a ListItem with a "Profile" title

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ListItem title="Profile" />);

    // THEN the title text is present
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should render the subtitle when provided', () => {
    // GIVEN a ListItem with a subtitle

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ListItem title="Profile" subtitle="View and edit" />);

    // THEN the subtitle text is present
    expect(screen.getByText('View and edit')).toBeInTheDocument();
  });

  it('should render the value on the right when provided', () => {
    // GIVEN a ListItem with a trailing value

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ListItem title="Items" value="42" />);

    // THEN the value text is present
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should become pressable and invoke onPress when onPress is provided', () => {
    // GIVEN a ListItem with a mocked onPress callback
    const onPress = jest.fn();
    renderWithTheme(<ListItem title="Tap me" onPress={onPress} />);

    // WHEN the row is clicked
    fireEvent.click(screen.getByLabelText('Tap me'));

    // THEN onPress is called exactly once
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should render a default chevron when onPress is provided and no trailing element is given', () => {
    // GIVEN a pressable ListItem without a trailing element
    renderWithTheme(<ListItem title="Go" onPress={() => {}} />);

    // WHEN the chevron glyph is queried THEN it is present in the document
    expect(screen.getByText('›')).toBeInTheDocument();
  });

  it('should not render the default chevron when a trailing element is provided', () => {
    // GIVEN a pressable ListItem with a custom trailing element
    renderWithTheme(<ListItem title="Go" onPress={() => {}} trailing={<Text>NEXT</Text>} />);

    // WHEN the trailing element is rendered THEN only the trailing element is present and no default chevron
    expect(screen.getByText('NEXT')).toBeInTheDocument();
    expect(screen.queryByText('›')).not.toBeInTheDocument();
  });

  it('should use renderIcon when both icon and renderIcon are provided', () => {
    // GIVEN a ListItem supplying both an icon node and a renderIcon render prop
    renderWithTheme(
      <ListItem title="Icons" icon={<Text>RAW</Text>} renderIcon={() => <Text>RENDERED</Text>} />,
    );

    // WHEN the component is rendered THEN only the render prop output is present
    expect(screen.getByText('RENDERED')).toBeInTheDocument();
    expect(screen.queryByText('RAW')).not.toBeInTheDocument();
  });

  it('should use renderTrailing when both trailing and renderTrailing are provided', () => {
    // GIVEN a ListItem supplying both a trailing node and a renderTrailing render prop
    renderWithTheme(
      <ListItem
        title="Trail"
        trailing={<Text>RAW</Text>}
        renderTrailing={() => <Text>RENDERED</Text>}
      />,
    );

    // WHEN the component is rendered THEN only the render prop output is present
    expect(screen.getByText('RENDERED')).toBeInTheDocument();
    expect(screen.queryByText('RAW')).not.toBeInTheDocument();
  });

  it('should render a custom chevron via renderChevron when onPress is provided', () => {
    // GIVEN a pressable ListItem with a custom chevron renderer
    renderWithTheme(
      <ListItem title="Custom" onPress={() => {}} renderChevron={() => <Text>▶</Text>} />,
    );

    // WHEN the component is rendered THEN the custom chevron is present and the default glyph is not
    expect(screen.getByText('▶')).toBeInTheDocument();
    expect(screen.queryByText('›')).not.toBeInTheDocument();
  });

  it('should not be pressable when disabled is true even if onPress is provided', () => {
    // GIVEN a disabled ListItem with a mocked onPress
    const onPress = jest.fn();
    renderWithTheme(<ListItem title="Nope" onPress={onPress} disabled />);

    // WHEN the list item is queried by its title THEN no pressable role is attached to the row
    expect(screen.queryByLabelText('Nope')).not.toBeInTheDocument();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should render the destructive title color without crashing when destructive is true', () => {
    // GIVEN a destructive ListItem

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ListItem title="Delete" destructive onPress={() => {}} />);

    // THEN the title text is present
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});
