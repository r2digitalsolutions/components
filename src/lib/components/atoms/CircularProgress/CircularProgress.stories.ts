import type { Meta, StoryObj } from '@storybook/svelte';
import CircularProgressStory from './CircularProgressStory.svelte';

const meta = {
	title: 'Atoms/CircularProgress',
	component: CircularProgressStory,
	tags: ['autodocs'],
	argTypes: {
		value: { control: { type: 'range', min: 0, max: 100 } },
		max: { control: 'number' },
		size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
		indeterminate: { control: 'boolean' },
		variant: { control: 'select', options: ['primary', 'success', 'warning', 'error', 'info'] },
		showValue: { control: 'boolean' },
		label: { control: 'text' }
	},
	args: {
		value: 65,
		max: 100,
		size: 'md',
		indeterminate: false,
		variant: 'primary',
		showValue: true
	}
} satisfies Meta<typeof CircularProgressStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Indeterminate: Story = {
	args: { indeterminate: true, label: 'Loading…' }
};

export const Success: Story = {
	args: { value: 100, variant: 'success', showValue: true, label: 'Complete' }
};

export const Large: Story = {
	args: { size: 'xl', value: 42, showValue: true, label: 'Upload' }
};
