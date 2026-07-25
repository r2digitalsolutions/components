import type { Meta, StoryObj } from '@storybook/svelte';
import ChartStory from './ChartStory.svelte';

const meta = {
	title: 'Molecules/Chart',
	component: ChartStory,
	tags: ['autodocs'],
	argTypes: {
		type: { control: 'select', options: ['line', 'bar', 'donut'] }
	},
	args: { type: 'bar' }
} satisfies Meta<typeof ChartStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bar: Story = {};
export const Line: Story = { args: { type: 'line' } };
export const Donut: Story = { args: { type: 'donut' } };
