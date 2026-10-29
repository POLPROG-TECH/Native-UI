import { Box, Chip, HStack, ListSection, ListSwitchItem, VStack } from '@polprog/native-ui';
import { StyleSheet } from 'react-native';
import { Inspectable } from '../ComponentInspector';
import { SHOWCASE_ACCENTS, presetAccent, type ShowcaseScene } from '../showcaseConfig';
import { useShowcaseCopy } from '../showcaseCopy';
import type { ShowcaseApp } from '../useShowcaseApp';

/** Theme controls of the demo app; they re-theme the device they live in. */
export interface ShowcaseThemeControls {
  scene: ShowcaseScene;
  customize: (patch: Partial<ShowcaseScene>) => void;
}

const SWATCH_SIZE = 12;

function AccentPicker({ theme }: { theme: ShowcaseThemeControls }) {
  return (
    <HStack wrap gap="xs" px="sm" py="sm">
      {SHOWCASE_ACCENTS.map((preset) => (
        <Inspectable key={preset} slot="filter">
          <Chip
            label={preset}
            size="sm"
            selected={theme.scene.preset === preset}
            onPress={() => theme.customize({ preset })}
            renderIcon={() => (
              <Box style={[styles.swatch, { backgroundColor: presetAccent(preset) }]} />
            )}
          />
        </Inspectable>
      ))}
    </HStack>
  );
}

/**
 * Real settings: each switch maps onto a NativeUIProvider prop, so flipping
 * it re-themes the whole device with the same reveal the autoplay uses.
 */
export function SettingsScreen({ app, theme }: { app: ShowcaseApp; theme: ShowcaseThemeControls }) {
  const copy = useShowcaseCopy().settings;

  return (
    <VStack gap="smPlus">
      <Inspectable slot="section">
        <ListSection title={copy.appearance} grouped>
          <Inspectable slot="toggle">
            <ListSwitchItem
              label={copy.darkMode}
              subtitle={copy.darkModeSubtitle}
              value={theme.scene.colorMode === 'dark'}
              onValueChange={(dark) => theme.customize({ colorMode: dark ? 'dark' : 'light' })}
              omitSpacing
            />
          </Inspectable>
          <Inspectable slot="toggle">
            <ListSwitchItem
              label={copy.highContrast}
              subtitle={copy.highContrastSubtitle}
              value={Boolean(theme.scene.highContrast)}
              onValueChange={(highContrast) => theme.customize({ highContrast })}
              omitSpacing
              hideDivider
            />
          </Inspectable>
        </ListSection>
      </Inspectable>
      <Inspectable slot="section">
        <ListSection title={copy.accent} grouped>
          <AccentPicker theme={theme} />
        </ListSection>
      </Inspectable>
      <Inspectable slot="section">
        <ListSection title={copy.notifications} grouped>
          <Inspectable slot="toggle">
            <ListSwitchItem
              label={copy.alerts}
              subtitle={copy.alertsSubtitle}
              value={app.alerts}
              onValueChange={app.setAlerts}
              omitSpacing
              hideDivider
            />
          </Inspectable>
        </ListSection>
      </Inspectable>
    </VStack>
  );
}

const styles = StyleSheet.create({
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: SWATCH_SIZE / 2,
  },
});
