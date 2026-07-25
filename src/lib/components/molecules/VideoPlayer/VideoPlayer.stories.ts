import type { Meta, StoryObj } from '@storybook/svelte';
import VideoPlayerStory from './VideoPlayerStory.svelte';

const meta = {
	title: 'Molecules/VideoPlayer',
	component: VideoPlayerStory,
	tags: ['autodocs']
} satisfies Meta<typeof VideoPlayerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
