import type { Meta, StoryObj } from '@storybook/svelte';
import LiveBadgeStory from './LiveBadgeStory.svelte';

const meta = {
	title: 'Atoms/LiveBadge',
	component: LiveBadgeStory,
	tags: ['autodocs']
} satisfies Meta<typeof LiveBadgeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
