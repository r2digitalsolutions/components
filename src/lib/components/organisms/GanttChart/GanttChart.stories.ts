import type { Meta, StoryObj } from '@storybook/svelte';
import GanttChartStory from './GanttChartStory.svelte';

const meta = {
	title: 'Organisms/GanttChart',
	component: GanttChartStory,
	tags: ['autodocs']
} satisfies Meta<typeof GanttChartStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
