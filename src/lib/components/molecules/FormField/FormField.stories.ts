import type { Meta, StoryObj } from '@storybook/svelte';
import FormFieldStory from './FormFieldStory.svelte';

const meta = {
	title: 'Molecules/FormField',
	component: FormFieldStory,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text', description: 'Label text' },
		placeholder: { control: 'text', description: 'Placeholder' },
		type: {
			control: 'select',
			options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
			description: 'Input type'
		},
		status: {
			control: 'select',
			options: ['default', 'error', 'success', 'warning'],
			description: 'Validation status'
		},
		helperText: { control: 'text', description: 'Default helper text' },
		errorMessage: { control: 'text', description: 'Error message (overrides status to error)' },
		disabled: { control: 'boolean' },
		required: { control: 'boolean' },
		clearable: { control: 'boolean' },
		size: { control: 'select', options: ['sm', 'md', 'lg'] }
	},
	args: {
		label: 'Email address',
		placeholder: 'user@example.com',
		type: 'email',
		status: 'default',
		helperText: "We'll never share your email.",
		errorMessage: '',
		disabled: false,
		required: false,
		clearable: false,
		size: 'md'
	}
} satisfies Meta<typeof FormFieldStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'Email address', type: 'email' } };
export const Required: Story = { args: { label: 'Password', type: 'password', required: true } };
export const WithError: Story = {
	args: { label: 'Email address', errorMessage: 'Please enter a valid email address.' }
};
export const WithSuccess: Story = {
	args: { label: 'Username', status: 'success', helperText: 'Username is available.' }
};
