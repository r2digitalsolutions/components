import type { Meta, StoryObj } from '@storybook/svelte';
import ProfilePageStory from './ProfilePageStory.svelte';

const meta = {
	title: 'Organisms/ProfilePage',
	component: ProfilePageStory,
	tags: ['autodocs'],
	args: {
		name: 'Ada Lovelace',
		email: 'ada@example.com'
	}
} satisfies Meta<typeof ProfilePageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
