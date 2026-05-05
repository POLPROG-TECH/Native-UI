import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FieldError } from '../../src/components/FieldError';
import type { FieldErrorProps } from '../../src/components/FieldError';

const meta: Meta<FieldErrorProps> = {
  title: 'Components/FieldError',
  component: FieldError,
  parameters: {
    docs: {
      description: {
        component:
          '## FieldError\n\nShared error message displayed below form fields (Input, TextArea, Select).',
      },
    },
  },
  argTypes: {
    error: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<FieldErrorProps>;

export const Default: Story = {
  args: { error: 'This field is required.' },
};
