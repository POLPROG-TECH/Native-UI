import { toast } from '../../src/components/Toast';

describe('toast singleton facade', () => {
  describe('GIVEN the module-level toast facade', () => {
    describe('WHEN its shape is inspected', () => {
      it('THEN show and hide are both callable functions', () => {
        const showType = typeof toast.show;
        const hideType = typeof toast.hide;

        expect(showType).toBe('function');
        expect(hideType).toBe('function');
      });
    });
  });

  describe('GIVEN no <Toast /> root is mounted in this test', () => {
    describe('WHEN show and hide are invoked with a valid config and no args', () => {
      it('THEN neither call throws', () => {
        const callShowAndHide = () => {
          toast.show({ message: 'hi' });
          toast.hide();
        };

        expect(callShowAndHide).not.toThrow();
      });
    });
  });

  describe('GIVEN a config with an action label and callback', () => {
    describe('WHEN show is called with the full config shape', () => {
      it('THEN the call completes without throwing', () => {
        const onAction = jest.fn();
        const config = {
          message: 'Saved',
          actionLabel: 'Undo',
          onAction,
          duration: 3000,
        };

        const callShow = () => toast.show(config);

        expect(callShow).not.toThrow();
      });
    });
  });
});
