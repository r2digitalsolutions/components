import type { Meta, StoryObj } from '@storybook/svelte';
import StatCardStory from './StatCardStory.svelte';

const meta = {
	title: 'Molecules/StatCard',
	component: StatCardStory,
	tags: ['autodocs'],
	argTypes: {
		trend: { control: 'select', options: ['up', 'down', 'neutral'] }
	},
	args: {
		label: 'Revenue',
		value: '$48.2k',
		delta: '+12.4%',
		trend: 'up',
		badge: 'Live'
	}
} satisfies Meta<typeof StatCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
