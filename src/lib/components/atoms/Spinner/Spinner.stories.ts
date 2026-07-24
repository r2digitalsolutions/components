import type { Meta, StoryObj } from '@storybook/svelte';
import SpinnerStory from './SpinnerStory.svelte';

const meta = {
	title: 'Atoms/Spinner',
	component: SpinnerStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], description: 'Spinner size' },
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'white', 'current'],
			description: 'Color variant (white shows on dark bg)'
		},
		label: { control: 'text', description: 'Accessible label (aria-label)' }
	},
	args: { size: 'md', variant: 'primary', label: 'Loading...' }
} satisfies Meta<typeof SpinnerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { size: 'md', variant: 'primary' } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'xl' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const White: Story = { args: { variant: 'white', size: 'lg' } };
