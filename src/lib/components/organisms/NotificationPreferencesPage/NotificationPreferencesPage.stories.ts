import type { Meta, StoryObj } from '@storybook/svelte';
import NotificationPreferencesPageStory from './NotificationPreferencesPageStory.svelte';

const meta = {
	title: 'Organisms/NotificationPreferencesPage',
	component: NotificationPreferencesPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof NotificationPreferencesPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
