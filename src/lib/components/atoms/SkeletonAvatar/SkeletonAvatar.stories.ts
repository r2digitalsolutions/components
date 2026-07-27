import type { Meta, StoryObj } from '@storybook/svelte';
import SkeletonAvatarStory from './SkeletonAvatarStory.svelte';

const meta = {
	title: 'Atoms/SkeletonAvatar',
	component: SkeletonAvatarStory,
	tags: ['autodocs']
} satisfies Meta<typeof SkeletonAvatarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
