import type { Meta, StoryObj } from '@storybook/svelte';
import TextareaStory from './TextareaStory.svelte';

const meta = {
	title: 'Atoms/Textarea',
	component: TextareaStory,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text', description: 'Label text' },
		placeholder: { control: 'text', description: 'Placeholder text' },
		status: {
			control: 'select',
			options: ['default', 'error', 'success', 'warning'],
			description: 'Validation state'
		},
		helperText: { control: 'text', description: 'Helper message' },
		disabled: { control: 'boolean' },
		readonly: { control: 'boolean' },
		required: { control: 'boolean' },
		rows: { control: 'number', description: 'Initial number of visible rows' },
		maxLength: { control: 'number', description: 'Maximum character limit' },
		showCount: { control: 'boolean', description: 'Show live character counter' },
		autoResize: { control: 'boolean', description: 'Automatically grow height while typing' }
	},
	args: {
		label: 'Bio / Description',
		placeholder: 'Tell us about yourself...',
		status: 'default',
		helperText: '',
		disabled: false,
		readonly: false,
		required: false,
		rows: 3,
		showCount: false,
		autoResize: false
	}
} satisfies Meta<typeof TextareaStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'Description', placeholder: 'Enter details...' } };
export const WithCharacterCounter: Story = {
	args: { label: 'Short Bio', maxLength: 160, showCount: true, placeholder: 'Max 160 characters...' }
};
export const AutoResize: Story = {
	args: { label: 'Auto-growing Textarea', autoResize: true, placeholder: 'Type multiple lines to see height expand...' }
};
export const WithError: Story = {
	args: { label: 'Feedback', status: 'error', helperText: 'Feedback message cannot be empty.' }
};
