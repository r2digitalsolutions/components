import type { Meta, StoryObj } from '@storybook/svelte';
import NotificationRowStory from './NotificationRowStory.svelte';

const meta = {
	title: 'Molecules/NotificationRow',
	component: NotificationRowStory,
	tags: ['autodocs']
} satisfies Meta<typeof NotificationRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
