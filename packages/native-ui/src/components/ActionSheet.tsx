import { Text, View } from 'react-native';
import { useTheme } from '../theme';
import { ActionSheetItem, type ActionSheetAction } from './actionSheet/ActionSheetItem';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';

export type { ActionSheetAction } from './actionSheet/ActionSheetItem';

export interface ActionSheetProps {
  visible: boolean;
  /** Called for the backdrop, the cancel button and after an action is chosen. */
  onClose: () => void;
  actions: ReadonlyArray<ActionSheetAction>;
  /** Short context line above the actions (e.g. the item they apply to). */
  title?: string;
  /** Shows the cancel button under the actions. @default true */
  showCancel?: boolean;
  /** @default labels.cancel from `NativeUIConfig.labels` */
  cancelLabel?: string;
  /** Test ID of the sheet; the action list receives `{testID}-actions`, cancel `{testID}-cancel`. */
  testID?: string;
}

function ActionSheetTitle({ title }: { title: string }) {
  const theme = useTheme();
  const tokens = theme.components.actionSheet;

  return (
    <BottomSheet.Header style={{ paddingBottom: tokens.titlePaddingVertical }}>
      <Text
        accessibilityRole="header"
        style={[theme.typography[tokens.titleVariant], { color: theme.colors.textSecondary }]}
      >
        {title}
      </Text>
    </BottomSheet.Header>
  );
}

interface ActionSheetCancelProps {
  label: string;
  onPress: () => void;
  testID: string | undefined;
}

function ActionSheetCancel({ label, onPress, testID }: ActionSheetCancelProps) {
  return (
    <BottomSheet.Footer layout="stacked">
      <Button title={label} variant="secondary" onPress={onPress} testID={testID} />
    </BottomSheet.Footer>
  );
}

/**
 * Menu of actions for one item, presented as a bottom sheet (share, edit,
 * delete). Choosing an action closes the sheet first and then runs it, so an
 * action may open another overlay. Built on `BottomSheet`: the backdrop and
 * the handle swipe dismiss it. Dimensions come from
 * `theme.components.actionSheet`.
 *
 * @example
 * ```tsx
 * <ActionSheet
 *   visible={open}
 *   onClose={() => setOpen(false)}
 *   title="Invoice 2024/11"
 *   actions={[
 *     { label: 'Share', onPress: share },
 *     { label: 'Delete', onPress: remove, destructive: true },
 *   ]}
 * />
 * ```
 */
export function ActionSheet(props: ActionSheetProps) {
  const { visible, onClose, actions, title, showCancel = true, testID } = props;
  const theme = useTheme();
  const select = (action: ActionSheetAction) => {
    onClose();
    action.onPress();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} testID={testID}>
      {title ? <ActionSheetTitle title={title} /> : null}
      <View testID={testID ? `${testID}-actions` : undefined} accessibilityRole="menu">
        {actions.map((action, index) => (
          <ActionSheetItem
            key={action.label}
            action={action}
            onSelect={select}
            divided={index > 0}
          />
        ))}
      </View>
      {showCancel ? (
        <ActionSheetCancel
          label={props.cancelLabel ?? theme.labels.cancel}
          onPress={onClose}
          testID={testID ? `${testID}-cancel` : undefined}
        />
      ) : null}
    </BottomSheet>
  );
}
