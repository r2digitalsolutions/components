import type { Meta, StoryObj } from '@storybook/svelte';
import InfiniteScrollStory from './InfiniteScrollStory.svelte';

const meta = {
	title: 'Molecules/InfiniteScroll',
	component: InfiniteScrollStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['list', 'feed', 'grid', 'manual', 'both', 'error', 'chat', 'ended']
		},
		mode: {
			control: 'select',
			options: ['auto', 'manual', 'both']
		},
		rootMargin: { control: 'text' },
		pageSize: { control: { type: 'number', min: 2, max: 20 } },
		maxItems: { control: { type: 'number', min: 8, max: 80 } },
		delayMs: { control: { type: 'number', min: 0, max: 2000, step: 50 } }
	},
	args: {
		example: 'list',
		mode: 'auto',
		rootMargin: '200px',
		pageSize: 6,
		maxItems: 28,
		delayMs: 650
	}
} satisfies Meta<typeof InfiniteScrollStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'List',
	args: { example: 'list' }
};

export const Feed: Story = {
	args: { example: 'feed', pageSize: 4 }
};

export const Grid: Story = {
	args: { example: 'grid', pageSize: 6 }
};

export const Manual: Story = {
	name: 'Manual load more',
	args: { example: 'manual', mode: 'manual' }
};

export const AutoAndButton: Story = {
	name: 'Auto + button',
	args: { example: 'both', mode: 'both' }
};

export const ErrorRetry: Story = {
	name: 'Error + retry',
	args: { example: 'error' }
};

export const Chat: Story = {
	name: 'Chat / earlier messages',
	args: { example: 'chat', pageSize: 5, maxItems: 40 }
};

export const Ended: Story = {
	args: { example: 'ended' }
};

export const EagerPrefetch: Story = {
	name: 'Eager prefetch',
	args: { example: 'list', rootMargin: '480px', pageSize: 8 }
};
