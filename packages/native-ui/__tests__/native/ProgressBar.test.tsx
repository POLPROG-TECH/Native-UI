import { ProgressBar } from '../../src/components/ProgressBar';
import { Spinner } from '../../src/components/Spinner';
import { captureTheme, renderWithTheme, screen } from './test-utils';

describe('ProgressBar (real React Native renderer)', () => {
  describe('GIVEN a bar at 40 percent', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN it is a named progress bar with a whole-percent value', async () => {
        await renderWithTheme(<ProgressBar value={0.4} accessibilityLabel="Upload" />);
        const bar = screen.getByLabelText('Upload');

        expect(bar).toHaveProp('accessibilityRole', 'progressbar');
        expect(bar).toHaveAccessibilityValue({ min: 0, max: 100, now: 40 });
      });
    });
  });

  describe('GIVEN a value above 1', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN the announced value is capped at 100', async () => {
        await renderWithTheme(<ProgressBar value={3} accessibilityLabel="Upload" />);

        expect(screen.getByLabelText('Upload')).toHaveAccessibilityValue({ now: 100 });
      });
    });
  });
});

describe('Spinner (real React Native renderer)', () => {
  describe('GIVEN a spinner without a label', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN it is named by the library loading label', async () => {
        const { loadingIndicator } = (await captureTheme()).labels;
        await renderWithTheme(<Spinner />);

        expect(screen.getByLabelText(loadingIndicator)).toHaveProp(
          'accessibilityRole',
          'progressbar',
        );
      });
    });
  });

  describe('GIVEN a spinner with a visible label', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN the label names it', async () => {
        await renderWithTheme(<Spinner label="Syncing" />);

        expect(screen.getByLabelText('Syncing')).toBeOnTheScreen();
      });
    });
  });
});
