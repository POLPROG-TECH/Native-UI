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
  it('should_export_Avatar_as_a_function_component', () => {
    // GIVEN the Avatar export

    // WHEN its runtime type is inspected THEN it is a function component
    expect(typeof Avatar).toBe('function');
  });

  it('should_export_BottomSheet_with_compound_Header_Body_Footer_subcomponents', () => {
    // GIVEN the BottomSheet compound component

    // WHEN its shape is inspected THEN each sub-component is a function
    expect(typeof BottomSheet).toBe('function');
    expect(typeof BottomSheet.Header).toBe('function');
    expect(typeof BottomSheet.Body).toBe('function');
    expect(typeof BottomSheet.Footer).toBe('function');
  });

  it('should_export_ConfettiOverlay_as_a_function_component', () => {
    // GIVEN the ConfettiOverlay export

    // WHEN its runtime type is inspected THEN it is a function component
    expect(typeof ConfettiOverlay).toBe('function');
  });

  it('should_export_InputPrompt_as_a_function_component', () => {
    // GIVEN the InputPrompt export

    // WHEN its runtime type is inspected THEN it is a function component
    expect(typeof InputPrompt).toBe('function');
  });

  it('should_export_Modal_with_compound_Header_Body_Footer_subcomponents', () => {
    // GIVEN the Modal compound component

    // WHEN its shape is inspected THEN each sub-component is a function
    expect(typeof Modal).toBe('function');
    expect(typeof Modal.Header).toBe('function');
    expect(typeof Modal.Body).toBe('function');
    expect(typeof Modal.Footer).toBe('function');
  });

  it('should_export_ScreenContainer_as_a_function_component', () => {
    // GIVEN the ScreenContainer export

    // WHEN its runtime type is inspected THEN it is a function component
    expect(typeof ScreenContainer).toBe('function');
  });

  it('should_export_Select_with_compound_Trigger_and_Option_subcomponents', () => {
    // GIVEN the Select compound component

    // WHEN its shape is inspected THEN each sub-component is a function
    expect(typeof Select).toBe('function');
    expect(typeof Select.Trigger).toBe('function');
    expect(typeof Select.Option).toBe('function');
  });

  it('should_export_Skeleton_with_a_Card_preset', () => {
    // GIVEN the Skeleton compound component

    // WHEN its shape is inspected THEN both the base and the preset are functions
    expect(typeof Skeleton).toBe('function');
    expect(typeof Skeleton.Card).toBe('function');
    expect(typeof SkeletonCard).toBe('function');
  });

  it('should_export_Toast_as_a_function_component', () => {
    // GIVEN the Toast export

    // WHEN its runtime type is inspected THEN it is a function component
    expect(typeof Toast).toBe('function');
  });
});
