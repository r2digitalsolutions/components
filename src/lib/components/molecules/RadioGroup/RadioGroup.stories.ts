import type { Meta, StoryObj } from '@storybook/svelte';
import RadioGroupStory from './RadioGroupStory.svelte';

const meta = {
	title: 'Molecules/RadioGroup',
	component: RadioGroupStory,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text', description: 'Group label' },
		orientation: { control: 'radio', options: ['vertical', 'horizontal'], description: 'Layout orientation' },
		size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'Radio size' },
		status: { control: 'select', options: ['default', 'error', 'warning'] },
		helperText: { control: 'text' },
		disabled: { control: 'boolean' },
		required: { control: 'boolean' }
	},
	args: {
		label: 'Select Plan',
		orientation: 'vertical',
		size: 'md',
		status: 'default',
		helperText: '',
		disabled: false,
		required: false
	}
} satisfies Meta<typeof RadioGroupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = { args: { label: 'Subscription Plan' } };
export const Horizontal: Story = {
	args: {
		label: 'Notification Frequency',
		orientation: 'horizontal',
		options: [
			{ value: 'daily', label: 'Daily' },
			{ value: 'weekly', label: 'Weekly' },
			{ value: 'monthly', label: 'Monthly' }
		]
	}
};
export const WithError: Story = {
	args: { label: 'Payment Method', status: 'error', helperText: 'Please select a payment method.' }
};
