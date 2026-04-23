import React from 'react';
import { render, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { Section } from '../../src/components/Section';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('Section', () => {
  it('should be exported as a function component', () => {
    // GIVEN the Section export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof Section;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render the title and children when provided', () => {
    // GIVEN a Section with a title and a child

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <Section title="Stats">
        <Text>Body</Text>
      </Section>,
    );

    // THEN both the title and the child content are present
    expect(screen.getByText('Stats')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('should render the action element when provided', () => {
    // GIVEN a Section with a custom action element

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <Section title="Stats" action={<Text>MORE</Text>}>
        <Text>Body</Text>
      </Section>,
    );

    // THEN the action element is present
    expect(screen.getByText('MORE')).toBeInTheDocument();
  });
});
