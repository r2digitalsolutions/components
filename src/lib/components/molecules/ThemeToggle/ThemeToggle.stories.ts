import type { Meta, StoryObj } from '@storybook/svelte';
import ThemeToggleStory from './ThemeToggleStory.svelte';

const meta = {
	title: 'Molecules/ThemeToggle',
	component: ThemeToggleStory,
	tags: ['autodocs'],
	argTypes: {
		mode: { control: 'select', options: ['toggle', 'select'] },
		size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'ghost', 'outline', 'destructive']
		}
	},
	args: {
		mode: 'toggle',
		size: 'md',
		variant: 'ghost'
	}
} satisfies Meta<typeof ThemeToggleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Select: Story = { args: { mode: 'select' } };
