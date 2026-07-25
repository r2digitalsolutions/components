import type { Meta, StoryObj } from '@storybook/svelte';
import PlaylistStory from './PlaylistStory.svelte';

const meta = {
	title: 'Molecules/Playlist',
	component: PlaylistStory,
	tags: ['autodocs']
} satisfies Meta<typeof PlaylistStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
