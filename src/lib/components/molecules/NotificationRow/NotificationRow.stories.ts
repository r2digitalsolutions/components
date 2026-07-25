import type { Meta, StoryObj } from '@storybook/svelte';
import NotificationRowStory from './NotificationRowStory.svelte';

const meta = {
	title: 'Molecules/NotificationRow',
	component: NotificationRowStory,
	tags: ['autodocs'],
	argTypes: {
		example: { control: 'select', options: ['inbox', 'types', 'withActions'] }
	},
	args: { example: 'inbox' }
} satisfies Meta<typeof NotificationRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Inbox',
	args: { example: 'inbox' }
};

export const Types: Story = {
	args: { example: 'types' }
};

export const WithActions: Story = {
	name: 'With actions',
	args: { example: 'withActions' }
};
