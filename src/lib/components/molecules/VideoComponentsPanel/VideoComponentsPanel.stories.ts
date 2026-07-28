import type { Meta, StoryObj } from '@storybook/svelte';
import VideoComponentsPanelStory from './VideoComponentsPanelStory.svelte';

const meta = {
	title: 'Molecules/VideoComponentsPanel',
	component: VideoComponentsPanelStory,
	tags: ['autodocs']
} satisfies Meta<typeof VideoComponentsPanelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
