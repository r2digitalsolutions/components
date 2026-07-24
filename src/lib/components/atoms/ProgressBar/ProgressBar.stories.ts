import type { Meta, StoryObj } from '@storybook/svelte';
import ProgressBarStory from './ProgressBarStory.svelte';

const meta = {
	title: 'Atoms/ProgressBar',
	component: ProgressBarStory,
	tags: ['autodocs'],
	argTypes: {
		value: { control: 'number' },
		max: { control: 'number' },
		indeterminate: { control: 'boolean' },
		variant: { control: 'select', options: ['primary', 'success', 'warning', 'error', 'info'] },
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		showValue: { control: 'boolean' },
		label: { control: 'text' }
	},
	args: {
		value: 65,
		max: 100,
		indeterminate: false,
		variant: 'primary',
		size: 'md',
		showValue: true,
		label: 'Downloading update'
	}
} satisfies Meta<typeof ProgressBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { value: 45, label: 'Storage Used' } };
export const Success: Story = { args: { value: 100, variant: 'success', label: 'Upload Complete' } };
export const Warning: Story = { args: { value: 85, variant: 'warning', label: 'Disk Capacity High' } };
export const Error: Story = { args: { value: 95, variant: 'error', label: 'Memory Critical' } };
export const Indeterminate: Story = { args: { indeterminate: true, label: 'Processing data...' } };
