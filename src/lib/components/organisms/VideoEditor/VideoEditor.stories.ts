import type { Meta, StoryObj } from '@storybook/svelte';
import VideoEditorStory from './VideoEditorStory.svelte';

const meta = {
	title: 'Organisms/VideoEditor',
	component: VideoEditorStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof VideoEditorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
