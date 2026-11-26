import { ScreenContainer, Section, VStack } from '@polprog/native-ui';
import { ScrollView } from 'react-native';
import { ActionsSection } from './sections/ActionsSection';
import { FeedbackSection } from './sections/FeedbackSection';
import { InputsSection } from './sections/InputsSection';
import { NavigationSection } from './sections/NavigationSection';
import { ThemeProbe } from './sections/ThemeProbe';

export function GalleryScreen() {
  return (
    <ScreenContainer edges={['top', 'bottom']} padded={false} testID="gallery">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        testID="gallery-scroll"
      >
        <VStack gap="lg">
          <Section title="Native UI">
            <ThemeProbe />
          </Section>
          <FeedbackSection />
          <NavigationSection />
          <InputsSection />
          <ActionsSection />
        </VStack>
      </ScrollView>
    </ScreenContainer>
  );
}
