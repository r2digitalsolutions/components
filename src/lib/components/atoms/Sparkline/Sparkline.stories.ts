import type { Meta, StoryObj } from '@storybook/svelte';
import SparklineStory from './SparklineStory.svelte';

const meta = {
	title: 'Atoms/Sparkline',
	component: SparklineStory,
	tags: ['autodocs'],
	argTypes: {
		tone: { control: 'select', options: ['brand', 'success', 'warning', 'error', 'neutral'] }
	},
	args: { tone: 'brand' }
} satisfies Meta<typeof SparklineStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
