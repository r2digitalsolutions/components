import type { Meta, StoryObj } from '@storybook/svelte';
import UserMenuStory from './UserMenuStory.svelte';

const meta = {
	title: 'Molecules/UserMenu',
	component: UserMenuStory,
	tags: ['autodocs'],
	argTypes: {
		name: { control: 'text' },
		email: { control: 'text' },
		role: { control: 'text' },
		plan: { control: 'text' },
		status: { control: 'select', options: ['online', 'offline', 'busy', 'away', null] },
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		showMeta: { control: 'boolean' }
	},
	args: {
		name: 'Alex Rivera',
		email: 'alex@r2digisolutions.com',
		role: 'Admin',
		plan: 'Pro',
		status: 'online',
		size: 'sm',
		showMeta: true
	}
} satisfies Meta<typeof UserMenuStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { size: 'sm', showMeta: false } };
export const Busy: Story = { args: { status: 'busy', plan: 'Enterprise' } };
