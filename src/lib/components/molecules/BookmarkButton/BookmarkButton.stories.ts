import type { Meta, StoryObj } from '@storybook/svelte';
import BookmarkButtonStory from './BookmarkButtonStory.svelte';

const meta = {
	title: 'Molecules/BookmarkButton',
	component: BookmarkButtonStory,
	tags: ['autodocs']
} satisfies Meta<typeof BookmarkButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
