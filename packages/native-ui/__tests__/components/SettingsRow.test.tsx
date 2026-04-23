import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Text } from 'react-native';
import { SettingsRow, SettingsSwitchRow } from '../../src/components/SettingsRow';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('SettingsRow', () => {
  it('should be exported as a function component', () => {
    // GIVEN the SettingsRow export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof SettingsRow;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render the label when provided', () => {
    // GIVEN a SettingsRow with a "Categories" label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<SettingsRow label="Categories" icon="📁" />);

    // THEN the label text is present
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('should render the emoji icon when the icon prop is provided', () => {
    // GIVEN a SettingsRow with a "📁" emoji icon

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<SettingsRow label="Categories" icon="📁" />);

    // THEN the emoji is present in the document
    expect(screen.getByText('📁')).toBeInTheDocument();
  });

  it('should invoke onPress when the row is clicked', () => {
    // GIVEN a SettingsRow with a mocked onPress
    const onPress = jest.fn();
    renderWithTheme(<SettingsRow label="Open" icon="📁" onPress={onPress} />);

    // WHEN the row is clicked
    fireEvent.click(screen.getByLabelText('Open'));

    // THEN onPress is invoked exactly once
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should prefer renderIcon over the emoji icon when both are provided', () => {
    // GIVEN a SettingsRow supplying both an emoji icon and a renderIcon render prop

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <SettingsRow label="Lang" icon="📁" renderIcon={() => <Text>RENDERED</Text>} />,
    );

    // THEN only the render prop output is present
    expect(screen.getByText('RENDERED')).toBeInTheDocument();
    expect(screen.queryByText('📁')).not.toBeInTheDocument();
  });

  it('should render the fallback icon background when the emoji is not in the default color map', () => {
    // GIVEN a SettingsRow with an emoji outside the default colour map

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<SettingsRow label="Mystery" icon="🦄" />);

    // THEN the emoji is still rendered
    expect(screen.getByText('🦄')).toBeInTheDocument();
  });

  it('should merge iconColorMap on top of the default map without crashing', () => {
    // GIVEN a SettingsRow with a custom color map entry

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<SettingsRow label="Mystery" icon="🦄" iconColorMap={{ '🦄': '#123456' }} />);

    // THEN the emoji is still rendered
    expect(screen.getByText('🦄')).toBeInTheDocument();
  });

  it('should render the destructive row without crashing', () => {
    // GIVEN a destructive SettingsRow

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<SettingsRow label="Delete" icon="🗑️" destructive onPress={() => {}} />);

    // THEN the label text is present
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});

describe('SettingsSwitchRow', () => {
  it('should be exported as a function component', () => {
    // GIVEN the SettingsSwitchRow export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof SettingsSwitchRow;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render the label and toggle when provided', () => {
    // GIVEN a SettingsSwitchRow with an emoji icon and value={true}

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <SettingsSwitchRow label="Dark Mode" icon="🌙" value onValueChange={() => {}} />,
    );

    // THEN the label is present and the toggle is checked
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('should invoke onValueChange with the opposite value when the switch is clicked', () => {
    // GIVEN a SettingsSwitchRow with value={false} and a mocked onValueChange
    const onValueChange = jest.fn();
    renderWithTheme(
      <SettingsSwitchRow label="Dark Mode" icon="🌙" value={false} onValueChange={onValueChange} />,
    );

    // WHEN the toggle is clicked
    fireEvent.click(screen.getByRole('switch'));

    // THEN onValueChange is invoked with true
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('should render a custom renderIcon when provided', () => {
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
