import type { Meta, StoryObj } from '@storybook/svelte';
import PlaylistStory from './PlaylistStory.svelte';

const meta = {
	title: 'Molecules/Playlist',
	component: PlaylistStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['player', 'compact', 'minimal', 'empty', 'likes']
		},
		density: {
			control: 'select',
			options: ['comfortable', 'compact', 'minimal']
		},
		showAlbum: { control: 'boolean' },
		showHeader: { control: 'boolean' }
	},
	args: {
		example: 'player',
		density: 'comfortable',
		showAlbum: false,
		showHeader: true
	}
} satisfies Meta<typeof PlaylistStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Player list',
	args: { example: 'player' }
};

export const Compact: Story = {
	args: { example: 'compact' }
};

export const Minimal: Story = {
	args: { example: 'minimal' }
};

export const WithLikes: Story = {
	name: 'Likes + album',
	args: { example: 'likes' }
};

export const Empty: Story = {
	args: { example: 'empty' }
};
