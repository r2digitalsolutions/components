import type { Meta, StoryObj } from '@storybook/svelte';
import MentionInputStory from './MentionInputStory.svelte';

const meta = {
	title: 'Molecules/MentionInput',
	component: MentionInputStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'avatars', 'empty-start', 'bottom']
		},
		placement: { control: 'select', options: ['top', 'bottom'] },
		disabled: { control: 'boolean' },
		rows: { control: { type: 'number', min: 2, max: 10 } }
	},
	args: {
		variant: 'avatars',
		placement: 'top',
		disabled: false,
		rows: 4
	}
} satisfies Meta<typeof MentionInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyStart: Story = {
	name: 'Empty start',
	args: { variant: 'empty-start' }
};

export const DropdownBelow: Story = {
	name: 'Dropdown below',
	args: { variant: 'bottom', placement: 'bottom' }
};

export const Disabled: Story = {
	args: { disabled: true }
};

export const Compact: Story = {
	args: { rows: 2 }
};
