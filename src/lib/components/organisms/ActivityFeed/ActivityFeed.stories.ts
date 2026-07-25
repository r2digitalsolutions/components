import type { Meta, StoryObj } from '@storybook/svelte';
import ActivityFeedStory from './ActivityFeedStory.svelte';

const meta = {
	title: 'Organisms/ActivityFeed',
	component: ActivityFeedStory,
	tags: ['autodocs']
} satisfies Meta<typeof ActivityFeedStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
