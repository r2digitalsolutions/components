import type { Meta, StoryObj } from '@storybook/svelte';
import FileUploaderStory from './FileUploaderStory.svelte';

const meta = {
	title: 'Organisms/FileUploader',
	component: FileUploaderStory,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		helperText: { control: 'text' },
		accept: { control: 'text' },
		variant: { control: 'select', options: ['multiple', 'single', 'avatar'] },
		view: { control: 'select', options: ['list', 'grid'] },
		showViewToggle: { control: 'boolean' },
		maxSizeMb: { control: 'number' },
		disabled: { control: 'boolean' }
	},
	args: {
		label: 'Project Attachments',
		helperText: 'PNG, JPG, PDF or DOCX (max 10MB)',
		accept: '*',
		variant: 'multiple',
		view: 'list',
		showViewToggle: true,
		maxSizeMb: 10,
		disabled: false
	}
} satisfies Meta<typeof FileUploaderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Multiple: Story = {
	args: { label: 'Upload Documents', variant: 'multiple', view: 'list' }
};

export const GridView: Story = {
	args: {
		label: 'Gallery',
		variant: 'multiple',
		view: 'grid',
		accept: 'image/*',
		helperText: 'Images only · max 10MB'
	}
};

export const SingleFile: Story = {
	args: {
		label: 'Cover image',
		variant: 'single',
		accept: 'image/*',
		helperText: 'PNG or JPG · max 10MB'
	}
};

export const Avatar: Story = {
	args: {
		label: 'Profile photo',
		variant: 'avatar',
		accept: 'image/*',
		helperText: 'Square image recommended · max 5MB',
		maxSizeMb: 5
	}
};

export const Disabled: Story = {
	args: { label: 'Upload Locked', disabled: true }
};
