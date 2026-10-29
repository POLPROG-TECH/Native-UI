import { render } from '@testing-library/react';
import { NativeUIProvider, useLabels, useTheme } from '../../src/theme';
import { defaultLabels, resolveLabels } from '../../src/theme/labels';
import type { Theme } from '../../src/theme/types';
import { captureTheme } from '../test-utils';

describe('NativeUIProvider configuration', () => {
  describe('GIVEN overrides for single steps of both scales', () => {
    describe('WHEN the theme is resolved', () => {
      it('THEN only the overridden steps change', () => {
        const theme = captureTheme({ spacing: { md: 18 }, borderRadius: { xl: 28 } });

        expect(theme.spacing.md).toBe(18);
        expect(theme.spacing.sm).toBe(8);
        expect(theme.borderRadius.xl).toBe(28);
        expect(theme.borderRadius.md).toBe(14);
      });
    });
  });

  describe('GIVEN a rounder xl radius', () => {
    describe('WHEN the theme is resolved', () => {
      it('THEN sheets that default to the xl radius follow it', () => {
        const theme = captureTheme({ borderRadius: { xl: 30 } });

        expect(theme.components.bottomSheet.radius).toBe(30);
        expect(theme.components.modal.radius).toBe(30);
      });
    });
  });

  describe('GIVEN an override of a single toast token', () => {
    describe('WHEN the theme is resolved', () => {
      it('THEN that token changes and its siblings keep their defaults', () => {
        const theme = captureTheme({ components: { toast: { offset: 120 } } });

        expect(theme.components.toast.offset).toBe(120);
        expect(theme.components.toast.durationMs).toBe(3000);
        expect(theme.components.bottomSheet.handleWidth).toBe(36);
      });
    });
  });

  describe('GIVEN no locale and a Polish locale', () => {
    describe('WHEN themes are resolved', () => {
      it('THEN the configured locale is exposed', () => {
        const fallback = captureTheme({});
        const polish = captureTheme({ locale: 'pl-PL' });

        expect(fallback.locale).toBe('en-US');
        expect(polish.locale).toBe('pl-PL');
      });
    });
  });

  describe('GIVEN partial Polish labels', () => {
    describe('WHEN the provider renders', () => {
      it('THEN overridden keys change and the rest stay English', () => {
        const captured: { labels: ReturnType<typeof useLabels> | null } = { labels: null };
        function Probe() {
          captured.labels = useLabels();

          return null;
        }

        render(
          <NativeUIProvider config={{ labels: { close: 'Zamknij' } }}>
            <Probe />
          </NativeUIProvider>,
        );

        expect(captured.labels?.close).toBe('Zamknij');
        expect(captured.labels?.cancel).toBe('Cancel');
      });
    });
  });

  describe('GIVEN a provider re-rendered with equal but new inline objects', () => {
    describe('WHEN it re-renders', () => {
      it('THEN memoised theme values are reused', () => {
        const seen: Theme[] = [];
        function Probe() {
          seen.push(useTheme());

          return null;
        }

        const renderWith = () => (
          <NativeUIProvider
            config={{ labels: { close: 'Zamknij' }, components: { toast: { offset: 90 } } }}
          >
            <Probe />
          </NativeUIProvider>
        );
        const { rerender } = render(renderWith());

        rerender(renderWith());

        expect(seen).toHaveLength(2);
        expect(seen[1]).toBe(seen[0]);
      });
    });
  });
});

describe('resolveLabels', () => {
  describe('GIVEN no overrides', () => {
    describe('WHEN labels are resolved', () => {
      it('THEN the default object is returned', () => {
        const labels = resolveLabels();

        expect(labels).toBe(defaultLabels);
      });
    });
  });

  describe('GIVEN overrides for one unit and the step template', () => {
    describe('WHEN they are used', () => {
      it('THEN both overrides apply', () => {
        const labels = resolveLabels({
          countdownUnits: { hours: ' godz.', minutes: 'm', seconds: 's' },
          stepOf: (current, total) => `Krok ${current} z ${total}`,
        });

        const step = labels.stepOf(2, 5);

        expect(labels.countdownUnits.hours).toBe(' godz.');
        expect(step).toBe('Krok 2 z 5');
      });
    });
  });
});
