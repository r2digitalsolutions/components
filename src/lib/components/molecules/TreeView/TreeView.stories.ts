import type { Meta, StoryObj } from '@storybook/svelte';
import TreeViewStory from './TreeViewStory.svelte';

const meta = {
	title: 'Molecules/TreeView',
	component: TreeViewStory,
	tags: ['autodocs'],
	argTypes: {
		multiExpand: { control: 'boolean' }
	},
	args: {
		multiExpand: true
	}
} satisfies Meta<typeof TreeViewStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SingleExpand: Story = { args: { multiExpand: false } };
