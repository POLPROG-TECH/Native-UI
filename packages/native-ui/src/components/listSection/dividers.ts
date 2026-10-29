import React from 'react';

/**
 * Whether a hairline divider is drawn above the row at `index`. The first row
 * never gets one, and a row whose element sets `hideDivider` suppresses the
 * divider that would follow it.
 */
export function hasDividerBefore(rows: readonly React.ReactNode[], index: number): boolean {
  if (index === 0) {
    return false;
  }

  const previous = rows[index - 1];

  return !(React.isValidElement<{ hideDivider?: boolean }>(previous) && previous.props.hideDivider);
}
