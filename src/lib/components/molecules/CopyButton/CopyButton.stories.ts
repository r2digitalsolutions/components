import type { Meta, StoryObj } from '@storybook/svelte';
import CopyButtonStory from './CopyButtonStory.svelte';

const meta = {
	title: 'Molecules/CopyButton',
	component: CopyButtonStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
		variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'outline', 'destructive'] }
	},
	args: { size: 'sm', variant: 'secondary' }
} satisfies Meta<typeof CopyButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
