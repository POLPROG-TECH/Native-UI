import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Countdown } from '../../src/components/Countdown';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('Countdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2030-01-01T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the Countdown export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof Countdown;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_format_remaining_time_as_minutes_and_seconds_below_one_hour_by_default', () => {
    // GIVEN a deadline 90 seconds in the future
    const target = Date.now() + 90_000;

    // WHEN the component is rendered
    renderWithTheme(<Countdown to={target} />);

    // THEN the default auto-format produces "1m 30s"
    expect(screen.getByText('1m 30s')).toBeInTheDocument();
  });

  it('should_format_remaining_time_as_hours_and_minutes_at_or_above_one_hour_by_default', () => {
    // GIVEN a deadline 2 hours and 5 minutes in the future
    const target = Date.now() + (2 * 3600 + 5 * 60) * 1000;

    // WHEN the component is rendered with the default format
    renderWithTheme(<Countdown to={target} />);

    // THEN the default auto-format produces "2h 05m"
    expect(screen.getByText('2h 05m')).toBeInTheDocument();
  });

  it('should_honour_the_hms_format_when_explicitly_requested', () => {
    // GIVEN a 1-hour-2-minute-3-second deadline and the hms format
    const target = Date.now() + (3600 + 2 * 60 + 3) * 1000;

    // WHEN the component is rendered
    renderWithTheme(<Countdown to={target} format="hms" />);

    // THEN the output includes hours, minutes, and seconds
    expect(screen.getByText('1h 02m 03s')).toBeInTheDocument();
  });

  it('should_honour_the_hm_format_when_explicitly_requested', () => {
    // GIVEN a 2-hour-30-minute deadline and the hm format
    const target = Date.now() + (2 * 3600 + 30 * 60) * 1000;

    // WHEN the component is rendered
    renderWithTheme(<Countdown to={target} format="hm" />);

    // THEN the output includes hours and minutes
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
  });

  it('should_honour_the_ms_format_when_explicitly_requested', () => {
    // GIVEN a 5-minute-15-second deadline and the ms format
    const target = Date.now() + (5 * 60 + 15) * 1000;

    // WHEN the component is rendered
    renderWithTheme(<Countdown to={target} format="ms" />);

    // THEN the output includes minutes and seconds
    expect(screen.getByText('5m 15s')).toBeInTheDocument();
  });

  it('should_render_the_expired_label_when_the_deadline_has_already_passed', () => {
    // GIVEN a deadline 1 second in the past
    const target = Date.now() - 1000;

    // WHEN the component is rendered
    renderWithTheme(<Countdown to={target} expiredLabel="Done" />);

    // THEN the expired label is rendered
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('should_invoke_onExpire_once_when_the_deadline_is_reached', () => {
    // GIVEN a 2-second deadline and a mocked onExpire callback
    const target = Date.now() + 2000;
    const onExpire = jest.fn();
    renderWithTheme(<Countdown to={target} tickMs={1000} onExpire={onExpire} />);

    // WHEN enough time passes for the deadline to pass
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // THEN onExpire is invoked exactly once
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('should_apply_renderLabel_transform_to_the_formatted_output', () => {
    // GIVEN a 1-minute deadline and a renderLabel that prefixes "Ends in "
    const target = Date.now() + 60_000;

    // WHEN the component is rendered
    renderWithTheme(
      <Countdown to={target} renderLabel={(s) => `Ends in ${s}`} />,
    );

    // THEN the output is wrapped with the transform
    expect(screen.getByText('Ends in 1m 00s')).toBeInTheDocument();
  });

  it('should_accept_an_ISO_string_target', () => {
    // GIVEN a deadline expressed as an ISO string 30 seconds in the future
    const target = new Date(Date.now() + 30_000).toISOString();

    // WHEN the component is rendered
    renderWithTheme(<Countdown to={target} format="ms" />);

    // THEN the formatted output matches the string input
    expect(screen.getByText('0m 30s')).toBeInTheDocument();
  });

  it('should_accept_a_Date_instance_target', () => {
    // GIVEN a deadline expressed as a Date instance 45 seconds in the future
    const target = new Date(Date.now() + 45_000);

    // WHEN the component is rendered
    renderWithTheme(<Countdown to={target} format="ms" />);

    // THEN the formatted output matches the date input
    expect(screen.getByText('0m 45s')).toBeInTheDocument();
  });
});
