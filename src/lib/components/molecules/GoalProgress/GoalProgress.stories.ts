import type { Meta, StoryObj } from '@storybook/svelte';
import GoalProgressStory from './GoalProgressStory.svelte';

const meta = {
	title: 'Molecules/GoalProgress',
	component: GoalProgressStory,
	tags: ['autodocs']
} satisfies Meta<typeof GoalProgressStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
