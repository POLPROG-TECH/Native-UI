import { Box, HStack, Text, useColors } from '@polprog/native-ui';
import { StyleSheet } from 'react-native';
import { useShowcaseCopy } from '../showcaseCopy';

/** Heights of the cellular signal bars, smallest first. */
const SIGNAL_BARS = [4, 6, 8, 10] as const;

/** iOS-style status bar drawn with theme colours, so it flips with the scene. */
export function StatusBar() {
  const colors = useColors();
  const { clock } = useShowcaseCopy();

  return (
    <HStack justify="space-between" align="center" style={styles.bar}>
      <Text variant="labelSmall" style={styles.clock}>
        {clock}
      </Text>
      <HStack align="center" gap="xs">
        <HStack align="flex-end" style={styles.signal}>
          {SIGNAL_BARS.map((height) => (
            <Box
              key={height}
              style={[styles.signalBar, { height, backgroundColor: colors.textPrimary }]}
            />
          ))}
        </HStack>
        <Box style={[styles.battery, { borderColor: colors.textSecondary }]}>
          <Box style={[styles.batteryLevel, { backgroundColor: colors.textPrimary }]} />
        </Box>
      </HStack>
    </HStack>
  );
}

const styles = StyleSheet.create({
  /* Matches an iPhone status bar (54pt), centred on the Dynamic Island. */
  bar: {
    height: 54,
    paddingHorizontal: 32,
  },
  clock: {
    fontWeight: '700',
    minWidth: 52,
  },
  signal: {
    gap: 1.5,
  },
  signalBar: {
    width: 3,
    borderRadius: 1,
  },
  battery: {
    width: 22,
    height: 11,
    borderWidth: 1,
    borderRadius: 3.5,
    padding: 1.5,
  },
  batteryLevel: {
    width: '78%',
    height: '100%',
    borderRadius: 1.5,
  },
});
