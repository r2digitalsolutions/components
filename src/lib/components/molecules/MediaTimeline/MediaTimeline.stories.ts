import type { Meta, StoryObj } from '@storybook/svelte';
import MediaTimelineStory from './MediaTimelineStory.svelte';

const meta = {
	title: 'Molecules/MediaTimeline',
	component: MediaTimelineStory,
	tags: ['autodocs']
} satisfies Meta<typeof MediaTimelineStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
