import type { Meta, StoryObj } from '@storybook/svelte';
import SelectStory from './SelectStory.svelte';

const meta = {
	title: 'Molecules/Select',
	component: SelectStory,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		placeholder: { control: 'text' },
		status: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
		helperText: { control: 'text' },
		disabled: { control: 'boolean' },
		required: { control: 'boolean' },
		searchable: { control: 'boolean' },
		size: { control: 'select', options: ['sm', 'md', 'lg'] }
	},
	args: {
		label: 'Country',
		placeholder: 'Select country...',
		status: 'default',
		helperText: '',
		disabled: false,
		required: false,
		searchable: false,
		size: 'md'
	}
} satisfies Meta<typeof SelectStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'Country' } };
export const Searchable: Story = { args: { label: 'Search Country', searchable: true } };
export const WithError: Story = { args: { label: 'Country', status: 'error', helperText: 'Country selection is required.' } };
