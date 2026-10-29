import type React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';

export interface FieldFrameProps {
  label?: string;
  required?: boolean;
  error?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  children: React.ReactNode;
  /** Rendered last, after the error: a modal or sheet that takes no layout space. */
  overlay?: React.ReactNode;
}

/** Label above, control in the middle, error below: the layout every form field shares. */
export function FieldFrame(props: FieldFrameProps) {
  const { label, required, error, style, testID, children } = props;

  return (
    <View testID={testID} style={style}>
      {label && <FieldLabel label={label} required={required} />}
      {children}
      {error && <FieldError error={error} />}
      {props.overlay}
    </View>
  );
}
