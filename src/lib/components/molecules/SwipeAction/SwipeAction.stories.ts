import type { Meta, StoryObj } from '@storybook/svelte';
import SwipeActionStory from './SwipeActionStory.svelte';

const meta = {
	title: 'Molecules/SwipeAction',
	component: SwipeActionStory,
	tags: ['autodocs']
} satisfies Meta<typeof SwipeActionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
