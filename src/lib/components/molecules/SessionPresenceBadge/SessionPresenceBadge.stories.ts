import type { Meta, StoryObj } from '@storybook/svelte';
import SessionPresenceBadgeStory from './SessionPresenceBadgeStory.svelte';

const meta = {
	title: 'Molecules/SessionPresenceBadge',
	component: SessionPresenceBadgeStory,
	tags: ['autodocs']
} satisfies Meta<typeof SessionPresenceBadgeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
