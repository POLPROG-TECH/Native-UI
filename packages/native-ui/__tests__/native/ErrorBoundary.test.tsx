import { Text } from 'react-native';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';
import { captureTheme, renderWithTheme, screen, userEvent } from './test-utils';

let shouldThrow = true;

function Flaky() {
  if (shouldThrow) {
    throw new Error('Request failed');
  }

  return <Text>Loaded</Text>;
}

describe('ErrorBoundary (real React Native renderer)', () => {
  beforeEach(() => {
    shouldThrow = true;
    /* React logs the caught error; the test asserts on the fallback instead. */
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GIVEN a child that throws while rendering', () => {
    describe('WHEN the boundary catches the error', () => {
      it('THEN the library message and a retry button are shown', async () => {
        const { errorMessage, errorRetry } = (await captureTheme()).labels;
        await renderWithTheme(
          <ErrorBoundary>
            <Flaky />
          </ErrorBoundary>,
        );

        expect(screen.getByText(errorMessage)).toBeOnTheScreen();
        expect(screen.getByRole('button', { name: errorRetry })).toBeOnTheScreen();
      });
    });

    describe('WHEN the user presses retry after the cause is gone', () => {
      it('THEN the child renders again', async () => {
        const { errorRetry } = (await captureTheme()).labels;
        const user = userEvent.setup();
        await renderWithTheme(
          <ErrorBoundary>
            <Flaky />
          </ErrorBoundary>,
        );
        shouldThrow = false;

        await user.press(screen.getByRole('button', { name: errorRetry }));

        expect(screen.getByText('Loaded')).toBeOnTheScreen();
      });
    });
  });
});
