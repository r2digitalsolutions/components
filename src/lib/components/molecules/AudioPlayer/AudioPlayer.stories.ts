import type { Meta, StoryObj } from '@storybook/svelte';
import AudioPlayerStory from './AudioPlayerStory.svelte';

const meta = {
	title: 'Molecules/AudioPlayer',
	component: AudioPlayerStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['full', 'compact', 'with-playlist'] }
	},
	args: { variant: 'full' }
} satisfies Meta<typeof AudioPlayerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { variant: 'compact' } };
export const WithPlaylist: Story = {
	name: 'With playlist',
	args: { variant: 'with-playlist' }
};
