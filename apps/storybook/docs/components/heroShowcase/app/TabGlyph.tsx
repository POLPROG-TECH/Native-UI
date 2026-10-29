import { Box, HStack, VStack } from '@polprog/native-ui';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import type { ShowcaseTab } from '../showcaseData';

interface GlyphProps {
  color: string;
  size: number;
}

/** Stroke weight of every tab glyph, as a share of the icon box. */
const STROKE_RATIO = 0.12;

function OverviewGlyph({ color, size }: GlyphProps) {
  const cell = size * 0.42;
  const tile = { width: cell, height: cell, borderRadius: cell * 0.3, borderColor: color };

  return (
    <VStack style={[styles.box, { width: size, height: size }]} justify="space-between">
      <HStack justify="space-between">
        <Box style={[styles.tile, tile, { borderWidth: size * STROKE_RATIO }]} />
        <Box style={[styles.tile, tile, { borderWidth: size * STROKE_RATIO }]} />
      </HStack>
      <HStack justify="space-between">
        <Box style={[styles.tile, tile, { borderWidth: size * STROKE_RATIO }]} />
        <Box style={[styles.tile, tile, { backgroundColor: color }]} />
      </HStack>
    </VStack>
  );
}

function ExpensesGlyph({ color, size }: GlyphProps) {
  const stroke = size * STROKE_RATIO;
  const rows = [0, 1, 2];

  return (
    <VStack style={[styles.box, { width: size, height: size }]} justify="space-evenly">
      {rows.map((row) => (
        <HStack key={row} align="center" style={{ gap: stroke * 1.5 }}>
          <Box
            style={{
              width: stroke * 1.6,
              height: stroke * 1.6,
              borderRadius: stroke,
              backgroundColor: color,
            }}
          />
          <Box style={{ flex: 1, height: stroke, borderRadius: stroke, backgroundColor: color }} />
        </HStack>
      ))}
    </VStack>
  );
}

function SettingsGlyph({ color, size }: GlyphProps) {
  const stroke = size * STROKE_RATIO;
  const knob = size * 0.32;
  const knobOffsets = ['18%', '52%'] as const;

  return (
    <VStack style={[styles.box, { width: size, height: size }]} justify="space-evenly">
      {knobOffsets.map((left) => (
        <Box key={left} style={styles.slider}>
          <Box style={{ height: stroke, borderRadius: stroke, backgroundColor: color }} />
          <Box
            style={[
              styles.knob,
              { left, width: knob, height: knob, borderRadius: knob, backgroundColor: color },
            ]}
          />
        </Box>
      ))}
    </VStack>
  );
}

const GLYPHS: Record<ShowcaseTab, (props: GlyphProps) => ReactNode> = {
  overview: OverviewGlyph,
  expenses: ExpensesGlyph,
  settings: SettingsGlyph,
};

/**
 * Tab icons drawn with Views, like the library's SystemIcon, so the demo
 * needs no icon font and the glyphs take the tab bar's own colours.
 */
export function TabGlyph({ tab, ...props }: GlyphProps & { tab: ShowcaseTab }) {
  const Glyph = GLYPHS[tab];

  return <Glyph {...props} />;
}

const styles = StyleSheet.create({
  box: {
    padding: 1,
  },
  tile: {
    borderStyle: 'solid',
  },
  slider: {
    justifyContent: 'center',
  },
  knob: {
    position: 'absolute',
  },
});
