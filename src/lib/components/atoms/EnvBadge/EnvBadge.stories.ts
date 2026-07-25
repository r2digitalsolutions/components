import type { Meta, StoryObj } from '@storybook/svelte';
import EnvBadgeStory from './EnvBadgeStory.svelte';

const meta = {
	title: 'Atoms/EnvBadge',
	component: EnvBadgeStory,
	tags: ['autodocs']
} satisfies Meta<typeof EnvBadgeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
