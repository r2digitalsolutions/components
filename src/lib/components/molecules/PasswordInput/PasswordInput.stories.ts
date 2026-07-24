import type { Meta, StoryObj } from '@storybook/svelte';
import PasswordInputStory from './PasswordInputStory.svelte';

const meta = {
	title: 'Molecules/PasswordInput',
	component: PasswordInputStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		status: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
		disabled: { control: 'boolean' }
	},
	args: { size: 'md', disabled: false, status: 'default' }
} satisfies Meta<typeof PasswordInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Error: Story = { args: { status: 'error' } };
