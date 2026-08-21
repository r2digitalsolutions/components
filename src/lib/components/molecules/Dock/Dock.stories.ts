import type { Meta, StoryObj } from '@storybook/svelte';
import DockStory from './DockStory.svelte';

const meta = {
	title: 'Molecules/Dock',
	component: DockStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['mini', 'sm', 'md'] }
	},
	args: { size: 'sm' }
} satisfies Meta<typeof DockStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Mini: Story = { args: { size: 'mini' } };
export const Medium: Story = { args: { size: 'md' } };
