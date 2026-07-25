import type { Meta, StoryObj } from '@storybook/svelte';
import DonutChartStory from './DonutChartStory.svelte';

const meta = {
	title: 'Molecules/DonutChart',
	component: DonutChartStory,
	tags: ['autodocs']
} satisfies Meta<typeof DonutChartStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
