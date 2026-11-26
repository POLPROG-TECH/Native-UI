import { fireEvent, screen, within } from '@testing-library/react';
import { Banner } from '../../src/components/Banner';
import type { IconRenderProps } from '../../src/primitives/iconSlot';
import { captureTheme, renderWithTheme } from '../test-utils';

/*
 * Content, actions, icons and labels. The alert role and the button names as
 * a screen reader sees them are proven in `__tests__/native/Banner.test.tsx`.
 */
describe('Banner', () => {
  describe('GIVEN a banner with a title and a message', () => {
    describe('WHEN it is rendered', () => {
      it('THEN both texts sit inside one alert', () => {
        renderWithTheme(<Banner variant="error" title="Payment failed" message="Card declined." />);

        const alert = within(screen.getByRole('alert'));

        expect(alert.getByText('Payment failed')).toBeInTheDocument();
        expect(alert.getByText('Card declined.')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a banner with an action', () => {
    describe('WHEN the action is pressed', () => {
      it('THEN its handler runs', () => {
        const retry = jest.fn();
        renderWithTheme(
          <Banner message="Could not sync." action={{ label: 'Retry', onPress: retry }} />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

        expect(retry).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a dismissible banner', () => {
    describe('WHEN the close button is pressed', () => {
      it('THEN onDismiss is called and the button carries the library label', () => {
        const onDismiss = jest.fn();
        renderWithTheme(<Banner message="Saved." onDismiss={onDismiss} />);

        fireEvent.click(screen.getByRole('button', { name: captureTheme().labels.dismiss }));

        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN the app translates the dismiss label', () => {
      it('THEN the close button uses the translation', () => {
        renderWithTheme(<Banner message="Zapisano." onDismiss={() => {}} />, {
          config: { colorMode: 'light', labels: { dismiss: 'Odrzuć' } },
        });

        expect(screen.getByRole('button', { name: 'Odrzuć' })).toBeInTheDocument();
      });
    });

    describe('WHEN a per-instance label is passed', () => {
      it('THEN it wins over the library label', () => {
        renderWithTheme(
          <Banner message="Saved." onDismiss={() => {}} dismissAccessibilityLabel="Hide notice" />,
        );

        expect(screen.getByRole('button', { name: 'Hide notice' })).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a banner without onDismiss or action', () => {
    describe('WHEN it is rendered', () => {
      it('THEN it has no buttons', () => {
        renderWithTheme(<Banner message="Read only." />);

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a custom icon render function', () => {
    describe('WHEN a warning banner is rendered', () => {
      it('THEN the icon receives the readable warning color and the token size', () => {
        const icon = jest.fn((_props: IconRenderProps) => null);
        const theme = captureTheme();
        renderWithTheme(<Banner variant="warning" message="Low storage." icon={icon} />);

        expect(icon).toHaveBeenCalledWith({
          color: theme.colors.warningText,
          size: theme.components.banner.iconSize,
        });
      });
    });
  });

  describe('GIVEN the icon is turned off', () => {
    describe('WHEN the banner is rendered', () => {
      it('THEN only the text block is inside the alert', () => {
        renderWithTheme(<Banner message="Plain." icon={false} testID="banner" />);

        expect(screen.getByTestId('banner').children).toHaveLength(1);
      });
    });
  });

  describe('GIVEN token overrides for the banner', () => {
    describe('WHEN it is rendered', () => {
      it('THEN the overrides apply', () => {
        renderWithTheme(<Banner message="Dense." testID="banner" />, {
          config: { colorMode: 'light', components: { banner: { padding: 4, radius: 2 } } },
        });

        expect(screen.getByTestId('banner')).toHaveStyle({ padding: '4px', borderRadius: '2px' });
      });
    });
  });
});
