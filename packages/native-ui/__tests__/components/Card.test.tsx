import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Text } from 'react-native';
import { Card } from '../../src/components/Card';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('Card', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the Card export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof Card;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_its_children_when_used_as_a_static_container', () => {
    // GIVEN a Card wrapping a text child

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <Card>
        <Text>Hello card</Text>
      </Card>,
    );

    // THEN the child content is present in the document
    expect(screen.getByText('Hello card')).toBeInTheDocument();
  });

  it('should_render_header_and_footer_via_render_props', () => {
    // GIVEN a Card with renderHeader and renderFooter render props

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <Card
        renderHeader={() => <Text>HEADER</Text>}
        renderFooter={() => <Text>FOOTER</Text>}
      >
        <Text>BODY</Text>
      </Card>,
    );

    // THEN header, body, and footer are all present
    expect(screen.getByText('HEADER')).toBeInTheDocument();
    expect(screen.getByText('BODY')).toBeInTheDocument();
    expect(screen.getByText('FOOTER')).toBeInTheDocument();
  });

  it('should_render_every_card_size_without_crashing', () => {
    // GIVEN the full list of Card sizes
    const sizes = ['compact', 'regular', 'spacious'] as const;

    // WHEN each size is rendered with a matching body
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

    // THEN every size renders its body without crashing
    expect(renderAll).not.toThrow();
  });

  it('should_render_every_card_elevation_without_crashing', () => {
    // GIVEN the full list of Card elevations
    const elevations = ['xs', 'sm', 'md', 'lg'] as const;

    // WHEN each elevation is rendered with a matching body
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

    // THEN every elevation renders its body without crashing
    expect(renderAll).not.toThrow();
  });

  it('should_become_pressable_and_invoke_onPress_when_onPress_is_provided', () => {
    // GIVEN a Card with a mocked onPress callback
    const onPress = jest.fn();
    renderWithTheme(
      <Card onPress={onPress}>
        <Text>Tap me</Text>
      </Card>,
    );

    // WHEN the card surface is clicked
    fireEvent.click(screen.getByRole('button'));

    // THEN the onPress callback is invoked exactly once
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should_render_without_padding_when_padded_is_false', () => {
    // GIVEN a Card configured with padded={false}

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <Card padded={false}>
        <Text>No pad</Text>
      </Card>,
    );

    // THEN the child content is still present
    expect(screen.getByText('No pad')).toBeInTheDocument();
  });
});
