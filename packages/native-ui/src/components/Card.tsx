import { View } from 'react-native';
import { useTheme } from '../theme';
import { PressableCard } from './card/PressableCard';
import { buildCardStyle } from './card/cardStyle';
import type { CardProps } from './card/types';
export type { CardSize, CardElevation, CardProps } from './card/types';

/**
 * Elevated surface container with themed background and border.
 * Automatically becomes pressable (with spring-scale feedback) when
 * `onPress` or `onLongPress` is provided.
 *
 * Accepts `renderHeader` and `renderFooter` render props for structured layout.
 *
 * @example
 * ```tsx
 * <Card>
 *   <Text>Static content</Text>
 * </Card>
 * <Card onPress={openDetails} padded={false}>
 *   <Image source={banner} />
 * </Card>
 * <Card renderHeader={() => <Heading level={3}>Title</Heading>}>
 *   <Text>Body</Text>
 * </Card>
 * ```
 */
export function Card({ children, renderHeader, renderFooter, ...surfaceProps }: CardProps) {
  const theme = useTheme();
  const cardStyle = buildCardStyle(theme, surfaceProps);
  const content = (
    <>
      {renderHeader?.()}
      {children}
      {renderFooter?.()}
    </>
  );

  if (surfaceProps.onPress || surfaceProps.onLongPress) {
    return (
      <PressableCard {...surfaceProps} style={cardStyle}>
        {content}
      </PressableCard>
    );
  }

  return (
    <View style={cardStyle} testID={surfaceProps.testID}>
      {content}
    </View>
  );
}
