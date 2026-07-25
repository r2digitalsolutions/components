import type { Meta, StoryObj } from '@storybook/svelte';
import MusicPlayerStory from './MusicPlayerStory.svelte';

const meta = {
	title: 'Organisms/MusicPlayer',
	component: MusicPlayerStory,
	tags: ['autodocs']
} satisfies Meta<typeof MusicPlayerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
