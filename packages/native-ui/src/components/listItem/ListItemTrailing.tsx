import type React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { SystemIcon } from '../../primitives/SystemIcon';
import { listItemLayout, useSecondaryTextStyle, type ListItemStyles } from './listItemStyles';

interface ListItemChevronProps {
  renderChevron?: () => React.ReactNode;
  testID?: string;
}

function ListItemChevron({ renderChevron, testID }: ListItemChevronProps) {
  const theme = useTheme();

  if (renderChevron) {
    return <>{renderChevron()}</>;
  }

  return (
    <SystemIcon
      name="chevronRight"
      size={theme.components.listItem.chevronSize}
      color={theme.colors.textTertiary}
      testID={testID ? `${testID}-chevron` : undefined}
    />
  );
}

interface ListItemTrailingProps extends ListItemChevronProps {
  value?: string;
  trailing: React.ReactNode;
  showChevron: boolean;
  styles: ListItemStyles;
}

/** Right-hand region: value text, custom trailing element, then the chevron. */
export function ListItemTrailing({
  value,
  trailing,
  showChevron,
  renderChevron,
  testID,
  styles,
}: ListItemTrailingProps) {
  const theme = useTheme();
  const secondaryTextStyle = useSecondaryTextStyle();

  return (
    <View style={[listItemLayout.right, styles.right]}>
      {value && (
        <Text
          style={[
            theme.typography.bodySmall,
            secondaryTextStyle,
            showChevron ? styles.valueBeforeChevron : null,
          ]}
          numberOfLines={1}
        >
          {value}
        </Text>
      )}
      {trailing}
      {showChevron && <ListItemChevron renderChevron={renderChevron} testID={testID} />}
    </View>
  );
}
