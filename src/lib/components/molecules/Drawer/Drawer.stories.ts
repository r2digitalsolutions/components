import type { Meta, StoryObj } from '@storybook/svelte';
import DrawerStory from './DrawerStory.svelte';

const meta = {
	title: 'Molecules/Drawer',
	component: DrawerStory,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		description: { control: 'text' },
		side: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
		size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
		closeOnBackdrop: { control: 'boolean' },
		closeOnEscape: { control: 'boolean' },
		showClose: { control: 'boolean' },
		blurBackdrop: { control: 'boolean' }
	},
	args: {
		title: 'Filters',
		description: 'Narrow results by status and owner.',
		side: 'right',
		size: 'md',
		closeOnBackdrop: true,
		closeOnEscape: true,
		showClose: true,
		blurBackdrop: true
	}
} satisfies Meta<typeof DrawerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {};
export const Left: Story = { args: { side: 'left', title: 'Navigation' } };
export const Bottom: Story = { args: { side: 'bottom', size: 'md', title: 'Quick actions' } };
export const Large: Story = { args: { size: 'lg', title: 'Details panel' } };
