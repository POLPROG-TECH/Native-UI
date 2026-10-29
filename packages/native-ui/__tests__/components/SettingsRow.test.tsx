import { screen, fireEvent } from '@testing-library/react';
import { Text } from 'react-native';
import { SettingsRow, SettingsSwitchRow } from '../../src/components/SettingsRow';
import { renderWithTheme } from '../test-utils';

describe('SettingsRow', () => {
  describe('GIVEN the SettingsRow export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof SettingsRow;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a SettingsRow with a "Categories" label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the label text is present', () => {
        renderWithTheme(<SettingsRow label="Categories" icon="📁" />);

        expect(screen.getByText('Categories')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a SettingsRow with a "📁" emoji icon', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the emoji is present in the document', () => {
        renderWithTheme(<SettingsRow label="Categories" icon="📁" />);

        expect(screen.getByText('📁')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a SettingsRow with a mocked onPress', () => {
    describe('WHEN the row is clicked', () => {
      it('THEN onPress is invoked exactly once', () => {
        const onPress = jest.fn();
        renderWithTheme(<SettingsRow label="Open" icon="📁" onPress={onPress} />);

        fireEvent.click(screen.getByLabelText('Open'));

        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a SettingsRow supplying both an emoji icon and a renderIcon render prop', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN only the render prop output is present', () => {
        renderWithTheme(
          <SettingsRow label="Lang" icon="📁" renderIcon={() => <Text>RENDERED</Text>} />,
        );

        expect(screen.getByText('RENDERED')).toBeInTheDocument();
        expect(screen.queryByText('📁')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a SettingsRow with an emoji outside the default colour map', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the emoji is still rendered', () => {
        renderWithTheme(<SettingsRow label="Mystery" icon="🦄" />);

        expect(screen.getByText('🦄')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a SettingsRow with a custom color map entry', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the emoji is still rendered', () => {
        renderWithTheme(
          <SettingsRow label="Mystery" icon="🦄" iconColorMap={{ '🦄': '#123456' }} />,
        );

        expect(screen.getByText('🦄')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a destructive SettingsRow', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the label text is present', () => {
        renderWithTheme(<SettingsRow label="Delete" icon="🗑️" destructive onPress={() => {}} />);

        expect(screen.getByText('Delete')).toBeInTheDocument();
      });
    });
  });
});

describe('SettingsSwitchRow', () => {
  describe('GIVEN the SettingsSwitchRow export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof SettingsSwitchRow;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a SettingsSwitchRow with an emoji icon and value={true}', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the label is present and the toggle is checked', () => {
        renderWithTheme(
          <SettingsSwitchRow label="Dark Mode" icon="🌙" value onValueChange={() => {}} />,
        );

        expect(screen.getByText('Dark Mode')).toBeInTheDocument();
        expect(screen.getByRole('switch')).toBeChecked();
      });
    });
  });

  describe('GIVEN a SettingsSwitchRow with value={false} and a mocked onValueChange', () => {
    describe('WHEN the toggle is clicked', () => {
      it('THEN onValueChange is invoked with true', () => {
        const onValueChange = jest.fn();
        renderWithTheme(
          <SettingsSwitchRow
            label="Dark Mode"
            icon="🌙"
            value={false}
            onValueChange={onValueChange}
          />,
        );

        fireEvent.click(screen.getByRole('switch'));

        expect(onValueChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('GIVEN a SettingsSwitchRow with a custom icon render prop', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the custom icon is present', () => {
        renderWithTheme(
          <SettingsSwitchRow
            label="Dark Mode"
            renderIcon={() => <Text>CUSTOM</Text>}
            value
            onValueChange={() => {}}
          />,
        );

        expect(screen.getByText('CUSTOM')).toBeInTheDocument();
      });
    });
  });
});
