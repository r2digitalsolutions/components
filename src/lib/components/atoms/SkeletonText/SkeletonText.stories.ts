import type { Meta, StoryObj } from '@storybook/svelte';
import SkeletonTextStory from './SkeletonTextStory.svelte';

const meta = {
	title: 'Atoms/SkeletonText',
	component: SkeletonTextStory,
	tags: ['autodocs'],
	args: { lines: 4 }
} satisfies Meta<typeof SkeletonTextStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TwoLines: Story = { args: { lines: 2 } };
