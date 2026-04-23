import React from 'react';
import { Platform, Alert } from 'react-native';
import { act, fireEvent, screen } from '@testing-library/react';

import { InputPrompt } from '../../src/components/InputPrompt';
import { renderWithTheme } from '../test-utils';

function setPlatform(os: 'ios' | 'android') {
  (Platform as unknown as { OS: string }).OS = os;
}

describe('InputPrompt', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    setPlatform(originalOS as 'ios' | 'android');
    jest.restoreAllMocks();
  });

  it('should be exported as a function component', () => {
    // GIVEN the InputPrompt export

    // WHEN its runtime type is inspected
    const actualType = typeof InputPrompt;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render nothing visible when `visible` is false on Android', () => {
    // GIVEN the Android platform and a hidden prompt
    setPlatform('android');

    // WHEN the component is rendered
    renderWithTheme(
      <InputPrompt visible={false} title="Rename" onSubmit={() => {}} onCancel={() => {}} />,
    );

    // THEN the title is not present in the DOM
    expect(screen.queryByText('Rename')).not.toBeInTheDocument();
  });

  it('should render the title, message, and submit/cancel buttons on Android when visible', () => {
    // GIVEN a visible prompt on Android with a title + message
    setPlatform('android');

    // WHEN the component is rendered
    renderWithTheme(
      <InputPrompt
        visible
        title="Rename"
        message="Enter a new value."
        onSubmit={() => {}}
        onCancel={() => {}}
      />,
    );

    // THEN all key labels are present
    expect(screen.getByText('Rename')).toBeInTheDocument();
    expect(screen.getByText('Enter a new value.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should invoke `onCancel` when the Cancel button is pressed on Android', () => {
    // GIVEN a visible prompt on Android with an onCancel spy
    setPlatform('android');
    const onCancel = jest.fn();

    // WHEN the Cancel button is clicked
    renderWithTheme(<InputPrompt visible title="Rename" onSubmit={() => {}} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    // THEN onCancel is called once
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should invoke `onSubmit` with the entered value when OK is pressed on Android', () => {
    // GIVEN a visible prompt on Android with an onSubmit spy
    setPlatform('android');
    const onSubmit = jest.fn();

    // WHEN the user types into the field and confirms
    renderWithTheme(<InputPrompt visible title="Rename" onSubmit={onSubmit} onCancel={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));

    // THEN onSubmit receives exactly the entered value
    expect(onSubmit).toHaveBeenCalledWith('hello');
  });

  it('should delegate to `Alert.prompt` on iOS and not render a modal into the DOM', () => {
    // GIVEN the iOS platform with `Alert.prompt` spied
    setPlatform('ios');
    const alertSpy = jest.spyOn(Alert, 'prompt').mockImplementation(() => {});

    // WHEN a visible prompt mounts
    act(() => {
      renderWithTheme(
        <InputPrompt visible title="iOS Title" onSubmit={() => {}} onCancel={() => {}} />,
      );
    });

    // THEN Alert.prompt is called and no custom modal title is rendered
    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('iOS Title')).not.toBeInTheDocument();
  });
});
