import type { Meta, StoryObj } from '@storybook/svelte';
import LatencyPillStory from './LatencyPillStory.svelte';

const meta = {
	title: 'Atoms/LatencyPill',
	component: LatencyPillStory,
	tags: ['autodocs']
} satisfies Meta<typeof LatencyPillStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
