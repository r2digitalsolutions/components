import type { Meta, StoryObj } from '@storybook/svelte';
import CommentComposerStory from './CommentComposerStory.svelte';

const meta = {
	title: 'Molecules/CommentComposer',
	component: CommentComposerStory,
	tags: ['autodocs']
} satisfies Meta<typeof CommentComposerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
