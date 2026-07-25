import type { Meta, StoryObj } from '@storybook/svelte';
import AreaLineChartStory from './AreaLineChartStory.svelte';

const meta = {
	title: 'Molecules/AreaLineChart',
	component: AreaLineChartStory,
	tags: ['autodocs']
} satisfies Meta<typeof AreaLineChartStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
