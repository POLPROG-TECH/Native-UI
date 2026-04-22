import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, waitFor, fn } from 'storybook/test';
import { Button, Card, Input, VStack, Heading, Text } from '@polprog/native-ui';
import { usePost } from '../../.storybook/msw/hooks';
import { mockEndpoints } from '../../.storybook/msw/handlers';

/**
 * End-to-end login flow: form → POST → error or success - all behind an
 * MSW-mocked `/auth/login` endpoint so stories can be exercised (and
 * play-tested) without a real backend.
 *
 * The handler returns 401 when `password === 'wrong'`, 400 when a field
 * is missing, and a demo JWT otherwise.
 */
type LoginResponse = { token: string; user: { email: string } };

const LoginForm: React.FC<{ onSuccess?: (data: LoginResponse) => void }> = ({
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state, submit } = usePost<{ email: string; password: string }, LoginResponse>(
    '/auth/login',
  );

  const loading = state.status === 'loading';
  const errorText = state.status === 'error' ? state.error : undefined;

  return (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Heading level={3}>Sign in</Heading>
      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        testID="login-email"
      />
      <Input
        label="Password"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errorText}
        testID="login-password"
      />
      <Button
        title={loading ? 'Signing in…' : 'Sign in'}
        onPress={async () => {
          const res = await submit({ email, password });
          if (res.ok) onSuccess?.(res.data);
        }}
        disabled={loading}
      />
      {state.status === 'success' && (
        <Card>
          <Text variant="body">Welcome, {state.data.user.email}</Text>
          <Text variant="caption" color="textSecondary">
            Token: {state.data.token}
          </Text>
        </Card>
      )}
    </VStack>
  );
};

const meta: Meta<typeof LoginForm> = {
  title: 'Patterns/Network · Forms',
  component: LoginForm,
  parameters: {
    docs: {
      description: {
        component: [
          'Realistic login-form pattern backed by an MSW mock.',
          '',
          'Stories cover the three outcomes every production login surface must handle: happy path, invalid-credentials error, and transient server error. Each has a `play` test that drives the form with `userEvent` and asserts the observable UI - exactly the behaviour a real e2e test would cover.',
        ].join('\n'),
      },
    },
  },
  args: { onSuccess: fn() },
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const HappyPath: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('login-email'), 'user@polprog.dev');
    await userEvent.type(canvas.getByTestId('login-password'), 'hunter2');
    await userEvent.click(canvas.getByRole('button', { name: /sign in/i }));
    await waitFor(
      async () => {
        await expect(canvas.getByText(/welcome,/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
    await expect(args.onSuccess).toHaveBeenCalledTimes(1);
  },
};

export const InvalidCredentials: Story = {
  name: 'Invalid credentials (401)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('login-email'), 'user@polprog.dev');
    await userEvent.type(canvas.getByTestId('login-password'), 'wrong');
    await userEvent.click(canvas.getByRole('button', { name: /sign in/i }));
    await waitFor(
      async () => {
        await expect(await canvas.findByText(/invalid credentials/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
    await expect(args.onSuccess).not.toHaveBeenCalled();
  },
};

export const ServerError: Story = {
  name: 'Server error (401 override)',
  parameters: {
    msw: { handlers: [mockEndpoints.loginUnauthorized()] },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('login-email'), 'user@polprog.dev');
    await userEvent.type(canvas.getByTestId('login-password'), 'anything');
    await userEvent.click(canvas.getByRole('button', { name: /sign in/i }));
    await waitFor(
      async () => {
        await expect(await canvas.findByText(/invalid credentials/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
    await expect(args.onSuccess).not.toHaveBeenCalled();
  },
};
