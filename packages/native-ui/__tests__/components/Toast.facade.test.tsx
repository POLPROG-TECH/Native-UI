import { toast } from '../../src/components/Toast';

describe('toast singleton facade', () => {
  it('should expose show and hide as callable functions', () => {
    // GIVEN the module-level toast facade

    // WHEN its shape is inspected
    const showType = typeof toast.show;
    const hideType = typeof toast.hide;

    // THEN show and hide are both callable functions
    expect(showType).toBe('function');
    expect(hideType).toBe('function');
  });

  it('should not throw when show or hide is called without a mounted Toast root', () => {
    // GIVEN no <Toast /> root is mounted in this test

    // WHEN show and hide are invoked with a valid config and no args
    const callShowAndHide = () => {
      toast.show({ message: 'hi' });
      toast.hide();
    };

    // THEN neither call throws
    expect(callShowAndHide).not.toThrow();
  });

  it('should accept optional action props when show is called with full config', () => {
    // GIVEN a config with an action label and callback
    const onAction = jest.fn();
    const config = {
      message: 'Saved',
      actionLabel: 'Undo',
      onAction,
      duration: 3000,
    };

    // WHEN show is called with the full config shape
    const callShow = () => toast.show(config);

    // THEN the call completes without throwing
    expect(callShow).not.toThrow();
  });
});
