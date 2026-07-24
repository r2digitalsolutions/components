import type { Meta, StoryObj } from '@storybook/svelte';
import ChatBubbleStory from './ChatBubbleStory.svelte';

const meta = {
	title: 'Molecules/ChatBubble',
	component: ChatBubbleStory,
	tags: ['autodocs'],
	argTypes: {
		side: { control: 'select', options: ['left', 'right'] },
		content: { control: 'text' },
		author: { control: 'text' },
		time: { control: 'text' },
		status: { control: 'select', options: ['sent', 'delivered', 'read'] }
	},
	args: {
		side: 'left',
		content: 'Hey! How are you doing today?',
		author: 'Alice',
		time: '10:30 AM',
		status: 'read'
	}
} satisfies Meta<typeof ChatBubbleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Left: Story = {};
export const Right: Story = { args: { side: 'right', content: 'I\'m doing great, thanks! How about you?', author: 'You', status: 'read' } };
export const Sent: Story = { args: { side: 'right', status: 'sent', content: 'Message just sent' } };
export const Delivered: Story = { args: { side: 'right', status: 'delivered', content: 'Message delivered' } };
