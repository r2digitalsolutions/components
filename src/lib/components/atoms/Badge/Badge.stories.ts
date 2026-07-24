import type { Meta, StoryObj } from '@storybook/svelte';
import BadgeStory from './BadgeStory.svelte';

const meta = {
	title: 'Atoms/Badge',
	component: BadgeStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
			description: 'Semantic color variant'
		},
		size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'Badge size' },
		rounded: { control: 'boolean', description: 'Pill/rounded shape' },
		dot: { control: 'boolean', description: 'Show colored dot indicator' },
		label: { control: 'text', description: 'Badge text' }
	},
	args: { variant: 'primary', size: 'md', rounded: false, dot: false, label: 'Badge' }
} satisfies Meta<typeof BadgeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary', label: 'Primary' } };
export const Success: Story = { args: { variant: 'success', dot: true, label: 'Active' } };
export const Warning: Story = { args: { variant: 'warning', dot: true, label: 'Pending' } };
export const Error: Story = { args: { variant: 'error', dot: true, label: 'Failed' } };
export const Info: Story = { args: { variant: 'info', label: 'Info' } };
export const Rounded: Story = { args: { variant: 'primary', rounded: true, label: '42' } };
export const Dot: Story = { args: { variant: 'success', dot: true, rounded: true, label: 'Online' } };
