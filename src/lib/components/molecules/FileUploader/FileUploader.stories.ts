import type { Meta, StoryObj } from '@storybook/svelte';
import FileUploaderStory from './FileUploaderStory.svelte';

const meta = {
	title: 'Molecules/FileUploader',
	component: FileUploaderStory,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		helperText: { control: 'text' },
		accept: { control: 'text' },
		multiple: { control: 'boolean' },
		maxSizeMb: { control: 'number' },
		disabled: { control: 'boolean' }
	},
	args: {
		label: 'Project Attachments',
		helperText: 'PNG, JPG, PDF or DOCX (max 10MB)',
		accept: '*',
		multiple: true,
		maxSizeMb: 10,
		disabled: false
	}
} satisfies Meta<typeof FileUploaderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'Upload Documents' } };
export const SingleFile: Story = { args: { label: 'Profile Avatar', multiple: false, accept: 'image/*' } };
export const Disabled: Story = { args: { label: 'Upload Locked', disabled: true } };
