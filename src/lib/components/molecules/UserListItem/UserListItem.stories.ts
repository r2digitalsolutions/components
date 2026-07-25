import type { Meta, StoryObj } from '@storybook/svelte';
import UserListItemStory from './UserListItemStory.svelte';

const meta = {
	title: 'Molecules/UserListItem',
	component: UserListItemStory,
	tags: ['autodocs']
} satisfies Meta<typeof UserListItemStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
