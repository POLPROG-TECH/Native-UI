import { Avatar } from '../../src/components/Avatar';
import { BottomSheet } from '../../src/components/BottomSheet';
import { ConfettiOverlay } from '../../src/components/ConfettiOverlay';
import { InputPrompt } from '../../src/components/InputPrompt';
import { Modal } from '../../src/components/Modal';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Select } from '../../src/components/Select';
import { Skeleton, SkeletonCard } from '../../src/components/Skeleton';
import { Toast } from '../../src/components/Toast';

describe('exports - components with native-only dependencies', () => {
  describe('GIVEN the Avatar export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        expect(typeof Avatar).toBe('function');
      });
    });
  });

  describe('GIVEN the BottomSheet compound component', () => {
    describe('WHEN its shape is inspected', () => {
      it('THEN each sub-component is a function', () => {
        expect(typeof BottomSheet).toBe('function');
        expect(typeof BottomSheet.Header).toBe('function');
        expect(typeof BottomSheet.Body).toBe('function');
        expect(typeof BottomSheet.Footer).toBe('function');
      });
    });
  });

  describe('GIVEN the ConfettiOverlay export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        expect(typeof ConfettiOverlay).toBe('function');
      });
    });
  });

  describe('GIVEN the InputPrompt export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        expect(typeof InputPrompt).toBe('function');
      });
    });
  });

  describe('GIVEN the Modal compound component', () => {
    describe('WHEN its shape is inspected', () => {
      it('THEN each sub-component is a function', () => {
        expect(typeof Modal).toBe('function');
        expect(typeof Modal.Header).toBe('function');
        expect(typeof Modal.Body).toBe('function');
        expect(typeof Modal.Footer).toBe('function');
      });
    });
  });

  describe('GIVEN the ScreenContainer export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        expect(typeof ScreenContainer).toBe('function');
      });
    });
  });

  describe('GIVEN the Select compound component', () => {
    describe('WHEN its shape is inspected', () => {
      it('THEN each sub-component is a function', () => {
        expect(typeof Select).toBe('function');
        expect(typeof Select.Trigger).toBe('function');
        expect(typeof Select.Option).toBe('function');
      });
    });
  });

  describe('GIVEN the Skeleton compound component', () => {
    describe('WHEN its shape is inspected', () => {
      it('THEN both the base and the preset are functions', () => {
        expect(typeof Skeleton).toBe('function');
        expect(typeof Skeleton.Card).toBe('function');
        expect(typeof SkeletonCard).toBe('function');
      });
    });
  });

  describe('GIVEN the Toast export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        expect(typeof Toast).toBe('function');
      });
    });
  });
});
