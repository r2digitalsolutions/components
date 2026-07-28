import type { Meta, StoryObj } from '@storybook/svelte';
import AudioEditorTemplateStory from './AudioEditorTemplateStory.svelte';

const meta = {
	title: 'Templates/AudioEditorTemplate',
	component: AudioEditorTemplateStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof AudioEditorTemplateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
