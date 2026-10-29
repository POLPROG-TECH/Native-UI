import type { HapticsInterface } from '../../utils/haptics';

/**
 * Visual style of a Button. `destructive` is an alias of `danger`, kept for
 * backwards compatibility; prefer `danger`.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
/** Haptic played on press, or `false` for none. */
export type ButtonHaptic = keyof HapticsInterface | false;
