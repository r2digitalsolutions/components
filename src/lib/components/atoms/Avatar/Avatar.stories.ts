import type { Meta, StoryObj } from '@storybook/svelte';
import AvatarStory from './AvatarStory.svelte';

const meta = {
	title: 'Atoms/Avatar',
	component: AvatarStory,
	tags: ['autodocs'],
	argTypes: {
		name: { control: 'text', description: 'Full name (used for initials and hash color)' },
		src: { control: 'text', description: 'Image URL (falls back to initials if broken)' },
		alt: { control: 'text', description: 'Alt text for the image' },
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
			description: 'Avatar size'
		},
		status: {
			control: 'select',
			options: [null, 'online', 'offline', 'busy', 'away'],
			description: 'Status indicator dot'
		}
	},
	args: { name: 'Rafael González', size: 'md', status: null }
} satisfies Meta<typeof AvatarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInitials: Story = {
	args: { name: 'Rafael González', size: 'lg' }
};

export const Online: Story = {
	args: { name: 'Ana Martínez', status: 'online', size: 'lg' }
};

export const Busy: Story = {
	args: { name: 'Carlos López', status: 'busy', size: 'lg' }
};

export const Away: Story = {
	args: { name: 'Elena Ruiz', status: 'away', size: 'lg' }
};

export const Offline: Story = {
	args: { name: 'Pedro Sánchez', status: 'offline', size: 'lg' }
};

export const ExtraLarge: Story = {
	args: { name: 'María Torres', size: '2xl' }
};
