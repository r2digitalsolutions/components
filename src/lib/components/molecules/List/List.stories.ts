import type { Meta, StoryObj } from '@storybook/svelte';
import ListStory from './ListStory.svelte';

const meta = {
	title: 'Molecules/List',
	component: ListStory,
	tags: ['autodocs'],
	argTypes: {
		selectable: { control: 'boolean' }
	},
	args: { selectable: true }
} satisfies Meta<typeof ListStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NonSelectable: Story = { args: { selectable: false } };
