import type { Meta, StoryObj } from '@storybook/svelte';
import HeatmapStory from './HeatmapStory.svelte';

const meta = {
	title: 'Molecules/Heatmap',
	component: HeatmapStory,
	tags: ['autodocs']
} satisfies Meta<typeof HeatmapStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
