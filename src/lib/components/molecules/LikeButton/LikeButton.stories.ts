import type { Meta, StoryObj } from '@storybook/svelte';
import LikeButtonStory from './LikeButtonStory.svelte';

const meta = {
	title: 'Molecules/LikeButton',
	component: LikeButtonStory,
	tags: ['autodocs']
} satisfies Meta<typeof LikeButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
