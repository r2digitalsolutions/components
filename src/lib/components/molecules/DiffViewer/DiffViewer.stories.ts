import type { Meta, StoryObj } from '@storybook/svelte';
import DiffViewerStory from './DiffViewerStory.svelte';

const meta = {
	title: 'Molecules/DiffViewer',
	component: DiffViewerStory,
	tags: ['autodocs'],
	argTypes: {
		mode: { control: 'select', options: ['unified', 'split'] },
		variant: { control: 'select', options: ['code', 'text', 'large'] },
		wordDiff: { control: 'boolean' }
	},
	args: {
		mode: 'unified',
		variant: 'code',
		wordDiff: true
	}
} satisfies Meta<typeof DiffViewerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Split: Story = {
	args: { mode: 'split' }
};

export const TextDiff: Story = {
	name: 'Text changelog',
	args: { variant: 'text', mode: 'unified' }
};

export const LongFile: Story = {
	name: 'Long file',
	args: { variant: 'large', mode: 'split' }
};

export const NoWordDiff: Story = {
	name: 'Without word highlight',
	args: { wordDiff: false, mode: 'split' }
};
