import type { Meta, StoryObj } from '@storybook/svelte';
import MetricGridStory from './MetricGridStory.svelte';

const meta = {
	title: 'Molecules/MetricGrid',
	component: MetricGridStory,
	tags: ['autodocs']
} satisfies Meta<typeof MetricGridStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
