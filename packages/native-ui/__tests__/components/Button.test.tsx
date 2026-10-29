import { act, fireEvent, screen } from '@testing-library/react';
import { Button } from '../../src/components/Button';
import { renderWithTheme } from '../test-utils';

describe('Button', () => {
  describe('GIVEN the Button export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a React.memo exotic component', () => {
        expect(Button).toHaveProperty('$$typeof', Symbol.for('react.memo'));
      });
    });
  });

  describe('GIVEN a Button configured with a "Test" title and a noop onPress', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the title text appears in the document', () => {
        renderWithTheme(<Button title="Test" onPress={() => {}} />);

        expect(screen.getByText('Test')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Button configured with the "Submit" title', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the "Submit" text is present in the document', () => {
        renderWithTheme(<Button title="Submit" onPress={() => {}} />);

        expect(screen.getByText('Submit')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN the full list of Button variants', () => {
    describe('WHEN each variant is rendered with its name as the title', () => {
      it('THEN every variant renders its title without crashing', () => {
        const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;

        const renderAll = () => {
          variants.forEach((variant) => {
            const { unmount } = renderWithTheme(
              <Button title={variant} variant={variant} onPress={() => {}} />,
            );
            expect(screen.getByText(variant)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });

  describe('GIVEN the full list of Button sizes', () => {
    describe('WHEN each size is rendered with a matching title', () => {
      it('THEN every size renders its title without crashing', () => {
        const sizes = ['sm', 'md', 'lg'] as const;

        const renderAll = () => {
          sizes.forEach((size) => {
            const { unmount } = renderWithTheme(
              <Button title={`Size ${size}`} size={size} onPress={() => {}} />,
            );
            expect(screen.getByText(`Size ${size}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });

  describe('GIVEN a Button configured with loading enabled', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the title stays mounted for a stable width but is invisible, and a progressbar is shown', () => {
        renderWithTheme(<Button title="Loading" onPress={() => {}} loading />);

        expect(screen.getByText('Loading').parentElement).toHaveStyle({ opacity: 0 });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Button configured with a title and noop onPress', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN it exposes the button accessibility role', () => {
        renderWithTheme(<Button title="Test" onPress={() => {}} />);

        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Button configured with a "Save Changes" title', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the aria-label matches the title text', () => {
        renderWithTheme(<Button title="Save Changes" onPress={() => {}} />);

        expect(screen.getByLabelText('Save Changes')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Button configured with disabled={true}', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN aria-disabled is set to "true"', () => {
        renderWithTheme(<Button title="Test" onPress={() => {}} disabled />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('GIVEN a Button configured with loading={true}', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN aria-disabled is set to "true" on the loading button', () => {
        renderWithTheme(<Button title="Test" onPress={() => {}} loading />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('GIVEN a Button configured with the fullWidth prop', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the title text appears in the document', () => {
        renderWithTheme(<Button title="Full" onPress={() => {}} fullWidth />);

        expect(screen.getByText('Full')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Button configured with a span icon and a "With Icon" title', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN both the icon and the title text are present in the document', () => {
        const icon = <span data-testid="icon">★</span>;

        renderWithTheme(<Button title="With Icon" onPress={() => {}} icon={icon} />);

        expect(screen.getByTestId('icon')).toBeInTheDocument();
        expect(screen.getByText('With Icon')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Button with both `renderLeft` and `renderRight` render props', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN both custom slots and the title are present', () => {
        renderWithTheme(
          <Button
            title="Go"
            onPress={() => {}}
            renderLeft={() => <span data-testid="left">L</span>}
            renderRight={() => <span data-testid="right">R</span>}
          />,
        );

        expect(screen.getByTestId('left')).toBeInTheDocument();
        expect(screen.getByTestId('right')).toBeInTheDocument();
        expect(screen.getByText('Go')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Button configured with a semantic glow accent', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN rendering does not throw', () => {
        const renderGlow = () =>
          renderWithTheme(<Button title="Shiny" onPress={() => {}} glow="primary" />);

        expect(renderGlow).not.toThrow();
      });
    });
  });

  describe('GIVEN a Button with an explicit hex glow color', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the title text still appears and no error occurs', () => {
        renderWithTheme(<Button title="Glow" onPress={() => {}} glow="#ff00ff" />);

        expect(screen.getByText('Glow')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Button with an onPress spy', () => {
    describe('WHEN the button is clicked', () => {
      it('THEN onPress is fired exactly once', () => {
        const onPress = jest.fn();

        renderWithTheme(<Button title="Click" onPress={onPress} />);
        fireEvent.click(screen.getByRole('button'));

        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a Button with onPress spy under fake timers', () => {
    describe('WHEN the button is clicked twice in rapid succession', () => {
      it('THEN only the first click is forwarded to onPress', () => {
        jest.useFakeTimers();
        try {
          const onPress = jest.fn();
          renderWithTheme(<Button title="Click" onPress={onPress} />);
          const button = screen.getByRole('button');

          fireEvent.click(button);
          fireEvent.click(button);

          expect(onPress).toHaveBeenCalledTimes(1);

          /* AND after the re-press window elapses the next click is accepted */
          act(() => {
            jest.advanceTimersByTime(401);
          });
          fireEvent.click(button);
          expect(onPress).toHaveBeenCalledTimes(2);
        } finally {
          jest.useRealTimers();
        }
      });
    });
  });
});
