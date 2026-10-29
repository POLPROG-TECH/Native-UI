import React from 'react';
import { screen } from '@testing-library/react';
import { ActionTile } from '../../src/components/ActionTile';
import { Chip } from '../../src/components/Chip';
import { EmptyState } from '../../src/components/EmptyState';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';
import { ListItem } from '../../src/components/ListItem';
import { SettingsRow } from '../../src/components/SettingsRow';
import { ToastCard } from '../../src/components/toast/ToastCard';
import { renderWithTheme, captureTheme } from '../test-utils';

function iconSpy() {
  return jest.fn((_props: { color: string; size: number }) => null);
}

function Thrower(): React.ReactElement {
  throw new Error('boom');
}

describe('icon slots in components', () => {
  describe('GIVEN a ListItem with a render-function icon', () => {
    describe('WHEN the row is plain or destructive', () => {
      it('THEN the icon gets textSecondary, or errorText when destructive, at the row icon size', () => {
        const theme = captureTheme();
        const plain = iconSpy();
        const destructive = iconSpy();

        renderWithTheme(<ListItem title="Plain" icon={plain} />);
        renderWithTheme(<ListItem title="Delete" icon={destructive} destructive />);

        const size = theme.components.listItem.iconSize;
        expect(plain).toHaveBeenCalledWith({ color: theme.colors.textSecondary, size });
        expect(destructive).toHaveBeenCalledWith({ color: theme.colors.errorText, size });
      });
    });
  });

  describe('GIVEN a SettingsRow with a render-function icon', () => {
    describe('WHEN it renders', () => {
      it('THEN the icon gets onPrimary at the settings icon size', () => {
        const theme = captureTheme();
        const icon = iconSpy();

        renderWithTheme(<SettingsRow label="Search" icon={icon} />);

        expect(icon).toHaveBeenCalledWith({
          color: theme.colors.onPrimary,
          size: theme.components.settingsRow.iconSize,
        });
      });
    });
  });

  describe('GIVEN a SettingsRow with a mapped emoji icon', () => {
    describe('WHEN it renders', () => {
      it('THEN the emoji is shown at the emoji font size', () => {
        const theme = captureTheme();

        renderWithTheme(<SettingsRow label="Folders" icon="📁" />);

        expect(screen.getByText('📁').style.fontSize).toBe(
          `${theme.components.settingsRow.emojiFontSize}px`,
        );
      });
    });
  });

  describe('GIVEN an EmptyState of size lg with a render-function icon', () => {
    describe('WHEN it renders', () => {
      it('THEN the icon gets textSecondary at the lg preset icon size', () => {
        const theme = captureTheme();
        const icon = iconSpy();

        renderWithTheme(<EmptyState title="Nothing" size="lg" icon={icon} />);

        expect(icon).toHaveBeenCalledWith({
          color: theme.colors.textSecondary,
          size: theme.components.emptyState.lg.iconSize,
        });
      });
    });
  });

  describe('GIVEN a selected solid Chip with a render-function icon', () => {
    describe('WHEN it renders', () => {
      it('THEN the icon gets the selected label color', () => {
        const theme = captureTheme();
        const icon = iconSpy();

        renderWithTheme(<Chip label="Done" selected icon={icon} />);

        expect(icon).toHaveBeenCalledWith({
          color: theme.colors.onPrimary,
          size: theme.components.chip.iconFontSize,
        });
      });
    });
  });

  describe('GIVEN a success ActionTile with a render-function icon', () => {
    describe('WHEN it renders', () => {
      it('THEN the icon gets the success foreground color at the large icon size', () => {
        const theme = captureTheme();
        const icon = iconSpy();

        renderWithTheme(<ActionTile label="Add" tone="success" icon={icon} onPress={jest.fn()} />);

        expect(icon).toHaveBeenCalledWith({
          color: theme.colors.successText,
          size: theme.iconSize.lg,
        });
      });
    });
  });

  describe('GIVEN an error toast with a render-function icon', () => {
    describe('WHEN the card renders', () => {
      it('THEN the icon gets the error accent at the toast icon size', () => {
        const theme = captureTheme();
        const icon = iconSpy();

        renderWithTheme(
          <ToastCard
            toast={{ id: 1, message: 'Failed', variant: 'error', icon }}
            position="bottom"
            offset={0}
          />,
        );

        expect(icon).toHaveBeenCalledWith({
          color: theme.colors.error,
          size: theme.components.toast.iconSize,
        });
      });
    });
  });
});

describe('ErrorBoundary fallback icon', () => {
  let errorSpy: jest.SpyInstance;
  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });
  afterEach(() => {
    errorSpy.mockRestore();
  });

  describe('GIVEN a boundary without a fallbackIcon', () => {
    describe('WHEN a child throws', () => {
      it('THEN a drawn alert icon is shown instead of the warning emoji', () => {
        renderWithTheme(
          <ErrorBoundary>
            <Thrower />
          </ErrorBoundary>,
        );

        expect(screen.getByTestId('error-boundary-icon').childElementCount).toBeGreaterThan(0);
        expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a boundary with a render-function fallbackIcon', () => {
    describe('WHEN a child throws', () => {
      it('THEN the function replaces the default and gets errorText', () => {
        const theme = captureTheme();
        const icon = iconSpy();

        renderWithTheme(
          <ErrorBoundary fallbackIcon={icon}>
            <Thrower />
          </ErrorBoundary>,
        );

        expect(icon).toHaveBeenCalledWith({
          color: theme.colors.errorText,
          size: theme.components.errorBoundary.iconSize,
        });
        expect(screen.queryByTestId('error-boundary-icon')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a boundary with a null fallbackIcon', () => {
    describe('WHEN a child throws', () => {
      it('THEN no icon is shown', () => {
        renderWithTheme(
          <ErrorBoundary fallbackIcon={null}>
            <Thrower />
          </ErrorBoundary>,
        );

        expect(screen.queryByTestId('error-boundary-icon')).not.toBeInTheDocument();
      });
    });
  });
});
