import { toast } from '../../src/components/Toast';

describe('toast singleton facade', () => {
  it('should_expose_show_and_hide_as_callable_functions', () => {
    // GIVEN the module-level toast facade

    // WHEN its shape is inspected
    const showType = typeof toast.show;
    const hideType = typeof toast.hide;

    // THEN show and hide are both callable functions
    expect(showType).toBe('function');
    expect(hideType).toBe('function');
  });

  it('should_not_throw_when_show_or_hide_is_called_without_a_mounted_Toast_root', () => {
    // GIVEN no <Toast /> root is mounted in this test

    // WHEN show and hide are invoked with a valid config and no args
    const callShowAndHide = () => {
      toast.show({ message: 'hi' });
      toast.hide();
    };

    // THEN neither call throws
    expect(callShowAndHide).not.toThrow();
  });

  it('should_accept_optional_action_props_when_show_is_called_with_full_config', () => {
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
