import type { Meta, StoryObj } from '@storybook/svelte';
import CurrencyInputStory from './CurrencyInputStory.svelte';

const meta = {
	title: 'Molecules/CurrencyInput',
	component: CurrencyInputStory,
	tags: ['autodocs'],
	argTypes: {
		currency: { control: 'text' },
		locale: { control: 'text' },
		label: { control: 'text' },
		disabled: { control: 'boolean' },
		status: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
		helperText: { control: 'text' },
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		min: { control: 'number' },
		max: { control: 'number' }
	},
	args: {
		currency: 'USD',
		locale: 'en-US',
		label: 'Amount',
		disabled: false,
		status: 'default',
		size: 'md'
	}
} satisfies Meta<typeof CurrencyInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Euro: Story = {
	args: { currency: 'EUR', locale: 'de-DE', label: 'Betrag' }
};

export const WithLimits: Story = {
	args: { min: 0, max: 10000, helperText: 'Max $10,000' }
};
