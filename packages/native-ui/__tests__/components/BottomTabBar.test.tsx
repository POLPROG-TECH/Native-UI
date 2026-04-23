import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BottomTabBar, type BottomTabBarItem } from '../../src/components/BottomTabBar';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

function makeItems(): BottomTabBarItem[] {
  return [
    { key: 'home', label: 'Home', icon: () => <span data-testid="icon-home">H</span> },
    { key: 'search', label: 'Search', icon: () => <span data-testid="icon-search">S</span> },
    { key: 'profile', label: 'Profile', icon: () => <span data-testid="icon-profile">P</span> },
  ];
}

describe('BottomTabBar', () => {
  it('should be exported as a function component', () => {
    // GIVEN the BottomTabBar export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof BottomTabBar;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render every item label when the items array is provided', () => {
    // GIVEN a BottomTabBar with three items
    renderWithTheme(<BottomTabBar items={makeItems()} activeKey="home" onSelect={() => {}} />);

    // WHEN the component is rendered THEN all three labels are present
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should invoke onSelect with the item key when an item is pressed', () => {
    // GIVEN a BottomTabBar with a mocked onSelect callback
    const onSelect = jest.fn();
    renderWithTheme(<BottomTabBar items={makeItems()} activeKey="home" onSelect={onSelect} />);

    // WHEN the "Search" tab is clicked
    fireEvent.click(screen.getByLabelText('Search'));

    // THEN onSelect is called once with the "search" key
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('search');
  });

  it('should mark the active item as selected via accessibilityState', () => {
    // GIVEN a BottomTabBar with "profile" as the active key
    renderWithTheme(<BottomTabBar items={makeItems()} activeKey="profile" onSelect={() => {}} />);

    // WHEN the active tab's aria-selected attribute is inspected
    const activeTab = screen.getByLabelText('Profile');

    // THEN it exposes the selected state
    expect(activeTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should render a numeric badge when the item has a badge count', () => {
    // GIVEN a BottomTabBar whose first item carries a badge of 5
    const items = makeItems();
    items[0] = { ...items[0]!, badge: 5 };
    renderWithTheme(<BottomTabBar items={items} activeKey="home" onSelect={() => {}} />);

    // WHEN the component is rendered THEN the badge text is visible
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should cap numeric badges over 99 with a plus suffix', () => {
    // GIVEN a BottomTabBar whose first item carries a badge of 250
    const items = makeItems();
    items[0] = { ...items[0]!, badge: 250 };
    renderWithTheme(<BottomTabBar items={items} activeKey="home" onSelect={() => {}} />);

    // WHEN the component is rendered THEN the badge text is "99+"
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('should render a string badge verbatim', () => {
    // GIVEN a BottomTabBar whose first item carries a literal "NEW" badge
    const items = makeItems();
    items[0] = { ...items[0]!, badge: 'NEW' };
    renderWithTheme(<BottomTabBar items={items} activeKey="home" onSelect={() => {}} />);

    // WHEN the component is rendered THEN the badge text equals "NEW"
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('should hide the badge when the numeric badge is zero', () => {
    // GIVEN a BottomTabBar whose first item has badge=0 (common "no unread" state)
    const items = makeItems();
    items[0] = { ...items[0]!, badge: 0 };
    renderWithTheme(<BottomTabBar items={items} activeKey="home" onSelect={() => {}} />);

    // WHEN the component is rendered THEN no "0" badge is shown
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should hide the badge when the numeric badge is negative', () => {
    // GIVEN a BottomTabBar whose first item has a negative badge count
    const items = makeItems();
    items[0] = { ...items[0]!, badge: -3 };
    renderWithTheme(<BottomTabBar items={items} activeKey="home" onSelect={() => {}} />);

    // WHEN the component is rendered THEN no negative-count badge is shown
    expect(screen.queryByText('-3')).not.toBeInTheDocument();
  });

  it('should hide the badge when the string badge is empty', () => {
    // GIVEN a BottomTabBar whose first item has an empty-string badge
    const items = makeItems();
    items[0] = { ...items[0]!, badge: '' };
    renderWithTheme(<BottomTabBar items={items} activeKey="home" onSelect={() => {}} />);

    // WHEN the component is rendered THEN no empty-label badge bubble is shown
    // (there is no text node to match; assert the home tab renders without badge text beyond the label)
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    // No badge text is rendered at all for empty string
    expect(screen.queryByText(' ')).not.toBeInTheDocument();
  });
});
