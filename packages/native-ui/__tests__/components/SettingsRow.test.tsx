import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Text } from 'react-native';
import { SettingsRow, SettingsSwitchRow } from '../../src/components/SettingsRow';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('SettingsRow', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the SettingsRow export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof SettingsRow;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_the_label_when_provided', () => {
    // GIVEN a SettingsRow with a "Categories" label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<SettingsRow label="Categories" icon="📁" />);

    // THEN the label text is present
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('should_render_the_emoji_icon_when_the_icon_prop_is_provided', () => {
    // GIVEN a SettingsRow with a "📁" emoji icon

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<SettingsRow label="Categories" icon="📁" />);

    // THEN the emoji is present in the document
    expect(screen.getByText('📁')).toBeInTheDocument();
  });

  it('should_invoke_onPress_when_the_row_is_clicked', () => {
    // GIVEN a SettingsRow with a mocked onPress
    const onPress = jest.fn();
    renderWithTheme(<SettingsRow label="Open" icon="📁" onPress={onPress} />);

    // WHEN the row is clicked
    fireEvent.click(screen.getByLabelText('Open'));

    // THEN onPress is invoked exactly once
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should_prefer_renderIcon_over_the_emoji_icon_when_both_are_provided', () => {
    // GIVEN a SettingsRow supplying both an emoji icon and a renderIcon render prop

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <SettingsRow
        label="Lang"
        icon="📁"
        renderIcon={() => <Text>RENDERED</Text>}
      />,
    );

    // THEN only the render prop output is present
    expect(screen.getByText('RENDERED')).toBeInTheDocument();
    expect(screen.queryByText('📁')).not.toBeInTheDocument();
  });

  it('should_render_the_fallback_icon_background_when_the_emoji_is_not_in_the_default_color_map', () => {
    // GIVEN a SettingsRow with an emoji outside the default colour map

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<SettingsRow label="Mystery" icon="🦄" />);

    // THEN the emoji is still rendered
    expect(screen.getByText('🦄')).toBeInTheDocument();
  });

  it('should_merge_iconColorMap_on_top_of_the_default_map_without_crashing', () => {
    // GIVEN a SettingsRow with a custom color map entry

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <SettingsRow label="Mystery" icon="🦄" iconColorMap={{ '🦄': '#123456' }} />,
    );

    // THEN the emoji is still rendered
    expect(screen.getByText('🦄')).toBeInTheDocument();
  });

  it('should_render_the_destructive_row_without_crashing', () => {
    // GIVEN a destructive SettingsRow

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<SettingsRow label="Delete" icon="🗑️" destructive onPress={() => {}} />);

    // THEN the label text is present
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});

describe('SettingsSwitchRow', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the SettingsSwitchRow export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof SettingsSwitchRow;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_the_label_and_toggle_when_provided', () => {
    // GIVEN a SettingsSwitchRow with an emoji icon and value={true}

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <SettingsSwitchRow
        label="Dark Mode"
        icon="🌙"
        value
        onValueChange={() => {}}
      />,
    );

    // THEN the label is present and the toggle is checked
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('should_invoke_onValueChange_with_the_opposite_value_when_the_switch_is_clicked', () => {
    // GIVEN a SettingsSwitchRow with value={false} and a mocked onValueChange
    const onValueChange = jest.fn();
    renderWithTheme(
      <SettingsSwitchRow
        label="Dark Mode"
        icon="🌙"
        value={false}
        onValueChange={onValueChange}
      />,
    );

    // WHEN the toggle is clicked
    fireEvent.click(screen.getByRole('switch'));

    // THEN onValueChange is invoked with true
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('should_render_a_custom_renderIcon_when_provided', () => {
    // GIVEN a SettingsSwitchRow with a custom icon render prop

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <SettingsSwitchRow
        label="Dark Mode"
        renderIcon={() => <Text>CUSTOM</Text>}
        value
        onValueChange={() => {}}
      />,
    );

    // THEN the custom icon is present
    expect(screen.getByText('CUSTOM')).toBeInTheDocument();
  });
});
