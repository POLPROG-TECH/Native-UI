import type { DimensionValue } from 'react-native';
import type { ComponentTokenContext } from './merge';

/*
 * Form controls and small indicators. Each entry holds every dimension the
 * component would otherwise hardcode; see `NativeUIConfig.components`.
 */

/** Minimum touch target shared by row-style controls (iOS HIG 44pt). */
const MIN_TOUCH_TARGET = 44;
/** Unchecked outline of Checkbox / Radio, slightly heavier than a hairline. */
const SELECTION_BORDER_WIDTH = 1.5;
/** Field borders (Input, TextArea, date inputs). */
const FIELD_BORDER_WIDTH = 1;
/** Bottom margin every form field leaves below itself. */
export interface FieldSpacingTokens {
  containerMarginBottom: number;
}

export interface BadgeTokens {
  dotSize: number;
  minWidth: number;
  height: number;
  paddingHorizontal: number;
  fontSize: number;
  lineHeight: number;
  /** Highest count shown verbatim; larger counts render as "N+". */
  maxCount: number;
}

export interface CheckboxSizeTokens {
  /** Edge length of the square box. */
  size: number;
  radius: number;
  /** Size of the check mark drawn inside a checked box. */
  iconSize: number;
}

export interface CheckboxTokens {
  sm: CheckboxSizeTokens;
  md: CheckboxSizeTokens;
  /** Outline of the unchecked box (a checked box has no border). */
  borderWidth: number;
  /** Gap between the box and its label. */
  gap: number;
  minHeight: number;
}

export interface RadioTokens {
  /** Outer circle diameter. */
  size: number;
  /** Inner dot diameter of the selected state. */
  dotSize: number;
  borderWidth: number;
  gap: number;
  minHeight: number;
}

export interface SwitchTokens {
  minHeight: number;
  gap: number;
  subtitleMarginTop: number;
}

export interface ChipSizeTokens {
  paddingVertical: number;
  paddingHorizontal: number;
  minHeight: number;
}

export interface ChipTokens {
  /**
   * `sm` opts into a denser filter-rail look: its 28pt height is below the 44pt
   * target, accepted because the row reads as a segmented rocker, not a button.
   */
  sm: ChipSizeTokens;
  md: ChipSizeTokens;
  outlineBorderWidth: number;
  /** Gap between the leading icon and the label. */
  gap: number;
  /** Font size of a text / emoji `icon`. */
  iconFontSize: number;
  /** Gap between chips inside `ChipGroup`. */
  groupGap: number;
}

export interface TextFieldTokens extends FieldSpacingTokens {
  borderWidth: number;
  radius: number;
  paddingHorizontal: number;
  paddingVertical: number;
}

export interface TextAreaTokens extends TextFieldTokens {
  /** Visible lines used when `lines` is not passed. */
  defaultLines: number;
  /** Line height used for the minimum height when the body style has none. */
  fallbackLineHeight: number;
}

export interface FieldLabelTokens {
  marginBottom: number;
  letterSpacing: number;
}

export interface FieldErrorTokens {
  marginTop: number;
}

export interface SearchBarTokens {
  /**
   * Delay before `onChangeText` fires. An input debounce, deliberately not tied
   * to the motion scale so retuning animations never changes search timing.
   */
  debounceMs: number;
  radius: number;
  paddingHorizontal: number;
  paddingVertical: number;
  /** Right padding that keeps typed text clear of the clear button. */
  clearButtonPadding: number;
  /** Left padding when `renderLeft` occupies the leading slot. */
  leftSlotPadding: number;
  /** Right padding when `renderRight` occupies the trailing slot. */
  rightSlotPadding: number;
  /** Inset of the leading / trailing slots and of the clear button. */
  slotInset: number;
  /** Clear button offset from the right edge when `renderRight` is present. */
  clearOffsetWithRightSlot: number;
  clearButtonSize: number;
  clearIconSize: number;
  clearHitSlop: number;
}

