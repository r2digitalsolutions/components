import type { Meta, StoryObj } from '@storybook/svelte';
import ChecklistStory from './ChecklistStory.svelte';

const meta = {
	title: 'Molecules/Checklist',
	component: ChecklistStory,
	tags: ['autodocs']
} satisfies Meta<typeof ChecklistStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
