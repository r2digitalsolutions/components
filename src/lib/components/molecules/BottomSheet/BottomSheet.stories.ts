import type { Meta, StoryObj } from '@storybook/svelte';
import BottomSheetStory from './BottomSheetStory.svelte';

const meta = {
	title: 'Molecules/BottomSheet',
	component: BottomSheetStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['confirm', 'actions', 'form', 'scroll', 'minimal'],
			description: 'Story layout / content pattern'
		},
		title: { control: 'text' },
		description: { control: 'text' },
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg', 'xl', 'full']
		},
		maxHeight: { control: 'text' },
		closeOnBackdrop: { control: 'boolean' },
		closeOnEscape: { control: 'boolean' },
		showHandle: { control: 'boolean' },
		showClose: { control: 'boolean' },
		blurBackdrop: { control: 'boolean' },
		draggable: { control: 'boolean' },
		pullToClose: { control: 'boolean' }
	},
	args: {
		example: 'confirm',
		title: 'Confirm action',
		description: 'This cannot be undone.',
		size: 'lg',
		closeOnBackdrop: true,
		closeOnEscape: true,
		showHandle: true,
		showClose: true,
		blurBackdrop: true,
		draggable: true,
		pullToClose: true
	}
} satisfies Meta<typeof BottomSheetStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ActionList: Story = {
	name: 'Action list',
	args: {
		example: 'actions',
		title: 'Share',
		description: undefined,
		size: 'md'
	}
};

export const Form: Story = {
	args: {
		example: 'form',
		title: 'Invite teammate',
		description: 'They will receive an email invitation.',
		size: 'md'
	}
};

export const LongContent: Story = {
	name: 'Long content',
	args: {
		example: 'scroll',
		title: 'Activity',
		description: 'Pull down or use the handle to dismiss.',
		size: 'xl'
	}
};

export const Compact: Story = {
	args: {
		example: 'confirm',
		size: 'sm',
		title: 'Quick confirm',
		description: 'Compact height preset.'
	}
};

export const FullHeight: Story = {
	name: 'Full height',
	args: {
		example: 'scroll',
		size: 'full',
		title: 'Full sheet',
		description: 'Nearly full viewport.'
	}
};

export const Minimal: Story = {
	args: {
		example: 'minimal',
		title: undefined,
		description: undefined,
		showClose: false,
		size: 'sm'
	}
};

export const NoHandle: Story = {
	name: 'No handle',
	args: {
		showHandle: false,
		draggable: false,
		pullToClose: false
	}
};

export const SolidBackdrop: Story = {
	name: 'Solid backdrop',
	args: {
		blurBackdrop: false
	}
};

export const Persistent: Story = {
	name: 'No dismiss shortcuts',
	args: {
		closeOnBackdrop: false,
		closeOnEscape: false,
		pullToClose: false,
		draggable: false,
		title: 'Required step',
		description: 'Use the footer actions to continue.'
	}
};
