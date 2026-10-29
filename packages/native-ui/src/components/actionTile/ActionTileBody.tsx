import type { StyleProp, ViewStyle } from 'react-native';
import { Box } from '../../primitives/Box';
import { renderIconSlot, type IconSlot } from '../../primitives/iconSlot';
import { Text } from '../../primitives/Text';
import { useTheme } from '../../theme';
import type { ActionTileTone } from './types';
import { resolveActionTileIconColor } from './actionTileStyles';

interface ActionTileBodyProps {
  icon: IconSlot;
  tone: ActionTileTone;
  label: string;
  iconChipStyle: StyleProp<ViewStyle>;
}

/** Tinted icon chip (icon in the tone's foreground color) above a centered label. */
export function ActionTileBody({ icon, tone, label, iconChipStyle }: ActionTileBodyProps) {
  const theme = useTheme();
  const iconProps = { color: resolveActionTileIconColor(theme, tone), size: theme.iconSize.lg };

  return (
    <>
      <Box style={iconChipStyle}>{renderIconSlot(icon, iconProps)}</Box>
      <Text variant="labelSmall" color="textPrimary" align="center" numberOfLines={1}>
        {label}
      </Text>
    </>
  );
}
