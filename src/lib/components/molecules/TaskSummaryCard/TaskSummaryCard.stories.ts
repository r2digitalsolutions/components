import type { Meta, StoryObj } from '@storybook/svelte';
import TaskSummaryCardStory from './TaskSummaryCardStory.svelte';

const meta = {
	title: 'Molecules/TaskSummaryCard',
	component: TaskSummaryCardStory,
	tags: ['autodocs']
} satisfies Meta<typeof TaskSummaryCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
