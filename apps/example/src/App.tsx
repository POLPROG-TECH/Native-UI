import { NativeUIProvider, Toast, useTheme } from '@polprog/native-ui';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GalleryScreen } from './GalleryScreen';

function ThemedStatusBar() {
  const { isDark } = useTheme();

  return <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />;
}

export function App() {
  return (
    <SafeAreaProvider>
      <NativeUIProvider config={{ colorMode: 'system' }}>
        <ThemedStatusBar />
        <GalleryScreen />
        <Toast />
      </NativeUIProvider>
    </SafeAreaProvider>
  );
}
