import type { Meta, StoryObj } from '@storybook/svelte';
import InfiniteScrollStory from './InfiniteScrollStory.svelte';

const meta = {
	title: 'Molecules/InfiniteScroll',
	component: InfiniteScrollStory,
	tags: ['autodocs']
} satisfies Meta<typeof InfiniteScrollStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
