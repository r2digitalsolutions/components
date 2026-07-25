import type { Meta, StoryObj } from '@storybook/svelte';
import VideoPlayerStory from './VideoPlayerStory.svelte';

const meta = {
	title: 'Molecules/VideoPlayer',
	component: VideoPlayerStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['flower', 'bunny', 'sintel', 'clip', 'gallery', 'no-preview']
		}
	},
	args: { example: 'flower' }
} satisfies Meta<typeof VideoPlayerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const BigBuckBunny: Story = {
	name: 'Big Buck Bunny',
	args: { example: 'bunny' }
};
export const Sintel: Story = {
	name: 'Sintel',
	args: { example: 'sintel' }
};
export const ShortClip: Story = {
	name: 'Short clip',
	args: { example: 'clip' }
};
export const Gallery: Story = {
	args: { example: 'gallery' }
};
export const WithoutPreview: Story = {
	name: 'Without preview',
	args: { example: 'no-preview' }
};
