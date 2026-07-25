import type { Meta, StoryObj } from '@storybook/svelte';
import CommentThreadStory from './CommentThreadStory.svelte';

const meta = {
	title: 'Organisms/CommentThread',
	component: CommentThreadStory,
	tags: ['autodocs']
} satisfies Meta<typeof CommentThreadStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
