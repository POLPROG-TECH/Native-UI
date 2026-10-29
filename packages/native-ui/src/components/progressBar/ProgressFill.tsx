import { StyleSheet, View } from 'react-native';
import { progressWidth } from './progressValue';

interface ProgressFillProps {
  fraction: number;
  color: string;
  height: number;
  testID?: string;
}

/** Filled portion of the track, rounded to match it. */
export function ProgressFill({ fraction, color, height, testID }: ProgressFillProps) {
  return (
    <View
      testID={testID}
      style={[
        styles.fill,
        { backgroundColor: color, width: progressWidth(fraction), borderRadius: height / 2 },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    height: '100%',
  },
});
