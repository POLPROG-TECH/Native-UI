import React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../test-utils';
import type { ComponentTokenOverrides } from '../../src/tokens/components';
import { Avatar } from '../../src/components/Avatar';
import { Badge } from '../../src/components/Badge';
import { Checkbox } from '../../src/components/Checkbox';
import { Chip, ChipGroup } from '../../src/components/Chip';
import { DatePickerInput } from '../../src/components/DatePickerInput';
import { DateRangePickerInput } from '../../src/components/DateRangePickerInput';
import { FieldError } from '../../src/components/FieldError';
import { FieldLabel } from '../../src/components/FieldLabel';
import { IconButton } from '../../src/components/IconButton';
import { Input } from '../../src/components/Input';
import { ProgressBar } from '../../src/components/ProgressBar';
import { Radio } from '../../src/components/Radio';
import { SearchBar } from '../../src/components/SearchBar';
import { Skeleton, SkeletonCard } from '../../src/components/Skeleton';
import { Spinner } from '../../src/components/Spinner';
import { Switch } from '../../src/components/Switch';
import { TextArea } from '../../src/components/TextArea';

/*
 * Control components read every dimension from `theme.components`. These
 * table-driven cases prove, per component, that `testID` reaches the root and
 * that an app-level token override reaches the rendered style.
 */

const noop = () => {};

const ID = 'subject';

function renderWithTokens(ui: React.ReactElement, components: ComponentTokenOverrides) {
  return renderWithTheme(ui, { config: { colorMode: 'light', components } });
}

const ROOT_CASES: Array<[name: string, element: React.ReactElement]> = [
  ['Avatar', <Avatar key="a" initials="AB" testID={ID} />],
  ['Badge', <Badge key="a" count={3} testID={ID} />],
  ['Checkbox', <Checkbox key="a" checked onChange={noop} label="Terms" testID={ID} />],
  ['Chip', <Chip key="a" label="Tag" testID={ID} />],
  [
    'ChipGroup',
    <ChipGroup key="a" testID={ID}>
      {null}
    </ChipGroup>,
  ],
  ['DatePickerInput', <DatePickerInput key="a" value="" onChange={noop} testID={ID} />],
  [
    'DateRangePickerInput',
    <DateRangePickerInput key="a" value={{ start: '', end: '' }} onChange={noop} testID={ID} />,
  ],
  ['FieldError', <FieldError key="a" error="Required" testID={ID} />],
  ['FieldLabel', <FieldLabel key="a" label="Name" testID={ID} />],
  [
    'IconButton',
    <IconButton key="a" icon={null} onPress={noop} accessibilityLabel="Add" testID={ID} />,
  ],
  ['ProgressBar', <ProgressBar key="a" value={0.5} testID={ID} />],
  ['Radio', <Radio key="a" selected label="One" onPress={noop} testID={ID} />],
  ['SearchBar', <SearchBar key="a" value="" onChangeText={noop} testID={ID} />],
  ['Skeleton', <Skeleton key="a" width={10} height={10} testID={ID} />],
  ['SkeletonCard', <SkeletonCard key="a" testID={ID} />],
  ['Spinner', <Spinner key="a" testID={ID} />],
  ['Switch', <Switch key="a" value onValueChange={noop} label="Wi-Fi" testID={ID} />],
];

