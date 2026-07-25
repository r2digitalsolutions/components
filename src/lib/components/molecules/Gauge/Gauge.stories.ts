import type { Meta, StoryObj } from '@storybook/svelte';
import GaugeStory from './GaugeStory.svelte';

const meta = {
	title: 'Molecules/Gauge',
	component: GaugeStory,
	tags: ['autodocs']
} satisfies Meta<typeof GaugeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
