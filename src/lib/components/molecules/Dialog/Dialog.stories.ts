import type { Meta, StoryObj } from '@storybook/svelte';
import DialogStory from './DialogStory.svelte';

const meta = {
	title: 'Molecules/Dialog',
	component: DialogStory,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		description: { control: 'text' },
		size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'] },
		tone: { control: 'select', options: ['default', 'info', 'success', 'warning', 'danger'] },
		position: { control: 'select', options: ['center', 'top'] },
		closeOnBackdrop: { control: 'boolean' },
		closeOnEscape: { control: 'boolean' },
		closeOnConfirm: { control: 'boolean' },
		showClose: { control: 'boolean' },
		showCancel: { control: 'boolean' },
		showConfirm: { control: 'boolean' },
		cancelLabel: { control: 'text' },
		confirmLabel: { control: 'text' },
		confirmVariant: { control: 'select', options: ['primary', 'secondary', 'destructive'] },
		confirmLoading: { control: 'boolean' },
		confirmDisabled: { control: 'boolean' },
		hideFooter: { control: 'boolean' },
		footerAlign: { control: 'select', options: ['start', 'center', 'end', 'between'] },
		scrollable: { control: 'boolean' },
		blurBackdrop: { control: 'boolean' },
		body: { control: 'text' }
	},
	args: {
		title: 'Confirm action',
		description: 'This action cannot be undone. Do you want to continue?',
		size: 'md',
		tone: 'default',
		position: 'center',
		closeOnBackdrop: true,
		closeOnEscape: true,
		closeOnConfirm: true,
		showClose: true,
		showCancel: true,
		showConfirm: true,
		cancelLabel: 'Cancel',
		confirmLabel: 'Confirm',
		confirmVariant: 'primary',
		confirmLoading: false,
		confirmDisabled: false,
		hideFooter: false,
		footerAlign: 'end',
		scrollable: true,
		blurBackdrop: true,
		body: ''
	}
} satisfies Meta<typeof DialogStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ExtraSmall: Story = { args: { size: 'xs', title: 'Quick tip' } };
export const ExtraLarge: Story = { args: { size: 'xl', title: 'Detailed view' } };
export const FullWidth: Story = { args: { size: 'full', title: 'Workspace settings' } };
export const TopPosition: Story = { args: { position: 'top', title: 'Pinned dialog' } };
export const DangerTone: Story = {
	args: {
		tone: 'danger',
		title: 'Delete project',
		description: 'The project and all of its data will be permanently removed.',
		confirmLabel: 'Delete',
		confirmVariant: 'destructive'
	}
};
export const SuccessTone: Story = {
	args: {
		tone: 'success',
		title: 'Publish ready',
		description: 'Your draft passed all checks and can be published.',
		confirmLabel: 'Publish'
	}
};
export const LoadingConfirm: Story = {
	args: {
		title: 'Saving changes',
		description: 'Please wait while we sync your workspace.',
		confirmLoading: true,
		confirmLabel: 'Saving…'
	}
};
export const WithBody: Story = {
	args: {
		title: 'Invite teammate',
		description: 'Send an invitation email to join your workspace.',
		confirmLabel: 'Send invite',
		body: 'They will receive access to shared boards, files, and comments.'
	}
};
