import type { Meta, StoryObj } from '@storybook/svelte';
import MediaCardStory from './MediaCardStory.svelte';

const meta = {
	title: 'Molecules/MediaCard',
	component: MediaCardStory,
	tags: ['autodocs'],
	args: {
		title: 'Design systems that scale',
		description: 'Reusable atoms and molecules compose into full product surfaces.',
		actionLabel: 'Read more'
	}
} satisfies Meta<typeof MediaCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
