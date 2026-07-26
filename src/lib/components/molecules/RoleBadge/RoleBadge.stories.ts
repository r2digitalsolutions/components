import type { Meta, StoryObj } from '@storybook/svelte';
import RoleBadgeStory from './RoleBadgeStory.svelte';

const meta = {
	title: 'Molecules/RoleBadge',
	component: RoleBadgeStory,
	tags: ['autodocs']
} satisfies Meta<typeof RoleBadgeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
