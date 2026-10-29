import {
  THEME_PRESETS,
  type NativeUIConfig,
  type ThemePreset,
  type TypographyDensity,
} from '@polprog/native-ui';

export type ShowcaseColorMode = 'light' | 'dark';

/** One themed frame the hero device shows; maps onto `NativeUIConfig`. */
export interface ShowcaseScene {
  preset: ThemePreset;
  colorMode: ShowcaseColorMode;
  highContrast?: boolean;
}

/** Timing knobs for the hero device, in one place for tuning. */
export interface ShowcaseMotion {
  /** Time each scene stays on screen while autoplay runs. */
  sceneDurationMs: number;
}

/** Storybook sidebar group a component's docs page lives under. */
export type DocsGroup = 'Components' | 'Primitives';

/** Name, headline props and docs group the inspector and anatomy show for one element. */
export interface InspectableComponent {
  name: string;
  props: string;
  group: DocsGroup;
}

export const SHOWCASE_SCENES = [
  { preset: 'default', colorMode: 'light' },
  { preset: 'midnight', colorMode: 'dark' },
  { preset: 'ocean', colorMode: 'light' },
  { preset: 'forest', colorMode: 'dark' },
  { preset: 'sunset', colorMode: 'light' },
  { preset: 'rose', colorMode: 'dark' },
] as const satisfies readonly ShowcaseScene[];

/** Accent presets offered by the in-app Settings screen. */
export const SHOWCASE_ACCENTS: readonly ThemePreset[] = SHOWCASE_SCENES.map(
  (scene) => scene.preset,
);

/**
 * Width (pt) the demo app lays out at, like a real phone. The screen is then
 * scaled down to the drawn device, so type and spacing keep real-device
 * proportions instead of rendering phone-sized text on a 270px screen.
 * 360pt is the narrowest common phone width, which keeps text legible.
 */
export const SHOWCASE_LOGICAL_WIDTH = 360;

/** CostBoard ships the compact ramp (label 13, labelSmall 12, caption 11); the demo matches it. */
export const SHOWCASE_TYPOGRAPHY: TypographyDensity = 'compact';

export const SHOWCASE_MOTION: ShowcaseMotion = {
  sceneDurationMs: 4200,
};

/** Inspector labels, keyed by the slot each component fills in the demo app. */
export const SHOWCASE_COMPONENTS = {
  header: { name: 'HeaderBar', props: 'title right={<Avatar />}', group: 'Components' },
  greeting: { name: 'Text', props: 'variant="caption" color="textSecondary"', group: 'Primitives' },
  title: { name: 'Heading', props: 'level={3}', group: 'Primitives' },
  avatar: { name: 'Avatar', props: 'initials size="sm"', group: 'Components' },
  card: { name: 'Card', props: 'size="compact"', group: 'Components' },
  budget: { name: 'StatTile', props: 'align="left" size="lg" mono={false}', group: 'Components' },
  stat: { name: 'StatTile', props: 'align="left" size="sm"', group: 'Components' },
  badge: { name: 'Badge', props: 'label variant="primary"', group: 'Components' },
  progress: { name: 'ProgressBar', props: 'value={spent / total}', group: 'Components' },
  divider: { name: 'Divider', props: '', group: 'Primitives' },
  split: {
    name: 'Box',
    props: 'flex={share} style={{ backgroundColor: colors.chart[i] }}',
    group: 'Primitives',
  },
  legend: { name: 'Text', props: 'variant="labelSmall"', group: 'Primitives' },
  sectionTitle: { name: 'ListHeader', props: 'title size="sm"', group: 'Components' },
  expense: { name: 'ListItem', props: 'title subtitle value onPress', group: 'Components' },
  cta: { name: 'Button', props: 'loading glow', group: 'Components' },
  secondary: { name: 'Button', props: 'variant="secondary"', group: 'Components' },
  link: { name: 'Button', props: 'variant="ghost" size="sm"', group: 'Components' },
  search: { name: 'SearchBar', props: 'value onChangeText', group: 'Components' },
  filter: { name: 'Chip', props: 'selected onPress', group: 'Components' },
  empty: { name: 'EmptyState', props: 'title message size="sm"', group: 'Components' },
  section: { name: 'ListSection', props: 'title grouped', group: 'Components' },
  toggle: { name: 'ListSwitchItem', props: 'value onValueChange', group: 'Components' },
  tabs: { name: 'BottomTabBar', props: 'items activeKey onSelect', group: 'Components' },
} as const satisfies Record<string, InspectableComponent>;

export type ShowcaseSlot = keyof typeof SHOWCASE_COMPONENTS;

/** Accent swatch of a preset, read from the library so the dots never drift. */
export function presetAccent(preset: ThemePreset): string | undefined {
  return THEME_PRESETS.find((config) => config.id === preset)?.accent;
}

/** Storybook URL of a docs page, opened in the top frame from the docs iframe. */
export function docsHref(title: string): string {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return `/?path=/docs/${id}--docs`;
}

export function componentDocsHref(component: InspectableComponent): string {
  return docsHref(`${component.group}/${component.name}`);
}

/** Docs page for the provider at the root of the anatomy tree. */
export const PROVIDER_DOCS_TITLE = 'Getting Started';

export function sceneName(scene: ShowcaseScene): string {
  return `${scene.preset} · ${scene.colorMode}`;
}

export function sameScene(a: ShowcaseScene, b: ShowcaseScene): boolean {
  return (
    a.preset === b.preset &&
    a.colorMode === b.colorMode &&
    Boolean(a.highContrast) === Boolean(b.highContrast)
  );
}

/** The provider config a scene stands for. */
export function sceneConfig(scene: ShowcaseScene): NativeUIConfig {
  return {
    preset: scene.preset,
    colorMode: scene.colorMode,
    highContrast: scene.highContrast ?? false,
    typography: SHOWCASE_TYPOGRAPHY,
  };
}
