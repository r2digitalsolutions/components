import type { Meta, StoryObj } from '@storybook/svelte';
import PinInputStory from './PinInputStory.svelte';

const meta = {
	title: 'Molecules/PinInput',
	component: PinInputStory,
	tags: ['autodocs'],
	argTypes: {
		length: { control: 'number' },
		label: { control: 'text' },
		helperText: { control: 'text' },
		status: { control: 'select', options: ['default', 'error', 'success'] },
		disabled: { control: 'boolean' },
		type: { control: 'select', options: ['number', 'text', 'password'] }
	},
	args: {
		length: 4,
		label: 'Verification Code',
		helperText: 'Enter 4-digit code',
		status: 'default',
		disabled: false,
		type: 'number'
	}
} satisfies Meta<typeof PinInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FourDigits: Story = { args: { length: 4, label: 'PIN Code' } };
export const SixDigits: Story = { args: { length: 6, label: '2FA Authentication' } };
export const PasswordMasked: Story = { args: { length: 4, type: 'password', label: 'ATM PIN' } };
export const WithError: Story = { args: { length: 4, status: 'error', helperText: 'Incorrect verification code. Please try again.' } };
