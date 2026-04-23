import React from 'react';
import { screen } from '@testing-library/react';
import { Avatar } from '../../src/components/Avatar';
import { renderWithTheme } from '../test-utils';

describe('Avatar', () => {
  it('should be exported as a function component', () => {
    expect(typeof Avatar).toBe('function');
  });

  it('should render the provided initials uppercased when mounted', () => {
    // GIVEN initials provided directly as a prop
    renderWithTheme(<Avatar initials="dk" />);

    // THEN they are displayed uppercased
    expect(screen.getByText('DK')).toBeInTheDocument();
  });

  it('should derive initials from the first character of the first two words of `name`', () => {
    // GIVEN a full display name
    renderWithTheme(<Avatar name="Zakk Wylde" />);

    // THEN the first letter of each of the first two words is shown
    expect(screen.getByText('ZW')).toBeInTheDocument();
  });

  it('should truncate derived initials to at most two characters', () => {
    // GIVEN a name with three words
    renderWithTheme(<Avatar name="John Ronald Reuel Tolkien" />);

    // THEN only the first two initials are used
    expect(screen.getByText('JR')).toBeInTheDocument();
  });

  it('should fall back to a question mark when no image, initials, or name are provided', () => {
    // GIVEN an Avatar rendered without any identifying props
    // WHEN the component is mounted
    renderWithTheme(<Avatar />);

    // THEN the fallback question mark is displayed
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('should render each supported size variant without crashing', () => {
    // GIVEN the full set of supported Avatar sizes
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;

    // WHEN each size is rendered in isolation
    const renderAll = () => {
      sizes.forEach((size) => {
        const { unmount } = renderWithTheme(<Avatar initials="AB" size={size} />);
        unmount();
      });
    };

    // THEN every size renders without throwing
    expect(renderAll).not.toThrow();
  });

  it('should render the image variant when `source` is provided', () => {
    // GIVEN an Avatar with a remote image source
    // WHEN the component is rendered
    renderWithTheme(<Avatar source={{ uri: 'https://example.com/a.png' }} />);

    // THEN an accessibility-labelled image placeholder is rendered
    expect(screen.getByLabelText('Avatar')).toBeInTheDocument();
  });

  it('should prefer an explicit `accessibilityLabel` over the derived one', () => {
    // GIVEN an Avatar with both initials and an explicit accessibility label
    // WHEN the component is rendered
    renderWithTheme(<Avatar initials="dk" accessibilityLabel="User avatar" />);

    // THEN the provided accessibility label takes precedence
    expect(screen.getByLabelText('User avatar')).toBeInTheDocument();
  });
});
