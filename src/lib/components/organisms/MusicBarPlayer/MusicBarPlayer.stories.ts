import type { Meta, StoryObj } from '@storybook/svelte';
import MusicBarPlayerStory from './MusicBarPlayerStory.svelte';

const meta = {
	title: 'Organisms/MusicBarPlayer',
	component: MusicBarPlayerStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<typeof MusicBarPlayerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fixed: Story = {
	args: { variant: 'fixed' }
};

export const Inline: Story = {
	args: { variant: 'inline' },
	parameters: {
		layout: 'padded'
	}
};
