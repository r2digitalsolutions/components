import type { Meta, StoryObj } from '@storybook/svelte';
import CloseButtonStory from './CloseButtonStory.svelte';

const meta = {
	title: 'Atoms/CloseButton',
	component: CloseButtonStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'outline', 'destructive'] },
		size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
		rounded: { control: 'boolean' }
	},
	args: { variant: 'ghost', size: 'sm', rounded: false }
} satisfies Meta<typeof CloseButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Rounded: Story = {
	args: { rounded: true, variant: 'secondary' }
};
