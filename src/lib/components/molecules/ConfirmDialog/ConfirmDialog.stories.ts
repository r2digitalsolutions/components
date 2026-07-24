import type { Meta, StoryObj } from '@storybook/svelte';
import ConfirmDialogStory from './ConfirmDialogStory.svelte';

const meta = {
	title: 'Molecules/ConfirmDialog',
	component: ConfirmDialogStory,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		description: { control: 'text' },
		confirmLabel: { control: 'text' },
		cancelLabel: { control: 'text' },
		confirmLoading: { control: 'boolean' }
	},
	args: {
		title: 'Delete Item',
		description: 'Are you sure you want to delete this item? This action cannot be undone.',
		confirmLabel: 'Delete',
		cancelLabel: 'Cancel',
		confirmLoading: false
	}
} satisfies Meta<typeof ConfirmDialogStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: { confirmLoading: true }
};

export const CustomLabels: Story = {
	args: {
		title: 'Remove Member',
		description: 'This member will lose access to all team resources.',
		confirmLabel: 'Remove',
		cancelLabel: 'Keep Member'
	}
};
