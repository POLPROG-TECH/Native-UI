import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FieldLabel } from '../../src/components/FieldLabel';
import type { FieldLabelProps } from '../../src/components/FieldLabel';

const meta: Meta<FieldLabelProps> = {
  title: 'Components/FieldLabel',
  component: FieldLabel,
  parameters: {
    docs: {
      description: {
        component:
          '## FieldLabel\n\nShared uppercase label used above form fields (Input, TextArea, Select).',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<FieldLabelProps>;

export const Default: Story = {
  args: { label: 'Email address' },
};

export const Required: Story = {
  args: { label: 'Password', required: true },
};
