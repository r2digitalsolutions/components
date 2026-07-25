import type { Meta, StoryObj } from '@storybook/svelte';
import ScatterChartStory from './ScatterChartStory.svelte';

const meta = {
	title: 'Molecules/ScatterChart',
	component: ScatterChartStory,
	tags: ['autodocs']
} satisfies Meta<typeof ScatterChartStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