export interface DatePickerTokens extends FieldSpacingTokens {
  radius: number;
  borderWidth: number;
  triggerPaddingHorizontal: number;
  triggerPaddingVertical: number;
  triggerGap: number;
  triggerMinHeight: number;
  triggerHitSlop: number;
  /** Row hosting the inline iOS compact picker. */
  compactPaddingLeft: number;
  compactPaddingRight: number;
  compactPaddingVertical: number;
  compactGap: number;
  compactPickerHeight: number;
  clearPadding: number;
  clearIconSize: number;
  clearHitSlop: number;
}

export interface DateRangePickerTokens extends FieldSpacingTokens {
  separatorPaddingHorizontal: number;
  /** Pushes the separator below the inner pickers' labels to align with the inputs. */
  separatorOffsetTop: number;
}

export interface IconButtonTokens {
  /** Diameter per size. */
  sm: number;
  md: number;
  lg: number;
  /** Press scale; `1` disables the scale feedback. */
  pressScale: number;
  /** Window in which repeated presses are ignored (double-tap guard). */
  debounceMs: number;
}

export interface AvatarSizeTokens {
  size: number;
  /** Font size of the initials. */
  fontSize: number;
}

export interface AvatarTokens {
  sm: AvatarSizeTokens;
  md: AvatarSizeTokens;
  lg: AvatarSizeTokens;
  xl: AvatarSizeTokens;
}

export interface SpinnerTokens {
  labelMarginTop: number;
}

export interface ProgressBarTokens {
  /** Track height used when `height` is not passed. */
  height: number;
}

export interface SkeletonTokens {
  /** Corner radius used when `borderRadius` is not passed. */
  radius: number;
  /** Shimmer opacity range; the pulse runs from `opacityFrom` to `opacityTo`. */
  opacityFrom: number;
  opacityTo: number;
  /** Static opacity shown while `reduceAnimations` is on. */
  reducedOpacity: number;
  /** Duration of one shimmer half cycle. */
  pulseDurationMs: number;
}

export interface SkeletonCardTokens {
  padding: number;
  radius: number;
  gap: number;
  titleHeight: number;
  titleWidth: DimensionValue;
  lineHeight: number;
  /** Width of the last body line; the other lines span the full width. */
  lastLineWidth: DimensionValue;
  avatarSize: number;
  avatarTextGap: number;
  avatarTitleHeight: number;
  avatarTitleWidth: DimensionValue;
  avatarSubtitleHeight: number;
  avatarSubtitleWidth: DimensionValue;
}

export interface ControlTokens {
  badge: BadgeTokens;
  checkbox: CheckboxTokens;
  radio: RadioTokens;
  switch: SwitchTokens;
  chip: ChipTokens;
  input: TextFieldTokens;
  textArea: TextAreaTokens;
  fieldLabel: FieldLabelTokens;
  fieldError: FieldErrorTokens;
  searchBar: SearchBarTokens;
  datePicker: DatePickerTokens;
  dateRangePicker: DateRangePickerTokens;
  iconButton: IconButtonTokens;
  avatar: AvatarTokens;
  spinner: SpinnerTokens;
  progressBar: ProgressBarTokens;
  skeleton: SkeletonTokens;
  skeletonCard: SkeletonCardTokens;
}

