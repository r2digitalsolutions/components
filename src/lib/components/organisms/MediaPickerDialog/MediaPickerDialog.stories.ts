import type { Meta, StoryObj } from '@storybook/svelte';
import MediaPickerDialogStory from './MediaPickerDialogStory.svelte';

const meta = {
	title: 'Organisms/MediaPickerDialog',
	component: MediaPickerDialogStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof MediaPickerDialogStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
