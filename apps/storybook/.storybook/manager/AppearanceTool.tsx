import { useGlobals, useStorybookApi, useStorybookState } from 'storybook/manager-api';
import { Button, PopoverProvider, ToggleButton } from 'storybook/internal/components';
import { PaintBrushIcon } from '@storybook/icons';
import { styled, type StorybookTheme } from 'storybook/theming';
import {
  GLOBALS,
  GLOBAL_GROUPS,
  type GlobalDefinition,
  type GlobalGroup,
  type GlobalKey,
} from '../globals/definitions';

/** Globals summarised on the toolbar button, in order. */
const SUMMARY_KEYS: readonly GlobalKey[] = ['theme', 'preset', 'device', 'locale'];

/*
 * The popover opens under the toolbar, so it may never be taller than the
 * window below it; the list scrolls inside instead of running off screen.
 */
const PANEL_MAX_HEIGHT = 'min(560px, calc(100vh - 96px))';

/**
 * Muted text from `theme.ts`. Storybook sets it at runtime but types it only
 * through the theme's `any` index signature, so it is checked here.
 */
function mutedText(theme: StorybookTheme): string {
  const value: unknown = theme.textMutedColor;

  return typeof value === 'string' ? value : theme.color.mediumdark;
}

const Panel = styled.div(({ theme }) => ({
  display: 'grid',
  alignContent: 'start',
  gap: 14,
  width: 340,
  maxHeight: PANEL_MAX_HEIGHT,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  padding: '0 14px 14px',
  color: theme.color.defaultText,
}));

const Section = styled.section({ display: 'grid', gap: 8 });

const SectionTitle = styled.h2(({ theme }) => ({
  margin: 0,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: mutedText(theme),
}));

const Field = styled.div({ display: 'grid', gap: 6 });

/* Stays visible while the settings scroll, so the scope note is never lost. */
const Scope = styled.p(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  margin: '0 -14px',
  padding: '14px 14px 10px',
  fontSize: 12,
  lineHeight: 1.45,
  color: mutedText(theme),
  background: theme.background.content,
  borderBottom: `1px solid ${theme.appBorderColor}`,
}));

const FieldLabel = styled.span({ fontSize: 12, fontWeight: 600 });

const Options = styled.div({ display: 'flex', flexWrap: 'wrap', gap: 4 });

function optionTitle(key: GlobalKey, value: unknown): string {
  const definition: GlobalDefinition<string> = GLOBALS[key];

  return definition.options.find((option) => option.value === value)?.title ?? String(value);
}

function GlobalField({ globalKey }: { globalKey: GlobalKey }) {
  const [globals, updateGlobals] = useGlobals();
  const definition: GlobalDefinition<string> = GLOBALS[globalKey];
  const current: unknown = globals[globalKey] ?? definition.defaultValue;

  return (
    <Field role="group" aria-label={definition.title}>
      <FieldLabel>{definition.title}</FieldLabel>
      <Options>
        {definition.options.map((option) => (
          <ToggleButton
            key={option.value}
            size="small"
            variant="ghost"
            pressed={current === option.value}
            onClick={() => updateGlobals({ [globalKey]: option.value })}
          >
            {option.title}
          </ToggleButton>
        ))}
      </Options>
    </Field>
  );
}

function keysOf(group: GlobalGroup): GlobalKey[] {
  return Object.entries(GLOBALS)
    .filter(([, definition]) => definition.group === group)
    .map(([key]) => key)
    .filter((key): key is GlobalKey => key in GLOBALS);
}

function AppearancePanel({ prosePage }: { prosePage: boolean }) {
  return (
    <Panel>
      <Scope>{prosePage ? SCOPE_NOTE.prose : SCOPE_NOTE.previews}</Scope>
      {GLOBAL_GROUPS.map((group) => (
        <Section key={group} aria-label={group}>
          <SectionTitle>{group}</SectionTitle>
          {keysOf(group).map((key) => (
            <GlobalField key={key} globalKey={key} />
          ))}
        </Section>
      ))}
    </Panel>
  );
}

/** Tag Storybook gives MDX pages that are not attached to any stories. */
const PROSE_PAGE_TAG = 'unattached-mdx';

/** Panel note: what the settings reach on the current page. */
const SCOPE_NOTE = {
  previews:
    'Mode switches the whole Storybook; the other settings apply to stories and component previews.',
  prose:
    'This guide has no live previews, so only Mode changes it. The other settings apply to stories and component pages.',
} as const;

/** True on MDX guides (Introduction, Theming...) where no story could pick up a global. */
function useIsProsePage(): boolean {
  const api = useStorybookApi();
  const { storyId } = useStorybookState();
  const entry = storyId ? api.getCurrentStoryData() : undefined;

  return Boolean(entry?.tags.includes(PROSE_PAGE_TAG));
}

/**
 * One "Appearance" menu instead of seven toolbar dropdowns: every preview
 * global, grouped (Theme, Device, Accessibility, Language), rendered from
 * the same definitions the preview reads. On guide pages without previews
 * it says that only Mode applies there, so other changes are not a mystery.
 */
export function AppearanceTool() {
  const [globals] = useGlobals();
  const prosePage = useIsProsePage();
  const summary = SUMMARY_KEYS.map((key) => optionTitle(key, globals[key])).join(' · ');

  return (
    <PopoverProvider
      ariaLabel="Appearance settings"
      placement="bottom-start"
      popover={<AppearancePanel prosePage={prosePage} />}
    >
      <Button variant="ghost" size="small" ariaLabel="Appearance settings">
        <PaintBrushIcon />
        {summary}
      </Button>
    </PopoverProvider>
  );
}