export function buildControlTokens({
  spacing,
  borderRadius,
}: ComponentTokenContext): ControlTokens {
  const textField: TextFieldTokens = {
    containerMarginBottom: spacing.md,
    borderWidth: FIELD_BORDER_WIDTH,
    radius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  };

  return {
    badge: {
      dotSize: spacing.sm,
      minWidth: 18,
      height: 18,
      paddingHorizontal: spacing.xs,
      fontSize: 11,
      lineHeight: 14,
      maxCount: 99,
    },
    checkbox: {
      sm: { size: 18, radius: 4, iconSize: 13 },
      md: { size: spacing.mdPlus, radius: 5, iconSize: 14 },
      borderWidth: SELECTION_BORDER_WIDTH,
      gap: spacing.smPlus,
      minHeight: MIN_TOUCH_TARGET,
    },
    radio: {
      size: spacing.mdPlus,
      dotSize: spacing.sm,
      borderWidth: SELECTION_BORDER_WIDTH,
      gap: spacing.smPlus,
      minHeight: MIN_TOUCH_TARGET,
    },
    switch: {
      minHeight: MIN_TOUCH_TARGET,
      gap: spacing.smPlus,
      subtitleMarginTop: spacing['2xs'],
    },
    chip: {
      sm: { paddingVertical: spacing['2xs'], paddingHorizontal: spacing.smPlus, minHeight: 28 },
      md: { paddingVertical: 10, paddingHorizontal: spacing.md, minHeight: MIN_TOUCH_TARGET },
      outlineBorderWidth: 1,
      gap: 6,
      iconFontSize: 14,
      groupGap: spacing.sm,
    },
    input: textField,
    textArea: {
      ...textField,
      paddingVertical: spacing.smPlus,
      defaultLines: 4,
      fallbackLineHeight: 22,
    },
    fieldLabel: { marginBottom: 6, letterSpacing: 0.6 },
    fieldError: { marginTop: spacing.xs },
    searchBar: {
      debounceMs: 300,
      radius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
      clearButtonPadding: 36,
      leftSlotPadding: 36,
      rightSlotPadding: spacing['3xl'],
      slotInset: spacing.smPlus,
      clearOffsetWithRightSlot: 36,
      clearButtonSize: spacing.mdPlus,
      clearIconSize: spacing.smPlus,
      clearHitSlop: spacing.sm,
    },
    datePicker: {
      containerMarginBottom: spacing.md,
      radius: borderRadius.md,
      borderWidth: FIELD_BORDER_WIDTH,
      triggerPaddingHorizontal: 14,
      triggerPaddingVertical: spacing.smPlus,
      triggerGap: 10,
      triggerMinHeight: MIN_TOUCH_TARGET,
      triggerHitSlop: spacing.xs,
      compactPaddingLeft: 14,
      compactPaddingRight: spacing.sm,
      compactPaddingVertical: spacing.xs,
      compactGap: spacing.sm,
      compactPickerHeight: spacing['2xl'],
      clearPadding: spacing.xs,
      clearIconSize: spacing.smPlus,
      clearHitSlop: spacing.sm,
    },
    dateRangePicker: {
      containerMarginBottom: spacing.md,
      separatorPaddingHorizontal: spacing.sm,
      separatorOffsetTop: 22,
    },
    iconButton: {
      sm: spacing.xl,
      md: spacing['2xl'],
      lg: 48,
      pressScale: 0.95,
      debounceMs: 300,
    },
    avatar: {
      sm: { size: 28, fontSize: 11 },
      md: { size: 36, fontSize: 14 },
      lg: { size: 48, fontSize: 18 },
      xl: { size: 64, fontSize: 24 },
    },
    spinner: { labelMarginTop: spacing.smPlus },
    progressBar: { height: spacing.sm },
    skeleton: {
      radius: borderRadius.md,
      opacityFrom: 0.3,
      opacityTo: 0.7,
      reducedOpacity: 0.5,
      pulseDurationMs: 800,
    },
    skeletonCard: {
      padding: spacing.md,
      radius: borderRadius.lg,
      gap: spacing.sm,
      titleHeight: spacing.md,
      titleWidth: '55%',
      lineHeight: spacing.smPlus,
      lastLineWidth: '75%',
      avatarSize: spacing['2xl'],
      avatarTextGap: spacing.xs,
      avatarTitleHeight: 14,
      avatarTitleWidth: '60%',
      avatarSubtitleHeight: spacing.smPlus,
      avatarSubtitleWidth: '40%',
    },
  };
}
