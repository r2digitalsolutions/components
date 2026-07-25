import type { Meta, StoryObj } from '@storybook/svelte';
import NoteCardStory from './NoteCardStory.svelte';

const meta = {
	title: 'Molecules/NoteCard',
	component: NoteCardStory,
	tags: ['autodocs']
} satisfies Meta<typeof NoteCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
