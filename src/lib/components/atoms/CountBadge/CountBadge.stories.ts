import type { Meta, StoryObj } from '@storybook/svelte';
import CountBadgeStory from './CountBadgeStory.svelte';

const meta = {
	title: 'Atoms/CountBadge',
	component: CountBadgeStory,
	tags: ['autodocs'],
	argTypes: {
		count: { control: 'number' },
		hideZero: { control: 'boolean' },
		max: { control: 'number' },
		variant: {
			control: 'select',
			options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info']
		}
	},
	args: { count: 3, hideZero: true, max: 99, variant: 'error' }
} satisfies Meta<typeof CountBadgeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Overflow: Story = {
	args: { count: 150 }
};
