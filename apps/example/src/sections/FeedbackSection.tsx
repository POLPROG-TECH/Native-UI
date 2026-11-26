import { Banner, Button, Section, Tooltip, VStack, toast } from '@polprog/native-ui';
import { useState } from 'react';

export function FeedbackSection() {
  const [offline, setOffline] = useState(true);

  return (
    <Section title="Feedback">
      <VStack gap="md">
        {offline ? (
          <Banner
            variant="warning"
            title="Offline"
            message="Changes will sync when you reconnect."
            action={{ label: 'Retry', onPress: () => toast.show({ message: 'Retrying' }) }}
            onDismiss={() => setOffline(false)}
            testID="offline-banner"
          />
        ) : (
          <Button
            title="Show the banner"
            variant="secondary"
            onPress={() => setOffline(true)}
            testID="show-banner"
          />
        )}
        <Tooltip content="Shows a toast" testID="toast-tooltip">
          <Button
            title="Show a toast"
            onPress={() => toast.show({ message: 'Saved', variant: 'success' })}
            testID="show-toast"
          />
        </Tooltip>
      </VStack>
    </Section>
  );
}
