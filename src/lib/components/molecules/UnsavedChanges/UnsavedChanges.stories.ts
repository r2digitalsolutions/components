import type { Meta, StoryObj } from '@storybook/svelte';
import UnsavedChangesStory from './UnsavedChangesStory.svelte';

const meta = {
	title: 'Molecules/UnsavedChanges',
	component: UnsavedChangesStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['floating', 'inline'] }
	},
	args: { variant: 'floating' }
} satisfies Meta<typeof UnsavedChangesStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Inline: Story = { args: { variant: 'inline' } };
