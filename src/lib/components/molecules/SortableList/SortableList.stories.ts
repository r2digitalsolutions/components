import type { Meta, StoryObj } from '@storybook/svelte';
import SortableListStory from './SortableListStory.svelte';

const meta = {
	title: 'Molecules/SortableList',
	component: SortableListStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['card', 'plain'] },
		size: { control: 'select', options: ['sm', 'md'] },
		showIndex: { control: 'boolean' }
	},
	args: {
		variant: 'card',
		size: 'md',
		showIndex: true
	}
} satisfies Meta<typeof SortableListStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Plain: Story = { args: { variant: 'plain' } };
export const Compact: Story = { args: { size: 'sm', showIndex: false } };
