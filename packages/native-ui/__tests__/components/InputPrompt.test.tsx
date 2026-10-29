import { Platform, Alert } from 'react-native';
import { act, fireEvent, screen } from '@testing-library/react';

import { InputPrompt } from '../../src/components/InputPrompt';
import { renderWithTheme } from '../test-utils';

function setPlatform(os: 'ios' | 'android') {
  Object.defineProperty(Platform, 'OS', { value: os, configurable: true, writable: true });
}

describe('InputPrompt', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    setPlatform(originalOS as 'ios' | 'android');
    jest.restoreAllMocks();
  });

  describe('GIVEN the InputPrompt export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof InputPrompt;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN the Android platform and a hidden prompt', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the title is not present in the DOM', () => {
        setPlatform('android');

        renderWithTheme(
          <InputPrompt visible={false} title="Rename" onSubmit={() => {}} onCancel={() => {}} />,
        );

        expect(screen.queryByText('Rename')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a visible prompt on Android with a title + message', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN all key labels are present', () => {
        setPlatform('android');

        renderWithTheme(
          <InputPrompt
            visible
            title="Rename"
            message="Enter a new value."
            onSubmit={() => {}}
            onCancel={() => {}}
          />,
        );

        expect(screen.getByText('Rename')).toBeInTheDocument();
        expect(screen.getByText('Enter a new value.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a visible prompt on Android with an onCancel spy', () => {
    describe('WHEN the Cancel button is clicked', () => {
      it('THEN onCancel is called once', () => {
        setPlatform('android');
        const onCancel = jest.fn();

        renderWithTheme(
          <InputPrompt visible title="Rename" onSubmit={() => {}} onCancel={onCancel} />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a visible prompt on Android with an onSubmit spy', () => {
    describe('WHEN the user types into the field and confirms', () => {
      it('THEN onSubmit receives exactly the entered value', () => {
        setPlatform('android');
        const onSubmit = jest.fn();

        renderWithTheme(
          <InputPrompt visible title="Rename" onSubmit={onSubmit} onCancel={() => {}} />,
        );
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'hello' } });
        fireEvent.click(screen.getByRole('button', { name: 'OK' }));

        expect(onSubmit).toHaveBeenCalledWith('hello');
      });
    });
  });

  describe('GIVEN the iOS platform with `Alert.prompt` spied', () => {
    describe('WHEN a visible prompt mounts', () => {
      it('THEN Alert.prompt is called and no custom modal title is rendered', () => {
        setPlatform('ios');
        const alertSpy = jest.spyOn(Alert, 'prompt').mockImplementation(() => {});

        act(() => {
          renderWithTheme(
            <InputPrompt visible title="iOS Title" onSubmit={() => {}} onCancel={() => {}} />,
          );
        });

        expect(alertSpy).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('iOS Title')).not.toBeInTheDocument();
      });
    });
  });
});
