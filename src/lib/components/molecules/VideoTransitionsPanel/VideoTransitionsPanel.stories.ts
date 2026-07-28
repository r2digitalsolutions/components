import type { Meta, StoryObj } from '@storybook/svelte';
import VideoTransitionsPanelStory from './VideoTransitionsPanelStory.svelte';

const meta = {
	title: 'Molecules/VideoTransitionsPanel',
	component: VideoTransitionsPanelStory,
	tags: ['autodocs']
} satisfies Meta<typeof VideoTransitionsPanelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
