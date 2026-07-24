import type { Meta, StoryObj } from '@storybook/svelte';
import TreeSelectStory from './TreeSelectStory.svelte';

const meta = {
	title: 'Molecules/TreeSelect',
	component: TreeSelectStory,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		placeholder: { control: 'text' },
		disabled: { control: 'boolean' }
	},
	args: {
		label: 'Category',
		placeholder: 'Select category...',
		disabled: false
	}
} satisfies Meta<typeof TreeSelectStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const NoLabel: Story = { args: { label: '' } };
