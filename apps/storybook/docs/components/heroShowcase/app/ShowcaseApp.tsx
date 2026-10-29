import {
  Avatar,
  Box,
  BottomTabBar,
  HeaderBar,
  NativeUIProvider,
  spacing,
  useColors,
  type BottomTabBarItem,
} from '@polprog/native-ui';
import { useMemo, type ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Inspectable } from '../ComponentInspector';
import { sceneConfig } from '../showcaseConfig';
import { useShowcaseCopy, type ShowcaseCopy } from '../showcaseCopy';
import { SHOWCASE_TABS, type ShowcaseTab } from '../showcaseData';
import type { ShowcaseApp as ShowcaseAppState } from '../useShowcaseApp';
import { ExpensesScreen } from './ExpensesScreen';
import { OverviewScreen } from './OverviewScreen';
import { SettingsScreen, type ShowcaseThemeControls } from './SettingsScreen';
import { StatusBar } from './StatusBar';
import { TabGlyph } from './TabGlyph';

/** Room left under the tab bar for the home indicator. */
const HOME_INDICATOR_SPACE = 18;

function tabItems(labels: ShowcaseCopy['tabs']): BottomTabBarItem[] {
  return SHOWCASE_TABS.map((tab) => ({
    key: tab,
    label: labels[tab],
    icon: ({ color, size }) => <TabGlyph tab={tab} color={color} size={size} />,
  }));
}

function isTab(key: string): key is ShowcaseTab {
  return SHOWCASE_TABS.some((tab) => tab === key);
}

function ActiveScreen({ app, theme }: { app: ShowcaseAppState; theme: ShowcaseThemeControls }) {
  if (app.tab === 'expenses') {
    return <ExpensesScreen app={app} />;
  }

  if (app.tab === 'settings') {
    return <SettingsScreen app={app} theme={theme} />;
  }

  return <OverviewScreen app={app} />;
}

function HomeIndicator() {
  const colors = useColors();

  return <Box style={[styles.homeIndicator, { backgroundColor: colors.textPrimary }]} />;
}

function Surface({ children }: { children: ReactNode }) {
  return (
    <Box bg="background" flex={1}>
      {children}
    </Box>
  );
}

interface ShowcaseAppProps {
  app: ShowcaseAppState;
  theme: ShowcaseThemeControls;
}

/**
 * A three-tab app built only from @polprog/native-ui. The provider config
 * comes from the scene, so changing `preset`, `colorMode` or `highContrast`
 * (from autoplay or the in-app Settings) is the whole re-theme.
 */
export function ShowcaseApp({ app, theme }: ShowcaseAppProps) {
  const { tabs, initials } = useShowcaseCopy();
  const items = useMemo(() => tabItems(tabs), [tabs]);
  const onSelectTab = (key: string) => {
    if (isTab(key)) {
      app.selectTab(key);
    }
  };

  return (
    <NativeUIProvider config={sceneConfig(theme.scene)}>
      <Surface>
        <StatusBar />
        {/* Overview opens with its own greeting, like CostBoard's dashboard. */}
        {app.tab === 'overview' ? null : (
          <Inspectable slot="header">
            <HeaderBar
              title={tabs[app.tab]}
              right={
                <Inspectable slot="avatar">
                  <Avatar initials={initials} size="sm" />
                </Inspectable>
              }
            />
          </Inspectable>
        )}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <div key={app.tab} className="nui-showcase-tabpane">
            <ActiveScreen app={app} theme={theme} />
          </div>
        </ScrollView>
        <Inspectable slot="tabs">
          <BottomTabBar
            items={items}
            activeKey={app.tab}
            onSelect={onSelectTab}
            safeBottomInset={HOME_INDICATOR_SPACE}
          />
        </Inspectable>
        <HomeIndicator />
      </Surface>
    </NativeUIProvider>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
  },
  /* iPhone home indicator proportions (134 x 5pt). */
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 134,
    height: 5,
    borderRadius: 3,
  },
});
