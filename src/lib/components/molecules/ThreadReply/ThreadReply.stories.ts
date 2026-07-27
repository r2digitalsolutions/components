import type { Meta, StoryObj } from '@storybook/svelte';
import ThreadReplyStory from './ThreadReplyStory.svelte';

const meta = {
	title: 'Molecules/ThreadReply',
	component: ThreadReplyStory,
	tags: ['autodocs']
} satisfies Meta<typeof ThreadReplyStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
