import type { Meta, StoryObj } from '@storybook/svelte';
import DiffViewerStory from './DiffViewerStory.svelte';

const meta = {
	title: 'Molecules/DiffViewer',
	component: DiffViewerStory,
	tags: ['autodocs'],
	argTypes: { mode: { control: 'select', options: ['unified', 'split'] } },
	args: { mode: 'unified' }
} satisfies Meta<typeof DiffViewerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Split: Story = { args: { mode: 'split' } };
