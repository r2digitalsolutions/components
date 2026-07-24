import type { Meta, StoryObj } from '@storybook/svelte';
import StatStory from './StatStory.svelte';

const meta = {
	title: 'Atoms/Stat',
	component: StatStory,
	tags: ['autodocs'],
	argTypes: {
		trend: { control: 'select', options: ['up', 'down', 'neutral'] }
	},
	args: {
		label: 'Revenue',
		value: '$48.2k',
		delta: '+12.4%',
		trend: 'up',
		description: 'vs last month'
	}
} satisfies Meta<typeof StatStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Down: Story = { args: { trend: 'down', delta: '-3.1%' } };
