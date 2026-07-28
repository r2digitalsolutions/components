import type { Meta, StoryObj } from '@storybook/svelte';
import VideoAnimationsPanelStory from './VideoAnimationsPanelStory.svelte';

const meta = {
	title: 'Molecules/VideoAnimationsPanel',
	component: VideoAnimationsPanelStory,
	tags: ['autodocs']
} satisfies Meta<typeof VideoAnimationsPanelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
