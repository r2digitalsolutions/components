import type { Meta, StoryObj } from '@storybook/svelte';
import PageHeaderStory from './PageHeaderStory.svelte';

const meta = {
	title: 'Molecules/PageHeader',
	component: PageHeaderStory,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		description: { control: 'text' },
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		variant: {
			control: 'select',
			options: ['default', 'with-back', 'minimal', 'detail', 'loading', 'tabs', 'sticky']
		}
	},
	args: {
		variant: 'default',
		size: 'md',
		title: 'Project settings',
		description: 'Manage workspace preferences, members, and billing.'
	}
} satisfies Meta<typeof PageHeaderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBack: Story = {
	args: {
		variant: 'with-back',
		title: 'Ana López',
		description: 'Profile, plan and activity for this account.'
	}
};

export const Minimal: Story = {
	args: { variant: 'minimal', title: 'Overview', description: '' }
};

export const Detail: Story = {
	args: {
		variant: 'detail',
		size: 'lg',
		title: 'Invoice #1042',
		description: 'Created 28 Jul 2026 — due in 7 days.'
	}
};

export const Loading: Story = {
	args: {
		variant: 'loading',
		title: 'Project settings',
		description: 'Manage workspace preferences, members, and billing.'
	}
};

export const WithTabs: Story = {
	args: {
		variant: 'tabs',
		title: 'Settings',
		description: 'Workspace configuration.'
	}
};

export const Sticky: Story = {
	args: {
		variant: 'sticky',
		title: 'Dashboard',
		description: 'This header sticks to the top as you scroll.'
	}
};
