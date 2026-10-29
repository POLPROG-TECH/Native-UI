import type { IconSlot } from '../../primitives/iconSlot';
import { devWarn } from '../../utils/devWarn';

export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type ToastPosition = 'top' | 'bottom';

export interface ToastConfig {
  /** The text displayed inside the toast. */
  message: string;
  /** Label for an optional action button shown on the right side. */
  actionLabel?: string;
  /** Callback fired when the action button is pressed. */
  onAction?: () => void;
  /**
   * Auto-dismiss duration in milliseconds. Pass `0` (or any non-positive
   * value) to keep the toast sticky until `hide()` is called, the action
   * button is pressed, or another toast replaces it.
   * @default `Toast.defaultDuration`, else theme.components.toast.durationMs (3000)
   */
  duration?: number;
  /**
   * Accent color for the left border and action label. Overrides the color
   * derived from `variant`.
   */
  accent?: string;
  /**
   * Semantic variant. Applies a themed accent color (and, if `icon` is not
   * provided, a default icon).
   * @default 'default'
   */
  variant?: ToastVariant;
  /**
   * Optional leading icon rendered before the message. Takes precedence over
   * the variant glyph; `null` hides it. Prefer a render function, which
   * receives the toast's accent color and `theme.components.toast.iconSize`:
   * `icon={({ color, size }) => <SystemIcon name="info" color={color} size={size} />}`.
   * Nodes (e.g. a brand logo) render as-is; emoji strings are kept for
   * backwards compatibility.
   */
  icon?: IconSlot;
  /**
   * Placement of the toast on screen.
   * @default 'bottom'
   */
  position?: ToastPosition;
  /**
   * Announce the message to VoiceOver when the toast appears (iOS; Android
   * uses a live region). Set `false` for toasts that only echo something the
   * user just heard.
   * @default true
   */
  announce?: boolean;
}

export interface ActiveToast extends ToastConfig {
  readonly id: number;
}

type Listener = () => void;

interface ToastStore {
  show: (config: ToastConfig) => void;
  hide: () => void;
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => ActiveToast | null;
  /** @internal Increments the mounted-root counter and returns a cleanup. */
  registerRoot: () => () => void;
  /** @internal Used only by tests / Fast Refresh. */
  _resetForTest: () => void;
}

/**
 * Holds the single active toast and notifies subscribers on change. Methods
 * are arrow properties so they stay bound when `useSyncExternalStore`
 * receives `subscribe` and `getSnapshot` detached from the store.
 */
class ToastQueue implements ToastStore {
  private active: ActiveToast | null = null;
  private nextId = 0;
  private rootCount = 0;
  private readonly listeners = new Set<Listener>();

  show = (config: ToastConfig): void => {
    this.nextId += 1;
    this.active = { ...config, id: this.nextId };
    this.notify();
  };

  hide = (): void => {
    if (this.active === null) {
      return;
    }

    this.active = null;
    this.notify();
  };

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): ActiveToast | null => this.active;

  registerRoot = (): (() => void) => {
    this.rootCount += 1;

    if (this.rootCount > 1) {
      devWarn('Multiple <Toast /> roots detected. Mount exactly one at the app root.');
    }

    return this.unregisterRoot;
  };

  _resetForTest = (): void => {
    this.active = null;
    this.nextId = 0;
    this.rootCount = 0;
    this.listeners.clear();
  };

  /**
   * Only the *last* root unmounting clears the active toast, so StrictMode
   * double-mounts and HMR remounts do not kill an in-flight toast.
   */
  private unregisterRoot = (): void => {
    this.rootCount = Math.max(0, this.rootCount - 1);

    if (this.rootCount === 0) {
      this.active = null;
      this.listeners.clear();

      return;
    }

    this.notify();
  };

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

/** The app-wide toast queue shared by `<Toast />`, `useToast` and `toast`. */
export const toastStore: ToastStore = new ToastQueue();
