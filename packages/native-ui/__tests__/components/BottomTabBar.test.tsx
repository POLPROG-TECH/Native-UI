import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BottomTabBar, type BottomTabBarItem } from '../../src/components/BottomTabBar';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

function makeItems(): BottomTabBarItem[] {
  return [
    { key: 'home', label: 'Home', icon: () => <span data-testid="icon-home">H</span> },
    { key: 'search', label: 'Search', icon: () => <span data-testid="icon-search">S</span> },
    { key: 'profile', label: 'Profile', icon: () => <span data-testid="icon-profile">P</span> },
  ];
}

describe('BottomTabBar', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the BottomTabBar export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof BottomTabBar;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_every_item_label_when_the_items_array_is_provided', () => {
    // GIVEN a BottomTabBar with three items
    renderWithTheme(
      <BottomTabBar items={makeItems()} activeKey="home" onSelect={() => {}} />,
    );

    // WHEN the component is rendered THEN all three labels are present
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should_invoke_onSelect_with_the_item_key_when_an_item_is_pressed', () => {
    // GIVEN a BottomTabBar with a mocked onSelect callback
    const onSelect = jest.fn();
    renderWithTheme(
      <BottomTabBar items={makeItems()} activeKey="home" onSelect={onSelect} />,
    );

    // WHEN the "Search" tab is clicked
    fireEvent.click(screen.getByLabelText('Search'));

    // THEN onSelect is called once with the "search" key
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('search');
  });

  it('should_mark_the_active_item_as_selected_via_accessibilityState', () => {
    // GIVEN a BottomTabBar with "profile" as the active key
    renderWithTheme(
      <BottomTabBar items={makeItems()} activeKey="profile" onSelect={() => {}} />,
    );

    // WHEN the active tab's aria-selected attribute is inspected
    const activeTab = screen.getByLabelText('Profile');

    // THEN it exposes the selected state
    expect(activeTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should_render_a_numeric_badge_when_the_item_has_a_badge_count', () => {
    // GIVEN a BottomTabBar whose first item carries a badge of 5
    const items = makeItems();
    items[0] = { ...items[0]!, badge: 5 };
    renderWithTheme(
      <BottomTabBar items={items} activeKey="home" onSelect={() => {}} />,
    );

    // WHEN the component is rendered THEN the badge text is visible
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should_cap_numeric_badges_over_99_with_a_plus_suffix', () => {
    // GIVEN a BottomTabBar whose first item carries a badge of 250
    const items = makeItems();
    items[0] = { ...items[0]!, badge: 250 };
    renderWithTheme(
      <BottomTabBar items={items} activeKey="home" onSelect={() => {}} />,
    );

    // WHEN the component is rendered THEN the badge text is "99+"
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('should_render_a_string_badge_verbatim', () => {
    // GIVEN a BottomTabBar whose first item carries a literal "NEW" badge
    const items = makeItems();
    items[0] = { ...items[0]!, badge: 'NEW' };
    renderWithTheme(
      <BottomTabBar items={items} activeKey="home" onSelect={() => {}} />,
    );

    // WHEN the component is rendered THEN the badge text equals "NEW"
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('should_use_custom_accessibilityLabel_when_provided_on_an_item', () => {
    // GIVEN a BottomTabBar whose first item has a custom accessibility label
    const items = makeItems();
    items[0] = { ...items[0]!, accessibilityLabel: 'Go home' };
    renderWithTheme(
      <BottomTabBar items={items} activeKey="home" onSelect={() => {}} />,
    );

    // WHEN the component is rendered THEN the tab is discoverable under the custom label
    expect(screen.getByLabelText('Go home')).toBeInTheDocument();
  });
});
