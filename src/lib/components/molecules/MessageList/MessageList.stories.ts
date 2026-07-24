import type { Meta, StoryObj } from '@storybook/svelte';
import MessageListStory from './MessageListStory.svelte';

const meta = {
	title: 'Molecules/MessageList',
	component: MessageListStory,
	tags: ['autodocs'],
	args: {}
} satisfies Meta<typeof MessageListStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
