import { toastStore } from '../../src/components/toast/toastStore';

/** Runs `run` with `__DEV__` forced on (jest.setup.js defaults it to false). */
function withDev(run: () => void): void {
  const previous: unknown = Reflect.get(globalThis, '__DEV__');
  Reflect.set(globalThis, '__DEV__', true);

  try {
    run();
  } finally {
    Reflect.set(globalThis, '__DEV__', previous);
  }
}

describe('toastStore', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    toastStore._resetForTest();
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    warn.mockRestore();
  });

  describe('GIVEN no active toast and a subscriber', () => {
    describe('WHEN hide is called', () => {
      it('THEN the subscriber is not notified', () => {
        const listener = jest.fn();
        toastStore.subscribe(listener);

        toastStore.hide();

        expect(listener).not.toHaveBeenCalled();
        expect(toastStore.getSnapshot()).toBeNull();
      });
    });
  });

  describe('GIVEN two toasts shown one after the other', () => {
    describe('WHEN the snapshot is read', () => {
      it('THEN only the latest toast is active, with a new id', () => {
        toastStore.show({ message: 'First' });
        const first = toastStore.getSnapshot();

        toastStore.show({ message: 'Second' });

        expect(toastStore.getSnapshot()).toEqual({ message: 'Second', id: 2 });
        expect(first?.id).toBe(1);
      });
    });
  });

  describe('GIVEN an unsubscribed listener', () => {
    describe('WHEN a toast is shown', () => {
      it('THEN the listener is not notified', () => {
        const listener = jest.fn();
        const unsubscribe = toastStore.subscribe(listener);
        unsubscribe();

        toastStore.show({ message: 'Saved' });

        expect(listener).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN one mounted Toast root in a development build', () => {
    describe('WHEN a second root registers', () => {
      it('THEN a single dev warning asks for exactly one root', () => {
        withDev(() => {
          toastStore.registerRoot();
          toastStore.registerRoot();
        });

        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn).toHaveBeenCalledWith(
          '[native-ui] Multiple <Toast /> roots detected. Mount exactly one at the app root.',
        );
      });
    });
  });

  describe('GIVEN one mounted Toast root in a production build', () => {
    describe('WHEN a second root registers', () => {
      it('THEN no warning is logged', () => {
        toastStore.registerRoot();
        toastStore.registerRoot();

        expect(warn).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN two mounted roots, an active toast and a subscriber', () => {
    describe('WHEN one root unmounts', () => {
      it('THEN the toast stays active and the subscriber is notified', () => {
        const unregisterFirst = toastStore.registerRoot();
        toastStore.registerRoot();
        toastStore.show({ message: 'Saved' });
        const listener = jest.fn();
        toastStore.subscribe(listener);

        unregisterFirst();

        expect(toastStore.getSnapshot()).toEqual({ message: 'Saved', id: 1 });
        expect(listener).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN both roots unmount', () => {
      it('THEN the toast is cleared and the subscriber is dropped', () => {
        const unregisterFirst = toastStore.registerRoot();
        const unregisterSecond = toastStore.registerRoot();
        toastStore.show({ message: 'Saved' });
        const listener = jest.fn();
        toastStore.subscribe(listener);

        unregisterFirst();
        unregisterSecond();
        toastStore.show({ message: 'After unmount' });

        expect(listener).toHaveBeenCalledTimes(1);
        expect(toastStore.getSnapshot()).toEqual({ message: 'After unmount', id: 2 });
      });
    });
  });

  describe('GIVEN no mounted root', () => {
    describe('WHEN an extra unregister runs (e.g. a StrictMode double cleanup)', () => {
      it('THEN the next root registers as the only one, without a warning', () => {
        const unregister = toastStore.registerRoot();
        unregister();
        unregister();

        withDev(() => {
          toastStore.registerRoot();
        });

        expect(warn).not.toHaveBeenCalled();
      });
    });
  });
});
