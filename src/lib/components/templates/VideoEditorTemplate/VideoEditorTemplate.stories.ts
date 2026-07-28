import type { Meta, StoryObj } from '@storybook/svelte';
import VideoEditorTemplateStory from './VideoEditorTemplateStory.svelte';

const meta = {
	title: 'Templates/VideoEditorTemplate',
	component: VideoEditorTemplateStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof VideoEditorTemplateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
