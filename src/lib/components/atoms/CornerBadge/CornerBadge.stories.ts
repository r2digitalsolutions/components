import type { Meta, StoryObj } from '@storybook/svelte';
import CornerBadgeStory from './CornerBadgeStory.svelte';

const meta = {
	title: 'Atoms/CornerBadge',
	component: CornerBadgeStory,
	tags: ['autodocs']
} satisfies Meta<typeof CornerBadgeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
