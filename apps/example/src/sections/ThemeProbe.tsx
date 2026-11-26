import { Text } from '@polprog/native-ui';
import { useTheme } from '@polprog/native-ui/theme';

/**
 * Reads the theme through the `/theme` subpath while the provider comes from
 * the package root. If the two entries ever resolved to different copies of
 * the library, `useTheme` would throw here and the app would not render.
 */
export function ThemeProbe() {
  const { isDark } = useTheme();

  return (
    <Text variant="caption" color="textSecondary" testID="theme-probe">
      {isDark ? 'Dark theme, read through the subpath' : 'Light theme, read through the subpath'}
    </Text>
  );
}
