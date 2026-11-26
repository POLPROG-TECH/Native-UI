import { Platform } from 'react-native';
import { accessibilityStateProps } from '../../src/utils/accessibilityStateProps';

describe('accessibilityStateProps', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GIVEN a native platform', () => {
    describe('WHEN the props of a selected tab are built', () => {
      it('THEN only the role and the accessibility state are returned', () => {
        const props = accessibilityStateProps('tab', { selected: true });

        expect(props).toEqual({
          accessibilityRole: 'tab',
          accessibilityState: { selected: true },
        });
      });
    });
  });

  describe('GIVEN React Native Web', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'web');
    });

    describe('WHEN the props of a selected tab are built', () => {
      it('THEN the selection is also written as aria-selected', () => {
        const props = accessibilityStateProps('tab', { selected: true, disabled: false });

        expect(props).toMatchObject({
          accessibilityState: { selected: true, disabled: false },
          'aria-selected': true,
          'aria-disabled': false,
        });
      });
    });

    describe('WHEN a radio is marked selected', () => {
      it('THEN it becomes aria-checked, because aria-selected is invalid on a radio', () => {
        const props = accessibilityStateProps('radio', { selected: true });

        expect(props).toMatchObject({ 'aria-checked': true });
        expect(props).not.toHaveProperty('aria-selected');
      });
    });

    describe('WHEN a button is marked selected', () => {
      it('THEN it is exposed as a pressed toggle button', () => {
        const props = accessibilityStateProps('button', { selected: false });

        expect(props).toMatchObject({ 'aria-pressed': false });
      });
    });

    describe('WHEN a checkbox is in the mixed state', () => {
      it('THEN aria-checked keeps the mixed value', () => {
        const props = accessibilityStateProps('checkbox', { checked: 'mixed' });

        expect(props).toMatchObject({ 'aria-checked': 'mixed' });
      });
    });

    describe('WHEN a button reports expanded and busy but no selection', () => {
      it('THEN those are written and no pressed state is invented', () => {
        const props = accessibilityStateProps('button', { expanded: true, busy: true });

        expect(props).toMatchObject({ 'aria-expanded': true, 'aria-busy': true });
        expect(props).not.toHaveProperty('aria-pressed');
      });
    });

    describe('WHEN a role without a choice attribute is marked selected', () => {
      it('THEN no selection attribute is written', () => {
        const props = accessibilityStateProps('menuitem', { selected: true, disabled: true });

        expect(props).toMatchObject({ 'aria-disabled': true });
        expect(props).not.toHaveProperty('aria-selected');
        expect(props).not.toHaveProperty('aria-checked');
      });
    });
  });
});
