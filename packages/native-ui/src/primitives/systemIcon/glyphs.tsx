import type { ReactNode } from 'react';
import { I18nManager, StyleSheet, View, type ViewStyle } from 'react-native';

export type SystemIconName =
  | 'close'
  | 'check'
  | 'alert'
  | 'info'
  | 'chevronDown'
  | 'chevronUp'
  | 'chevronLeft'
  | 'chevronRight'
  | 'plus'
  | 'minus'
  | 'search'
  | 'more';

type ChevronName = Extract<SystemIconName, `chevron${string}`>;

/** Resolved drawing inputs shared by every glyph. */
export interface GlyphGeometry {
  /** Edge length of the square icon box. */
  box: number;
  /** Stroke thickness in points. */
  stroke: number;
  color: string;
}

/**
 * Rotation of the L-shaped stroke pair and the axis it is nudged along so the
 * visual center of the chevron sits in the middle of the box.
 */
const CHEVRON_GEOMETRY: Record<ChevronName, { rotate: string; axis: 'x' | 'y'; sign: 1 | -1 }> = {
  chevronDown: { rotate: '45deg', axis: 'y', sign: -1 },
  chevronUp: { rotate: '-135deg', axis: 'y', sign: 1 },
  chevronRight: { rotate: '-45deg', axis: 'x', sign: -1 },
  chevronLeft: { rotate: '135deg', axis: 'x', sign: 1 },
};

/** Geometry as fractions of the icon box, so every size renders identically. */
const CROSS_LENGTH = 0.9;
const CHECK_SHORT = 0.35;
const CHECK_LONG = 0.75;
const CHEVRON_ARM = 0.5;
const BAR_LENGTH = 0.5;
const DOT_GAP = 0.12;
const PLUS_LENGTH = 0.8;
/* Lens is shifted up-left so lens and handle together stay centred in the box. */
const LENS_DIAMETER = 0.62;
const LENS_SHIFT = -0.1;
const HANDLE_LENGTH = 0.4;
const HANDLE_SHIFT = 0.26;
const MORE_DOT = 0.18;
const MORE_GAP = 0.1;

function bar(length: number, stroke: number, color: string, rotate: string): ViewStyle {
  return {
    position: 'absolute',
    width: length,
    height: stroke,
    borderRadius: stroke / 2,
    backgroundColor: color,
    transform: [{ rotate }],
  };
}

function renderCross({ box, stroke, color }: GlyphGeometry) {
  return (
    <>
      <View style={bar(box * CROSS_LENGTH, stroke, color, '45deg')} />
      <View style={bar(box * CROSS_LENGTH, stroke, color, '-45deg')} />
    </>
  );
}

/** An L-shape (two borders of a box) rotated 45deg: short and long arm. */
function renderCheck({ box, stroke, color }: GlyphGeometry) {
  return (
    <View
      style={{
        width: box * CHECK_SHORT,
        height: box * CHECK_LONG,
        borderColor: color,
        borderRightWidth: stroke,
        borderBottomWidth: stroke,
        transform: [{ translateY: -stroke }, { rotate: '45deg' }],
      }}
    />
  );
}

/**
 * Left/right chevrons express reading direction, so they swap in RTL like the
 * Unicode glyphs they replace.
 */
function mirrorForLayout(name: ChevronName): ChevronName {
  if (!I18nManager.isRTL) {
    return name;
  }

  if (name === 'chevronLeft') {
    return 'chevronRight';
  }

  if (name === 'chevronRight') {
    return 'chevronLeft';
  }

  return name;
}

/** The check's L-shape with equal arms, rotated toward the pointing side. */
function renderChevron(name: ChevronName, { box, stroke, color }: GlyphGeometry) {
  const arm = box * CHEVRON_ARM;
  const { rotate, axis, sign } = CHEVRON_GEOMETRY[mirrorForLayout(name)];
  const nudge = (sign * arm) / 4;

  return (
    <View
      style={{
        width: arm,
        height: arm,
        borderColor: color,
        borderRightWidth: stroke,
        borderBottomWidth: stroke,
        transform: [axis === 'x' ? { translateX: nudge } : { translateY: nudge }, { rotate }],
      }}
    />
  );
}

