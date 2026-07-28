import type { Meta, StoryObj } from '@storybook/svelte';
import VideoTrackHeaderStory from './VideoTrackHeaderStory.svelte';

const meta = {
	title: 'Molecules/VideoTrackHeader',
	component: VideoTrackHeaderStory,
	tags: ['autodocs']
} satisfies Meta<typeof VideoTrackHeaderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
