import type { Meta, StoryObj } from '@storybook/svelte';
import FollowButtonStory from './FollowButtonStory.svelte';

const meta = {
	title: 'Molecules/FollowButton',
	component: FollowButtonStory,
	tags: ['autodocs']
} satisfies Meta<typeof FollowButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
