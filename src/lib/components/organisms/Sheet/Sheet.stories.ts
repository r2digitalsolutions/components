import type { Meta, StoryObj } from '@storybook/svelte';
import SheetStory from './SheetStory.svelte';

const meta = {
	title: 'Organisms/Sheet',
	component: SheetStory,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg', 'xl', 'full']
		},
		accent: {
			control: 'select',
			options: ['none', 'brand', 'success', 'warning', 'danger', 'info']
		},
		draggable: { control: 'boolean' },
		pullToClose: { control: 'boolean' },
		showHandle: { control: 'boolean' },
		showClose: { control: 'boolean' }
	},
	args: {
		title: 'Workout details',
		description: 'Drag between breakpoints or pull to dismiss.',
		size: 'lg',
		accent: 'brand',
		draggable: true,
		pullToClose: true,
		showHandle: true,
		showClose: true
	}
} satisfies Meta<typeof SheetStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultiSnap: Story = {
	args: { size: 'xl' }
};

export const Compact: Story = {
	args: { size: 'sm', accent: 'success' }
};

export const WarningAccent: Story = {
	args: { size: 'md', accent: 'warning', title: 'Unsaved changes' }
};
