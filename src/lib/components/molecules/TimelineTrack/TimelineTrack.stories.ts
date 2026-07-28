import type { Meta, StoryObj } from '@storybook/svelte';
import TimelineTrackStory from './TimelineTrackStory.svelte';

const meta = {
	title: 'Molecules/TimelineTrack',
	component: TimelineTrackStory,
	tags: ['autodocs']
} satisfies Meta<typeof TimelineTrackStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
