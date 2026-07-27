import type { Meta, StoryObj } from '@storybook/svelte';
import SelectionBoxStory from './SelectionBoxStory.svelte';

const meta = {
	title: 'Atoms/SelectionBox',
	component: SelectionBoxStory,
	tags: ['autodocs'],
	argTypes: {
		checked: { control: 'boolean' },
		indeterminate: { control: 'boolean' },
		disabled: { control: 'boolean' },
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		tone: { control: 'select', options: ['brand', 'primary', 'success'] },
		radius: { control: 'select', options: ['none', 'sm', 'md'] },
		label: { control: 'text' },
		showLabel: { control: 'boolean' },
		demo: { control: false }
	},
	args: {
		checked: true,
		indeterminate: false,
		disabled: false,
		size: 'md',
		tone: 'brand',
		radius: 'sm',
		label: 'Select row',
		showLabel: false,
		demo: 'playground'
	}
} satisfies Meta<typeof SelectionBoxStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Indeterminate: Story = {
	args: { checked: false, indeterminate: true }
};

export const Disabled: Story = {
	args: { disabled: true, checked: true }
};

export const WithLabel: Story = {
	args: { showLabel: true, label: 'Include in export' }
};

export const SuccessTone: Story = {
	args: { tone: 'success', checked: true }
};

export const LargeSquare: Story = {
	args: { size: 'lg', radius: 'none' }
};

export const States: Story = {
	args: { demo: 'states' }
};

export const Sizes: Story = {
	args: { demo: 'sizes' }
};

export const TableSelection: Story = {
	args: { demo: 'table' }
};
