import type { Meta, StoryObj } from '@storybook/svelte';
import AudioEditorStory from './AudioEditorStory.svelte';

const meta = {
	title: 'Organisms/AudioEditor',
	component: AudioEditorStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof AudioEditorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
