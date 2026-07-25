import type { Meta, StoryObj } from '@storybook/svelte';
import UserCardStory from './UserCardStory.svelte';

const meta = {
	title: 'Molecules/UserCard',
	component: UserCardStory,
	tags: ['autodocs'],
	args: { name: 'Ada Lovelace', role: 'Staff Engineer', badge: 'Admin' }
} satisfies Meta<typeof UserCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
