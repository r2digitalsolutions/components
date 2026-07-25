import type { Meta, StoryObj } from '@storybook/svelte';
import BarChartStory from './BarChartStory.svelte';

const meta = {
	title: 'Molecules/BarChart',
	component: BarChartStory,
	tags: ['autodocs']
} satisfies Meta<typeof BarChartStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
