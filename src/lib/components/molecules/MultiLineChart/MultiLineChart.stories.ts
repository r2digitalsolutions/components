import type { Meta, StoryObj } from '@storybook/svelte';
import MultiLineChartStory from './MultiLineChartStory.svelte';

const meta = {
	title: 'Molecules/MultiLineChart',
	component: MultiLineChartStory,
	tags: ['autodocs']
} satisfies Meta<typeof MultiLineChartStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
