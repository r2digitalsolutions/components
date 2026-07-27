import type { Meta, StoryObj } from '@storybook/svelte';
import TaskRowStory from './TaskRowStory.svelte';

const meta = {
	title: 'Molecules/TaskRow',
	component: TaskRowStory,
	tags: ['autodocs']
} satisfies Meta<typeof TaskRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
