import { resolveListItemSlots } from '../../src/components/listItem/listItemSlots';
import { hasDividerBefore } from '../../src/components/listSection/dividers';

const noop = () => undefined;

describe('resolveListItemSlots', () => {
  describe('GIVEN both a static icon and a renderIcon prop', () => {
    describe('WHEN the slots are resolved', () => {
      it('THEN the render prop wins', () => {
        const slots = resolveListItemSlots({ icon: 'static', renderIcon: () => 'rendered' });

        expect(slots.icon).toBe('rendered');
      });
    });
  });

  describe('GIVEN a pressable row without a trailing element', () => {
    describe('WHEN the slots are resolved', () => {
      it('THEN the chevron defaults on', () => {
        const slots = resolveListItemSlots({ onPress: noop });

        expect(slots.showChevron).toBe(true);
      });
    });
  });

  describe('GIVEN a pressable row whose renderTrailing returns an element', () => {
    describe('WHEN the slots are resolved', () => {
      it('THEN the chevron defaults off and the rendered element is used', () => {
        const slots = resolveListItemSlots({
          onPress: noop,
          trailing: 'static',
          renderTrailing: () => 'rendered',
        });

        expect(slots).toEqual({ icon: undefined, trailing: 'rendered', showChevron: false });
      });
    });
  });

  describe('GIVEN a non-pressable row with an explicit showChevron', () => {
    describe('WHEN the slots are resolved', () => {
      it('THEN the explicit value is kept', () => {
        const slots = resolveListItemSlots({ showChevron: true, trailing: 'x' });

        expect(slots.showChevron).toBe(true);
      });
    });
  });
});

describe('hasDividerBefore', () => {
  describe('GIVEN the first row', () => {
    describe('WHEN its divider is evaluated', () => {
      it('THEN no divider is drawn', () => {
        const rows = [<span key="a" />, <span key="b" />];

        expect(hasDividerBefore(rows, 0)).toBe(false);
      });
    });
  });

  describe('GIVEN a row after one that sets hideDivider', () => {
    describe('WHEN its divider is evaluated', () => {
      it('THEN the divider is suppressed', () => {
        const Row = (_props: { hideDivider?: boolean }) => null;
        const rows = [<Row key="a" hideDivider />, <Row key="b" />];

        expect(hasDividerBefore(rows, 1)).toBe(false);
      });
    });
  });

  describe('GIVEN a row after a plain string child', () => {
    describe('WHEN its divider is evaluated', () => {
      it('THEN the divider is drawn', () => {
        const rows = ['text', <span key="b" />];

        expect(hasDividerBefore(rows, 1)).toBe(true);
      });
    });
  });
});
