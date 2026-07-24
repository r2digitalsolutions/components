import type { Meta, StoryObj } from '@storybook/svelte';
import DropdownMenuStory from './DropdownMenuStory.svelte';

const meta = {
	title: 'Molecules/DropdownMenu',
	component: DropdownMenuStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['basic', 'nested', 'checked', 'align-end', 'small', 'long']
		},
		size: { control: 'select', options: ['sm', 'md'] },
		side: { control: 'select', options: ['bottom', 'top'] },
		align: { control: 'select', options: ['start', 'end'] },
		closeOnSelect: { control: 'boolean' },
		scrollable: { control: 'boolean' },
		flyToSelected: { control: 'boolean' }
	},
	args: {
		example: 'nested',
		size: 'md',
		side: 'bottom',
		align: 'start',
		closeOnSelect: true,
		scrollable: false,
		flyToSelected: true
	}
} satisfies Meta<typeof DropdownMenuStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Nested: Story = { args: { example: 'nested', flyToSelected: true } };
export const WithIcons: Story = { args: { example: 'basic' } };
export const CheckedItems: Story = { args: { example: 'checked', closeOnSelect: false } };
export const AlignEnd: Story = { args: { example: 'basic', align: 'end' } };
export const Small: Story = { args: { example: 'basic', size: 'sm' } };
export const OpenUpward: Story = { args: { example: 'basic', side: 'top' } };
export const LongScrollable: Story = { args: { example: 'long', scrollable: true } };
