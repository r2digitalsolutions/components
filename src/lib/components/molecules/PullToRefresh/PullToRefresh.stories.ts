import type { Meta, StoryObj } from '@storybook/svelte';
import PullToRefreshStory from './PullToRefreshStory.svelte';

const meta = {
	title: 'Molecules/PullToRefresh',
	component: PullToRefreshStory,
	tags: ['autodocs']
} satisfies Meta<typeof PullToRefreshStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
