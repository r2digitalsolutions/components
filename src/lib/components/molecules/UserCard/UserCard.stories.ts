import type { Meta, StoryObj } from '@storybook/svelte';
import UserCardStory from './UserCardStory.svelte';

const meta = {
	title: 'Molecules/UserCard',
	component: UserCardStory,
	tags: ['autodocs'],
	argTypes: {
		example: { control: 'select', options: ['gallery', 'single', 'team'] },
		variant: { control: 'select', options: ['profile', 'compact', 'cover'] }
	},
	args: { example: 'gallery', variant: 'profile' }
} satisfies Meta<typeof UserCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Gallery',
	args: { example: 'gallery' }
};

export const Cover: Story = {
	args: { example: 'single', variant: 'cover' }
};

export const CompactTeam: Story = {
	name: 'Compact team',
	args: { example: 'team' }
};
