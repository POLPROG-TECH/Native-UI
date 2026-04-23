import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../src/components/Badge';
import { Box } from '../../src/primitives/Box';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Checkbox } from '../../src/components/Checkbox';
import { Chip } from '../../src/components/Chip';
import { Divider } from '../../src/primitives/Divider';
import { EmptyState } from '../../src/components/EmptyState';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Heading } from '../../src/primitives/Heading';
import { Input } from '../../src/components/Input';
import { ListItem } from '../../src/components/ListItem';
import { PressableScale } from '../../src/primitives/PressableScale';
import { ProgressBar } from '../../src/components/ProgressBar';
import { Radio } from '../../src/components/Radio';
import { SearchBar } from '../../src/components/SearchBar';
import { Select } from '../../src/components/Select';
import { Skeleton } from '../../src/components/Skeleton';
import { Spinner } from '../../src/components/Spinner';
import { Switch } from '../../src/components/Switch';
import { Text } from '../../src/primitives/Text';
import { TextArea } from '../../src/components/TextArea';
import { useTheme } from '../../src/theme/ThemeProvider';



const meta: Meta = {
  title: 'Patterns/Web Compatibility',
  parameters: {
    docs: {
      description: {
        component: [
          'Verifies every native-ui primitive and major component renders correctly on **react-native-web**,',
          'which is the rendering engine Storybook uses.',
          '',
          'If you can see all sections below without errors, the library is fully web-compatible.',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const SectionLabel = ({ children }: { children: string }) => (
  <Text
    variant="caption"
    style={{
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
      opacity: 0.5,
      marginTop: 24,
      marginBottom: 8,
    }}
  >
    {children}
  </Text>
);

export const AllPrimitives: Story = {
  name: 'Primitives',
  render: () => {
    const theme = useTheme();

    return (
    <VStack spacing="md">
      <Heading level={2}>Primitives</Heading>

      <SectionLabel>Box</SectionLabel>
      <Box
        padding="md"
        borderRadius="md"
        style={{ backgroundColor: theme.colors.surfaceSecondary }}
      >
        <Text>Box with padding and border radius</Text>
      </Box>

      <SectionLabel>VStack & HStack</SectionLabel>
      <VStack spacing="sm">
        <HStack spacing="sm">
          <Box padding="sm" style={{ backgroundColor: theme.colors.primaryLight, flex: 1 }}>
            <Text>HStack 1</Text>
          </Box>
          <Box padding="sm" style={{ backgroundColor: theme.colors.primaryLight, flex: 1 }}>
            <Text>HStack 2</Text>
          </Box>
          <Box padding="sm" style={{ backgroundColor: theme.colors.primaryLight, flex: 1 }}>
            <Text>HStack 3</Text>
          </Box>
        </HStack>
      </VStack>

      <SectionLabel>Text</SectionLabel>
      <Text variant="body">Body text</Text>
      <Text variant="caption">Caption text</Text>

      <SectionLabel>Heading</SectionLabel>
      <Heading level={1}>Heading 1</Heading>
      <Heading level={2}>Heading 2</Heading>
      <Heading level={3}>Heading 3</Heading>

      <SectionLabel>Divider</SectionLabel>
      <Divider />

      <SectionLabel>PressableScale</SectionLabel>
      <PressableScale onPress={() => {}}>
        <Box padding="md" borderRadius="md" style={{ backgroundColor: theme.colors.primaryLight }}>
          <Text>Tap me (scales on press)</Text>
        </Box>
      </PressableScale>
    </VStack>
    );
  },
};

export const FormComponents: Story = {
  name: 'Form Components',
  render: () => (
    <VStack spacing="md">
      <Heading level={2}>Form Components</Heading>

      <SectionLabel>Input</SectionLabel>
      <Input label="Email" placeholder="you@example.com" />

      <SectionLabel>TextArea</SectionLabel>
      <TextArea label="Description" placeholder="Enter a description..." />

      <SectionLabel>Select</SectionLabel>
      <Select
        label="Category"
        options={[
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
        ]}
        selectedValue="a"
        onValueChange={() => {}}
      />

      <SectionLabel>Checkbox</SectionLabel>
      <Checkbox label="Accept terms" checked={false} onChange={() => {}} />

      <SectionLabel>Switch</SectionLabel>
      <Switch label="Notifications" value={true} onValueChange={() => {}} />

      <SectionLabel>Radio</SectionLabel>
      <Radio label="Option A" selected={true} onPress={() => {}} />
      <Radio label="Option B" selected={false} onPress={() => {}} />
    </VStack>
  ),
};

export const DisplayComponents: Story = {
  name: 'Display Components',
  render: () => (
    <VStack spacing="md">
      <Heading level={2}>Display Components</Heading>

      <SectionLabel>Button</SectionLabel>
      <HStack spacing="sm">
        <Button title="Primary" onPress={() => {}} />
        <Button title="Secondary" variant="secondary" onPress={() => {}} />
        <Button title="Ghost" variant="ghost" onPress={() => {}} />
      </HStack>

      <SectionLabel>Card</SectionLabel>
      <Card>
        <Text>Card content renders here</Text>
      </Card>

      <SectionLabel>Chip</SectionLabel>
      <HStack spacing="sm">
        <Chip label="React Native" />
        <Chip label="TypeScript" />
        <Chip label="Web" />
      </HStack>

      <SectionLabel>Badge</SectionLabel>
      <HStack spacing="sm">
        <Badge label="New" />
        <Badge label="3" variant="info" />
        <Badge label="Error" variant="error" />
      </HStack>

      <SectionLabel>ProgressBar</SectionLabel>
      <ProgressBar progress={0.65} />

      <SectionLabel>Skeleton</SectionLabel>
      <Skeleton width={200} height={20} />

      <SectionLabel>Spinner</SectionLabel>
      <Spinner />

      <SectionLabel>SearchBar</SectionLabel>
      <SearchBar placeholder="Search..." value="" onChangeText={() => {}} />

      <SectionLabel>EmptyState</SectionLabel>
      <EmptyState title="Nothing here" message="Add items to see them listed." />

      <SectionLabel>ListItem</SectionLabel>
      <ListItem title="List Item" subtitle="With subtitle" onPress={() => {}} />
    </VStack>
  ),
};
