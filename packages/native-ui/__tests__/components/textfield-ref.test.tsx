import React from 'react';
import type { TextInput } from 'react-native';
import { Input } from '../../src/components/Input';
import { TextArea } from '../../src/components/TextArea';
import { renderWithTheme } from '../test-utils';

type TextInputRef = React.ComponentRef<typeof TextInput>;

describe('text field ref forwarding', () => {
  describe('GIVEN a ref passed to an Input', () => {
    describe('WHEN the Input is rendered inside a theme provider', () => {
      it('THEN the ref resolves to the underlying focusable TextInput', () => {
        const ref = React.createRef<TextInputRef>();

        renderWithTheme(<Input ref={ref} label="Email" />);

        expect(ref.current).not.toBeNull();
        expect(typeof ref.current?.focus).toBe('function');
      });
    });
  });

  describe('GIVEN a ref passed to a TextArea', () => {
    describe('WHEN the TextArea is rendered inside a theme provider', () => {
      it('THEN the ref resolves to the underlying focusable TextInput', () => {
        const ref = React.createRef<TextInputRef>();

        renderWithTheme(<TextArea ref={ref} label="Bio" />);

        expect(ref.current).not.toBeNull();
        expect(typeof ref.current?.focus).toBe('function');
      });
    });
  });

  describe('GIVEN an Input with a label and an error message', () => {
    describe('WHEN the Input is rendered inside a theme provider', () => {
      it('THEN the accessible label combines the label and error text', () => {
        const { getByLabelText } = renderWithTheme(<Input label="Email" error="Required" />);

        expect(getByLabelText('Email, Required')).toBeInTheDocument();
      });
    });
  });
});
