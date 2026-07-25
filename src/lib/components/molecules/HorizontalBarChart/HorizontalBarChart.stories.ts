import type { Meta, StoryObj } from '@storybook/svelte';
import HorizontalBarChartStory from './HorizontalBarChartStory.svelte';

const meta = {
	title: 'Molecules/HorizontalBarChart',
	component: HorizontalBarChartStory,
	tags: ['autodocs']
} satisfies Meta<typeof HorizontalBarChartStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
