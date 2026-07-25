import type { Meta, StoryObj } from '@storybook/svelte';
import RadarChartStory from './RadarChartStory.svelte';

const meta = {
	title: 'Molecules/RadarChart',
	component: RadarChartStory,
	tags: ['autodocs']
} satisfies Meta<typeof RadarChartStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
