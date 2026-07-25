import type { Meta, StoryObj } from '@storybook/svelte';
import ReactionBarStory from './ReactionBarStory.svelte';

const meta = {
	title: 'Molecules/ReactionBar',
	component: ReactionBarStory,
	tags: ['autodocs']
} satisfies Meta<typeof ReactionBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