describe('control components: testID', () => {
  describe('GIVEN a control rendered with a testID', () => {
    describe('WHEN it mounts inside the theme provider', () => {
      it.each(ROOT_CASES)('THEN exactly one element carries that testID (%s)', (_name, element) => {
        renderWithTheme(element);

        expect(screen.getByTestId(ID)).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN text fields rendered with testIDs (TextInputProps already carried testID)', () => {
    describe('WHEN their elements are queried', () => {
      it('THEN the input keeps the testID and the wrapper gets `{testID}-container`', () => {
        renderWithTheme(
          <>
            <Input testID="name" />
            <TextArea testID="bio" />
          </>,
        );

        expect(screen.getByTestId('name').tagName).toBe('INPUT');
        expect(screen.getByTestId('name-container')).toBeInTheDocument();
        expect(screen.getByTestId('bio').tagName).toBe('INPUT');
        expect(screen.getByTestId('bio-container')).toBeInTheDocument();
      });
    });
  });
});

type StyleCase = [
  name: string,
  element: React.ReactElement,
  components: ComponentTokenOverrides,
  target: string,
  style: Record<string, string | number>,
];

const STYLE_CASES: StyleCase[] = [
  [
    'Avatar',
    <Avatar key="a" initials="AB" testID={ID} />,
    { avatar: { md: { size: 50, fontSize: 20 } } },
    ID,
    { width: '50px', borderRadius: '25px' },
  ],
  [
    'Badge',
    <Badge key="a" count={3} testID={ID} />,
    { badge: { height: 24 } },
    ID,
    { height: '24px', borderRadius: '12px' },
  ],
  [
    'Badge dot',
    <Badge key="a" testID={ID} />,
    { badge: { dotSize: 10 } },
    ID,
    { width: '10px', height: '10px' },
  ],
  [
    'Checkbox',
    <Checkbox key="a" checked={false} onChange={noop} testID={ID} />,
    { checkbox: { md: { size: 26, radius: 6, iconSize: 18 } } },
    `${ID}-box`,
    { width: '26px', borderRadius: '6px' },
  ],
  [
    'Chip',
    <Chip key="a" label="Tag" testID={ID} />,
    { chip: { md: { paddingVertical: 6, paddingHorizontal: 20, minHeight: 40 } } },
    ID,
    { paddingLeft: '20px', paddingTop: '6px', minHeight: '40px' },
  ],
  [
    'ChipGroup',
    <ChipGroup key="a" testID={ID}>
      {null}
    </ChipGroup>,
    { chip: { groupGap: 14 } },
    ID,
    { gap: '14px' },
  ],
  [
    'DatePickerInput',
    <DatePickerInput key="a" value="" onChange={noop} testID={ID} />,
    { datePicker: { containerMarginBottom: 30 } },
    ID,
    { marginBottom: '30px' },
  ],
  [
    'DatePickerInput trigger',
    <DatePickerInput key="a" value="" onChange={noop} testID={ID} />,
    { datePicker: { radius: 3 } },
    `${ID}-trigger`,
    { borderRadius: '3px' },
  ],
  [
    'DateRangePickerInput',
    <DateRangePickerInput key="a" value={{ start: '', end: '' }} onChange={noop} testID={ID} />,
    { dateRangePicker: { containerMarginBottom: 30 } },
    ID,
    { marginBottom: '30px' },
  ],
  [
    'FieldError',
    <FieldError key="a" error="Required" testID={ID} />,
    { fieldError: { marginTop: 9 } },
    ID,
    { marginTop: '9px' },
  ],
  [
    'FieldLabel',
    <FieldLabel key="a" label="Name" testID={ID} />,
    { fieldLabel: { marginBottom: 10 } },
    ID,
    { marginBottom: '10px' },
  ],
  [
    'Input',
    <Input key="a" testID={ID} />,
    { input: { paddingHorizontal: 24 } },
    ID,
    { paddingLeft: '24px' },
  ],
  [
    'Input container',
    <Input key="a" testID={ID} />,
    { input: { containerMarginBottom: 30 } },
    `${ID}-container`,
    { marginBottom: '30px' },
  ],
  [
    'ProgressBar',
    <ProgressBar key="a" value={0.5} testID={ID} />,
    { progressBar: { height: 12 } },
    ID,
    { height: '12px', borderRadius: '6px' },
  ],
  [
    'Radio',
    <Radio key="a" selected={false} testID={ID} />,
    { radio: { size: 30 } },
    `${ID}-indicator`,
    { width: '30px', borderRadius: '15px' },
  ],
  [
    'SearchBar',
    <SearchBar key="a" value="" onChangeText={noop} testID={ID} />,
    { searchBar: { radius: 4 } },
    `${ID}-input`,
    { borderRadius: '4px' },
  ],
  [
    'Skeleton',
    <Skeleton key="a" width={10} height={10} testID={ID} />,
    { skeleton: { radius: 3 } },
    ID,
    { borderRadius: '3px' },
  ],
  [
    'SkeletonCard',
    <SkeletonCard key="a" testID={ID} />,
    { skeletonCard: { padding: 20 } },
    ID,
    { padding: '20px' },
  ],
  [
    'Switch',
    <Switch key="a" value onValueChange={noop} testID={ID} />,
    { switch: { minHeight: 50 } },
    ID,
    { minHeight: '50px' },
  ],
  [
    'TextArea',
    <TextArea key="a" testID={ID} />,
    { textArea: { paddingHorizontal: 22 } },
    ID,
    { paddingLeft: '22px' },
  ],
];

describe('control components: token overrides', () => {
  describe('GIVEN an app config overriding one component token', () => {
    describe('WHEN the control is rendered under that config', () => {
      it.each(STYLE_CASES)(
        'THEN the overridden value reaches the rendered style (%s)',
        (_name, element, components, target, style) => {
          renderWithTokens(element, components);

          expect(screen.getByTestId(target)).toHaveStyle(style);
        },
      );
    });
  });

  describe('GIVEN a larger md diameter', () => {
    describe('WHEN the button is queried', () => {
      it('THEN its style uses the token diameter', () => {
        renderWithTokens(
          <IconButton icon={null} onPress={noop} accessibilityLabel="Add" testID={ID} />,
          { iconButton: { md: 52 } },
        );

        const button = screen.getByRole('button', { name: 'Add' });

        expect(button).toHaveStyle({ width: '52px', height: '52px' });
      });
    });
  });

  describe('GIVEN a spinner label margin override', () => {
    describe('WHEN the label is queried', () => {
      it('THEN its top margin is the token value', () => {
        renderWithTokens(<Spinner label="Fetching" />, { spinner: { labelMarginTop: 20 } });

        expect(screen.getByText('Fetching')).toHaveStyle({ marginTop: '20px' });
      });
    });
  });
});

describe('control components: behavioural tokens', () => {
  describe('GIVEN a badge cap of 9 from the theme', () => {
    describe('WHEN the badge renders', () => {
      it('THEN the count is shown as "9+"', () => {
        renderWithTokens(<Badge count={12} />, { badge: { maxCount: 9 } });

        expect(screen.getByText('9+')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a theme cap of 9 and an explicit max of 20', () => {
    describe('WHEN the badge renders', () => {
      it('THEN the raw count is shown', () => {
        renderWithTokens(<Badge count={12} max={20} />, { badge: { maxCount: 9 } });

        expect(screen.getByText('12')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN one area relying on a 3-line token default and one with lines={1}', () => {
    describe('WHEN their minimum heights are read', () => {
      it('THEN the token default spans exactly three lines', () => {
        renderWithTokens(
          <>
            <TextArea testID="tokens" />
            <TextArea testID="single" lines={1} />
          </>,
          { textArea: { defaultLines: 3 } },
        );

        const lineHeight = parseFloat(screen.getByTestId('single').style.minHeight);
        const tokenHeight = parseFloat(screen.getByTestId('tokens').style.minHeight);

        expect(lineHeight).toBeGreaterThan(0);
        expect(tokenHeight).toBe(lineHeight * 3);
      });
    });
  });

  describe('GIVEN a SearchBar whose theme debounce is 50ms', () => {
    describe('WHEN the user types and 49ms pass', () => {
      it('THEN nothing is emitted yet, and the value arrives at 50ms', () => {
        jest.useFakeTimers();
        const onChangeText = jest.fn();
        try {
          renderWithTokens(<SearchBar value="" onChangeText={onChangeText} testID={ID} />, {
            searchBar: { debounceMs: 50 },
          });

          fireEvent.change(screen.getByTestId(`${ID}-input`), { target: { value: 'ab' } });
          act(() => jest.advanceTimersByTime(49));

          expect(onChangeText).not.toHaveBeenCalled();
          act(() => jest.advanceTimersByTime(1));
          expect(onChangeText).toHaveBeenCalledWith('ab');
        } finally {
          jest.useRealTimers();
        }
      });
    });
  });

  describe('GIVEN a SearchBar with text', () => {
    describe('WHEN the clear icon is queried', () => {
      it('THEN it uses the token size and no Unicode cross remains', () => {
        renderWithTokens(<SearchBar value="abc" onChangeText={noop} testID={ID} />, {
          searchBar: { clearIconSize: 18 },
        });

        const icon = screen.getByTestId(`${ID}-clear-icon`);

        expect(icon).toHaveStyle({ width: '18px', height: '18px' });
        expect(screen.queryByText('✕')).not.toBeInTheDocument();
      });
    });
  });
});
