import type { Meta, StoryObj } from '@storybook/svelte';
import SwipeActionStory from './SwipeActionStory.svelte';

const meta = {
	title: 'Molecules/SwipeAction',
	component: SwipeActionStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['mail', 'inbox', 'tasks', 'files', 'rightOnly', 'leftOnly', 'disabled'],
			description: 'Content pattern / action layout'
		},
		threshold: {
			control: { type: 'number', min: 24, max: 120, step: 4 }
		},
		closeOnAction: { control: 'boolean' },
		disabled: { control: 'boolean' }
	},
	args: {
		example: 'mail',
		threshold: 56,
		closeOnAction: true,
		disabled: false
	}
} satisfies Meta<typeof SwipeActionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Mail (both sides)',
	args: { example: 'mail' }
};

export const Inbox: Story = {
	args: { example: 'inbox' }
};

export const Tasks: Story = {
	name: 'Tasks (3 left + 2 right)',
	args: { example: 'tasks' }
};

export const Files: Story = {
	name: 'Files (many right)',
	args: { example: 'files' }
};

export const RightOnly: Story = {
	name: 'Right actions only',
	args: { example: 'rightOnly' }
};

export const LeftOnly: Story = {
	name: 'Left actions only',
	args: { example: 'leftOnly' }
};

export const Disabled: Story = {
	args: { example: 'disabled', disabled: true }
};

export const StayOpen: Story = {
	name: 'Stay open after action',
	args: { example: 'inbox', closeOnAction: false }
};

export const LowThreshold: Story = {
	name: 'Low threshold',
	args: { example: 'mail', threshold: 28 }
};
