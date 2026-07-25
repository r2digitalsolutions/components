import type { Meta, StoryObj } from '@storybook/svelte';
import AudioPlayerStory from './AudioPlayerStory.svelte';

const meta = {
	title: 'Molecules/AudioPlayer',
	component: AudioPlayerStory,
	tags: ['autodocs']
} satisfies Meta<typeof AudioPlayerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
