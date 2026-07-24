import type { Meta, StoryObj } from '@storybook/svelte';
import SelectStory from './SelectStory.svelte';

const meta = {
	title: 'Molecules/Select',
	component: SelectStory,
	tags: ['autodocs'],
	argTypes: {
		example: { control: 'select', options: ['default', 'nested', 'searchable'] },
		label: { control: 'text' },
		placeholder: { control: 'text' },
		status: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
		helperText: { control: 'text' },
		disabled: { control: 'boolean' },
		required: { control: 'boolean' },
		searchable: { control: 'boolean' },
		flyToSelected: { control: 'boolean' },
		size: { control: 'select', options: ['sm', 'md', 'lg'] }
	},
	args: {
		example: 'default',
		label: 'Country',
		placeholder: 'Select country...',
		status: 'default',
		helperText: '',
		disabled: false,
		required: false,
		searchable: false,
		flyToSelected: true,
		size: 'md'
	}
} satisfies Meta<typeof SelectStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { example: 'default', label: 'Country' } };
export const Nested: Story = {
	args: { example: 'nested', label: 'Region', flyToSelected: true, value: 'se' }
};
export const SearchableNested: Story = {
	args: { example: 'searchable', label: 'Region', searchable: true, value: 'se' }
};
export const Searchable: Story = { args: { example: 'default', label: 'Search Country', searchable: true } };
export const WithError: Story = {
	args: { example: 'default', label: 'Country', status: 'error', helperText: 'Country selection is required.' }
};
export const Required: Story = { args: { example: 'default', label: 'Country', required: true } };
export const Disabled: Story = { args: { example: 'default', label: 'Country', disabled: true } };
