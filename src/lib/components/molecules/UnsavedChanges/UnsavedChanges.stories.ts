import type { Meta, StoryObj } from '@storybook/svelte';
import UnsavedChangesStory from './UnsavedChangesStory.svelte';

const meta = {
	title: 'Molecules/UnsavedChanges',
	component: UnsavedChangesStory,
	tags: ['autodocs']
} satisfies Meta<typeof UnsavedChangesStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
