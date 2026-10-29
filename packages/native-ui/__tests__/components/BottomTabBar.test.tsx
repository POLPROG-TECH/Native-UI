import { screen, fireEvent } from '@testing-library/react';
import { BottomTabBar, type BottomTabBarItem } from '../../src/components/BottomTabBar';
import { defined, renderWithTheme } from '../test-utils';

function makeItems(): BottomTabBarItem[] {
  return [
    { key: 'home', label: 'Home', icon: () => <span data-testid="icon-home">H</span> },
    { key: 'search', label: 'Search', icon: () => <span data-testid="icon-search">S</span> },
    { key: 'profile', label: 'Profile', icon: () => <span data-testid="icon-profile">P</span> },
  ];
}

describe('BottomTabBar', () => {
  describe('GIVEN the BottomTabBar export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof BottomTabBar;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a BottomTabBar with three items', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN all three labels are present', () => {
        renderWithTheme(<BottomTabBar items={makeItems()} activeKey="home" onSelect={() => {}} />);

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a BottomTabBar with a mocked onSelect callback', () => {
    describe('WHEN the "Search" tab is clicked', () => {
      it('THEN onSelect is called once with the "search" key', () => {
        const onSelect = jest.fn();
        renderWithTheme(<BottomTabBar items={makeItems()} activeKey="home" onSelect={onSelect} />);

        fireEvent.click(screen.getByLabelText('Search'));

        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(onSelect).toHaveBeenCalledWith('search');
      });
    });
  });

  describe('GIVEN a BottomTabBar with "profile" as the active key', () => {
    describe("WHEN the active tab's aria-selected attribute is inspected", () => {
      it('THEN it exposes the selected state', () => {
        renderWithTheme(
          <BottomTabBar items={makeItems()} activeKey="profile" onSelect={() => {}} />,
        );

        const activeTab = screen.getByLabelText('Profile');

        expect(activeTab).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('GIVEN a BottomTabBar whose first item carries a badge of 5', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the badge text is visible', () => {
        const items = makeItems();
        items[0] = { ...defined(items[0], 'first tab'), badge: 5 };
        renderWithTheme(<BottomTabBar items={items} activeKey="home" onSelect={() => {}} />);

        expect(screen.getByText('5')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a BottomTabBar whose first item carries a badge of 250', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the badge text is "99+"', () => {
        const items = makeItems();
        items[0] = { ...defined(items[0], 'first tab'), badge: 250 };
        renderWithTheme(<BottomTabBar items={items} activeKey="home" onSelect={() => {}} />);

        expect(screen.getByText('99+')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a BottomTabBar whose first item carries a literal "NEW" badge', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the badge text equals "NEW"', () => {
        const items = makeItems();
        items[0] = { ...defined(items[0], 'first tab'), badge: 'NEW' };
        renderWithTheme(<BottomTabBar items={items} activeKey="home" onSelect={() => {}} />);

        expect(screen.getByText('NEW')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a BottomTabBar whose first item has badge=0 (common "no unread" state)', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no "0" badge is shown', () => {
        const items = makeItems();
        items[0] = { ...defined(items[0], 'first tab'), badge: 0 };
        renderWithTheme(<BottomTabBar items={items} activeKey="home" onSelect={() => {}} />);

        expect(screen.queryByText('0')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a BottomTabBar whose first item has a negative badge count', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no negative-count badge is shown', () => {
        const items = makeItems();
        items[0] = { ...defined(items[0], 'first tab'), badge: -3 };
        renderWithTheme(<BottomTabBar items={items} activeKey="home" onSelect={() => {}} />);

        expect(screen.queryByText('-3')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a BottomTabBar whose first item has an empty-string badge', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no empty-label badge bubble is shown (there is no text node to match; assert the home tab renders without badge text beyond the label)', () => {
        const items = makeItems();
        items[0] = { ...defined(items[0], 'first tab'), badge: '' };
        renderWithTheme(<BottomTabBar items={items} activeKey="home" onSelect={() => {}} />);

        expect(screen.getByLabelText('Home')).toBeInTheDocument();
        /* No badge text is rendered at all for empty string */
        expect(screen.queryByText(' ')).not.toBeInTheDocument();
      });
    });
  });
});
