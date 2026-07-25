import type { Meta, StoryObj } from '@storybook/svelte';
import StackedBarChartStory from './StackedBarChartStory.svelte';

const meta = {
	title: 'Molecules/StackedBarChart',
	component: StackedBarChartStory,
	tags: ['autodocs']
} satisfies Meta<typeof StackedBarChartStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
