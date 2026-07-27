import type { Meta, StoryObj } from '@storybook/svelte';
import DragHandleStory from './DragHandleStory.svelte';

const meta = {
	title: 'Atoms/DragHandle',
	component: DragHandleStory,
	tags: ['autodocs']
} satisfies Meta<typeof DragHandleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
