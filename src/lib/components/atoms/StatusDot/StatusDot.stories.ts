import type { Meta, StoryObj } from '@storybook/svelte';
import StatusDotStory from './StatusDotStory.svelte';

const meta = {
	title: 'Atoms/StatusDot',
	component: StatusDotStory,
	tags: ['autodocs'],
	argTypes: {
		status: { control: 'select', options: ['online', 'offline', 'busy', 'away', 'neutral'] },
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		pulse: { control: 'boolean' },
		showLabel: { control: 'boolean' }
	},
	args: { status: 'online', size: 'md', pulse: true, showLabel: true }
} satisfies Meta<typeof StatusDotStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Offline: Story = { args: { status: 'offline', pulse: false } };
