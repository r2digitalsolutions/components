import type { Meta, StoryObj } from '@storybook/svelte';
import InputStory from './InputStory.svelte';

const meta = {
	title: 'Atoms/Input',
	component: InputStory,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text', description: 'Field label' },
		placeholder: { control: 'text', description: 'Placeholder text' },
		type: {
			control: 'select',
			options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
			description: 'Input type'
		},
		status: {
			control: 'select',
			options: ['default', 'error', 'success', 'warning'],
			description: 'Validation state'
		},
		helperText: { control: 'text', description: 'Helper or error message' },
		disabled: { control: 'boolean' },
		readonly: { control: 'boolean' },
		required: { control: 'boolean' },
		clearable: { control: 'boolean', description: 'Show clear button when has value' },
		size: { control: 'select', options: ['sm', 'md', 'lg'] }
	},
	args: {
		label: 'Email address',
		placeholder: 'hello@example.com',
		type: 'text',
		status: 'default',
		helperText: '',
		disabled: false,
		readonly: false,
		required: false,
		clearable: false,
		size: 'md'
	}
} satisfies Meta<typeof InputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'Name', placeholder: 'John Doe' } };
export const Email: Story = { args: { label: 'Email', type: 'email', placeholder: 'you@example.com' } };
export const Password: Story = { args: { label: 'Password', type: 'password', placeholder: '••••••••' } };
export const WithError: Story = {
	args: { label: 'Username', status: 'error', helperText: 'This username is already taken.' }
};
export const WithSuccess: Story = {
	args: { label: 'Username', status: 'success', helperText: 'Username is available!' }
};
export const Clearable: Story = {
	args: { label: 'Search', type: 'search', placeholder: 'Search...', clearable: true }
};
export const Disabled: Story = {
	args: { label: 'Read only field', disabled: true, placeholder: 'Cannot edit' }
};
export const Required: Story = {
	args: { label: 'Required field', required: true, placeholder: 'This is required' }
};
