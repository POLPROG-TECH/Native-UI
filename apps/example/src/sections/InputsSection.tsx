import { PinInput, Section, Slider, Stepper, Text, VStack } from '@polprog/native-ui';
import { useState } from 'react';

const CODE_LENGTH = 4;
const VOLUME_STEP = 10;
const MAX_VOLUME = 100;
const MAX_GUESTS = 8;

const percent = (value: number) => `${value}%`;

export function InputsSection() {
  const [volume, setVolume] = useState(40);
  const [guests, setGuests] = useState(2);
  const [code, setCode] = useState('');

  return (
    <Section title="Inputs">
      <VStack gap="md">
        <Slider
          accessibilityLabel="Volume"
          value={volume}
          onValueChange={setVolume}
          maximumValue={MAX_VOLUME}
          step={VOLUME_STEP}
          formatValue={percent}
          testID="volume"
        />
        <Text testID="volume-value">Volume: {percent(volume)}</Text>
        <Stepper
          accessibilityLabel="Guests"
          value={guests}
          onChange={setGuests}
          min={1}
          max={MAX_GUESTS}
          testID="guests"
        />
        <PinInput
          accessibilityLabel="Verification code"
          value={code}
          onChangeText={setCode}
          length={CODE_LENGTH}
          testID="code"
        />
        <Text testID="code-status">
          {code.length === CODE_LENGTH ? 'Code complete' : 'Enter the code'}
        </Text>
      </VStack>
    </Section>
  );
}
