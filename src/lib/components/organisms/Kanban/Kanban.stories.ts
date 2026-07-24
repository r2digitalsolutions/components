import type { Meta, StoryObj } from '@storybook/svelte';
import KanbanStory from './KanbanStory.svelte';

const meta = {
	title: 'Organisms/Kanban',
	component: KanbanStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	},
	args: {}
} satisfies Meta<typeof KanbanStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
