import type { Meta, StoryObj } from '@storybook/svelte';
import AnnouncementStory from './AnnouncementStory.svelte';

const meta = {
	title: 'Molecules/Announcement',
	component: AnnouncementStory,
	tags: ['autodocs'],
	argTypes: {
		tone: { control: 'select', options: ['brand', 'neutral', 'warning', 'success'] },
		badge: { control: 'text' },
		sticky: { control: 'boolean' }
	},
	args: { tone: 'brand', badge: 'New', sticky: false }
} satisfies Meta<typeof AnnouncementStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Warning: Story = { args: { tone: 'warning', badge: 'Maintenance' } };
export const Neutral: Story = { args: { tone: 'neutral', badge: '' } };
