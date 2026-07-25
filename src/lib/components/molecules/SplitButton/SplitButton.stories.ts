import type { Meta, StoryObj } from '@storybook/svelte';
import SplitButtonStory from './SplitButtonStory.svelte';

const meta = {
	title: 'Molecules/SplitButton',
	component: SplitButtonStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'outline', 'destructive'] },
		size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] }
	},
	args: { variant: 'primary', size: 'md' }
} satisfies Meta<typeof SplitButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
