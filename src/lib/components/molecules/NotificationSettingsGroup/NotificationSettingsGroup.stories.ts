import type { Meta, StoryObj } from '@storybook/svelte';
import NotificationSettingsGroupStory from './NotificationSettingsGroupStory.svelte';

const meta = {
	title: 'Molecules/NotificationSettingsGroup',
	component: NotificationSettingsGroupStory,
	tags: ['autodocs']
} satisfies Meta<typeof NotificationSettingsGroupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
