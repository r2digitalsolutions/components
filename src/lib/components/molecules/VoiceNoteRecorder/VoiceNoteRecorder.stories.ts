import type { Meta, StoryObj } from '@storybook/svelte';
import VoiceNoteRecorderStory from './VoiceNoteRecorderStory.svelte';

const meta = {
	title: 'Molecules/VoiceNoteRecorder',
	component: VoiceNoteRecorderStory,
	tags: ['autodocs']
} satisfies Meta<typeof VoiceNoteRecorderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
