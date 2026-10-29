import { Alert, Platform } from 'react-native';
import {
  useIOSAlertPrompt,
  type IOSAlertPromptOptions,
} from '../../src/components/inputPrompt/useIOSAlertPrompt';
import { renderHook } from '../test-utils';

type PlatformOS = 'ios' | 'android';

function setPlatform(os: PlatformOS): void {
  Object.defineProperty(Platform, 'OS', { value: os, configurable: true, writable: true });
}

/*
 * The dom mock's `Alert.prompt` is already a `jest.fn`, which `spyOn` returns
 * as-is and `restoreAllMocks` does not clear, so each test starts it fresh.
 */
function spyOnPrompt() {
  return jest
    .spyOn(Alert, 'prompt')
    .mockClear()
    .mockImplementation(() => {});
}

type PromptSpy = ReturnType<typeof spyOnPrompt>;

/** Presses the native prompt button labelled `label`, as the user would. */
function pressPromptButton(prompt: PromptSpy, label: string, text?: string): void {
  const buttons = prompt.mock.lastCall?.[2];

  if (!Array.isArray(buttons)) {
    throw new Error('Alert.prompt was not shown with buttons');
  }

  const onPress = buttons.find((button) => button.text === label)?.onPress;

  if (typeof onPress !== 'function') {
    throw new Error(`no "${label}" button`);
  }

  onPress(text);
}

function promptOptions(overrides: Partial<IOSAlertPromptOptions> = {}): IOSAlertPromptOptions {
  return {
    visible: true,
    title: 'Rename',
    message: 'Enter a new name.',
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    submitLabel: 'OK',
    cancelLabel: 'Cancel',
    keyboardType: 'default',
    ...overrides,
  };
}

function renderPrompt(initial: IOSAlertPromptOptions) {
  return renderHook((options: IOSAlertPromptOptions) => useIOSAlertPrompt(options), {
    initialProps: initial,
  });
}

describe('useIOSAlertPrompt', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    setPlatform(originalOS === 'android' ? 'android' : 'ios');
    jest.restoreAllMocks();
  });

  describe('GIVEN iOS and a visible prompt', () => {
    describe('WHEN the hook mounts', () => {
      it('THEN the native prompt opens once with the labels and keyboard type', () => {
        setPlatform('ios');
        const prompt = spyOnPrompt();

        renderPrompt(promptOptions({ keyboardType: 'numeric' }));

        expect(prompt).toHaveBeenCalledTimes(1);
        expect(prompt).toHaveBeenCalledWith(
          'Rename',
          'Enter a new name.',
          [
            expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
            expect.objectContaining({ text: 'OK' }),
          ],
          'plain-text',
          '',
          'numeric',
        );
      });
    });

    describe('WHEN the user confirms with text, then with an empty field', () => {
      it('THEN onSubmit receives the text, and an empty string when there is none', () => {
        setPlatform('ios');
        const prompt = spyOnPrompt();
        const onSubmit = jest.fn();
        renderPrompt(promptOptions({ onSubmit }));

        pressPromptButton(prompt, 'OK', 'Groceries');
        pressPromptButton(prompt, 'OK');

        expect(onSubmit.mock.calls).toEqual([['Groceries'], ['']]);
      });
    });

    describe('WHEN the user cancels', () => {
      it('THEN onCancel is called and onSubmit is not', () => {
        setPlatform('ios');
        const prompt = spyOnPrompt();
        const options = promptOptions();
        renderPrompt(options);

        pressPromptButton(prompt, 'Cancel');

        expect(options.onCancel).toHaveBeenCalledTimes(1);
        expect(options.onSubmit).not.toHaveBeenCalled();
      });
    });

    describe('WHEN the parent re-renders with new callbacks while the prompt is open', () => {
      it('THEN the prompt is not shown again and confirming calls the latest onSubmit', () => {
        setPlatform('ios');
        const prompt = spyOnPrompt();
        const staleSubmit = jest.fn();
        const latestSubmit = jest.fn();
        const { rerender } = renderPrompt(promptOptions({ onSubmit: staleSubmit }));

        rerender(promptOptions({ onSubmit: latestSubmit }));
        pressPromptButton(prompt, 'OK', 'New name');

        expect(prompt).toHaveBeenCalledTimes(1);
        expect(latestSubmit).toHaveBeenCalledWith('New name');
        expect(staleSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN iOS and a hidden prompt', () => {
    describe('WHEN it is shown, hidden and shown again', () => {
      it('THEN the native prompt opens once per show', () => {
        setPlatform('ios');
        const prompt = spyOnPrompt();
        const { rerender } = renderPrompt(promptOptions({ visible: false }));
        const opensWhileHidden = prompt.mock.calls.length;

        rerender(promptOptions({ visible: true }));
        rerender(promptOptions({ visible: false }));
        rerender(promptOptions({ visible: true }));

        expect(opensWhileHidden).toBe(0);
        expect(prompt).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('GIVEN Android and a visible prompt', () => {
    describe('WHEN the hook mounts', () => {
      it('THEN the iOS-only native prompt is not used', () => {
        setPlatform('android');
        const prompt = spyOnPrompt();

        renderPrompt(promptOptions());

        expect(prompt).not.toHaveBeenCalled();
      });
    });
  });
});
