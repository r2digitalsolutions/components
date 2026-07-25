import type { Meta, StoryObj } from '@storybook/svelte';
import FunnelChartStory from './FunnelChartStory.svelte';

const meta = {
	title: 'Molecules/FunnelChart',
	component: FunnelChartStory,
	tags: ['autodocs']
} satisfies Meta<typeof FunnelChartStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
