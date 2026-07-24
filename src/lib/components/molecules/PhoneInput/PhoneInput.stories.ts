import type { Meta, StoryObj } from '@storybook/svelte';
import PhoneInputStory from './PhoneInputStory.svelte';

const meta = {
	title: 'Molecules/PhoneInput',
	component: PhoneInputStory,
	tags: ['autodocs'],
	argTypes: {
		countryCode: { control: 'text' },
		label: { control: 'text' },
		disabled: { control: 'boolean' },
		status: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
		helperText: { control: 'text' },
		size: { control: 'select', options: ['sm', 'md', 'lg'] }
	},
	args: {
		countryCode: '+1',
		label: 'Phone Number',
		disabled: false,
		status: 'default',
		size: 'md'
	}
} satisfies Meta<typeof PhoneInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
	args: { status: 'error', helperText: 'Invalid phone number' }
};

export const MX: Story = {
	args: { countryCode: '+52', label: 'Teléfono' }
};