function dotStyle(stroke: number, color: string): ViewStyle {
  return { width: stroke, height: stroke, borderRadius: stroke / 2, backgroundColor: color };
}

function stemStyle({ box, stroke, color }: GlyphGeometry): ViewStyle {
  return { ...dotStyle(stroke, color), height: box * BAR_LENGTH };
}

/** Vertical stem and dot: `alert` reads stem first (!), `info` dot first (i). */
function renderStemAndDot(order: 'stemFirst' | 'dotFirst', geometry: GlyphGeometry) {
  const dot = <View style={dotStyle(geometry.stroke, geometry.color)} />;
  const stem = <View style={stemStyle(geometry)} />;
  const gap = <View style={{ height: geometry.box * DOT_GAP }} />;

  return (
    <View style={styles.column}>
      {order === 'stemFirst' ? (
        <>
          {stem}
          {gap}
          {dot}
        </>
      ) : (
        <>
          {dot}
          {gap}
          {stem}
        </>
      )}
    </View>
  );
}

/** Horizontal bar, plus a vertical one for `plus`. */
function renderPlusMinus(withVertical: boolean, { box, stroke, color }: GlyphGeometry) {
  const length = box * PLUS_LENGTH;

  return (
    <>
      <View style={bar(length, stroke, color, '0deg')} />
      {withVertical && <View style={bar(length, stroke, color, '90deg')} />}
    </>
  );
}

function lensStyle({ box, stroke, color }: GlyphGeometry): ViewStyle {
  const diameter = box * LENS_DIAMETER;
  const shift = box * LENS_SHIFT;

  return {
    position: 'absolute',
    width: diameter,
    height: diameter,
    borderRadius: diameter / 2,
    borderWidth: stroke,
    borderColor: color,
    transform: [{ translateX: shift }, { translateY: shift }],
  };
}

/** Ring lens up-left with a 45deg handle leaving it towards the bottom-right. */
function renderSearch(geometry: GlyphGeometry) {
  const { box, stroke, color } = geometry;
  const shift = box * HANDLE_SHIFT;
  const handle: ViewStyle = {
    ...bar(box * HANDLE_LENGTH, stroke, color, '45deg'),
    transform: [{ translateX: shift }, { translateY: shift }, { rotate: '45deg' }],
  };

  return (
    <>
      <View style={lensStyle(geometry)} />
      <View style={handle} />
    </>
  );
}

/** Three evenly spaced dots in a row (horizontal ellipsis). */
function renderMore({ box, color }: GlyphGeometry) {
  const dot = dotStyle(box * MORE_DOT, color);

  return (
    <View style={[styles.row, { gap: box * MORE_GAP }]}>
      <View style={dot} />
      <View style={dot} />
      <View style={dot} />
    </View>
  );
}

/** How each icon is drawn inside its box. */
export const GLYPH_RENDERERS: Record<SystemIconName, (geometry: GlyphGeometry) => ReactNode> = {
  close: renderCross,
  check: renderCheck,
  alert: (geometry) => renderStemAndDot('stemFirst', geometry),
  info: (geometry) => renderStemAndDot('dotFirst', geometry),
  chevronDown: (geometry) => renderChevron('chevronDown', geometry),
  chevronUp: (geometry) => renderChevron('chevronUp', geometry),
  chevronLeft: (geometry) => renderChevron('chevronLeft', geometry),
  chevronRight: (geometry) => renderChevron('chevronRight', geometry),
  plus: (geometry) => renderPlusMinus(true, geometry),
  minus: (geometry) => renderPlusMinus(false, geometry),
  search: renderSearch,
  more: renderMore,
};

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
