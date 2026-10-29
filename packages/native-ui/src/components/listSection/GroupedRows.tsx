import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { hasDividerBefore } from './dividers';

function RowDivider() {
  const theme = useTheme();

  return (
    <View
      style={{
        height: theme.components.divider.thickness,
        backgroundColor: theme.colors.divider,
        marginVertical: theme.components.listSection.dividerMarginVertical,
      }}
    />
  );
}

/** The single shared card of a grouped ListSection, with hairlines between rows. */
export function GroupedRows({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const tokens = theme.components.listSection;
  const rows = React.Children.toArray(children);

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: tokens.groupedRadius,
        paddingVertical: tokens.groupedPaddingVertical,
        paddingHorizontal: tokens.groupedPaddingHorizontal,
      }}
    >
      {rows.map((row, index) => (
        <React.Fragment key={index}>
          {hasDividerBefore(rows, index) && <RowDivider />}
          {row}
        </React.Fragment>
      ))}
    </View>
  );
}
