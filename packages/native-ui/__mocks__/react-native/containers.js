/*
 * Host components of the jsdom react-native mock that render collections or
 * layers: FlatList renders every item eagerly (with separators between items,
 * as RN does), Modal renders only while visible.
 */
const React = require('react');
const { flattenAndTranslate } = require('./styles');
const { domProps } = require('./accessibility');

function renderSlot(Slot) {
  if (!Slot) {
    return Slot;
  }

  return React.createElement(typeof Slot === 'function' ? Slot : 'div', null);
}

const FlatList = React.forwardRef(function FlatList(
  {
    data,
    renderItem,
    keyExtractor,
    ListHeaderComponent,
    ListFooterComponent,
    ItemSeparatorComponent,
    accessibilityRole,
    style,
    ...props
  },
  ref,
) {
  const items = Array.isArray(data) ? data : [];

  return React.createElement(
    'div',
    {
      ref,
      role: accessibilityRole,
      style: flattenAndTranslate(style),
      ...domProps(props),
    },
    renderSlot(ListHeaderComponent),
    items.map((item, index) => {
      const key = keyExtractor ? keyExtractor(item, index) : String(index);

      const separator =
        ItemSeparatorComponent && index > 0 ? React.createElement(ItemSeparatorComponent) : null;

      return React.createElement(React.Fragment, { key }, separator, renderItem({ item, index }));
    }),
    renderSlot(ListFooterComponent),
  );
});

const Modal = function Modal({
  visible,
  children,
  onRequestClose,
  transparent: _t,
  animationType: _a,
  ...props
}) {
  if (!visible) {
    return null;
  }

  return React.createElement(
    'div',
    {
      role: 'dialog',
      'data-onrequestclose': onRequestClose ? 'true' : undefined,
      ...domProps(props),
    },
    children,
  );
};

module.exports = { FlatList, Modal };
