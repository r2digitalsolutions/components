import type { Meta, StoryObj } from '@storybook/svelte';
import DashboardTemplateStory from './DashboardTemplateStory.svelte';

const meta = {
	title: 'Templates/DashboardTemplate',
	component: DashboardTemplateStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	},
	argTypes: {
		example: {
			control: 'select',
			options: ['default', 'analytics', 'empty', 'collapsed', 'no-sidebar', 'compact']
		},
		fullHeight: { control: 'boolean' },
		framed: { control: 'boolean' }
	}
} satisfies Meta<typeof DashboardTemplateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		example: 'default',
		fullHeight: true,
		framed: false
	}
};

export const Analytics: Story = {
	args: {
		example: 'analytics',
		fullHeight: true
	}
};

export const Empty: Story = {
	args: {
		example: 'empty',
		fullHeight: true
	}
};

export const CollapsedSidebar: Story = {
	args: {
		example: 'collapsed',
		fullHeight: true
	}
};

export const NoSidebar: Story = {
	args: {
		example: 'no-sidebar',
		fullHeight: true
	}
};

export const Compact: Story = {
	args: {
		example: 'compact',
		fullHeight: true
	}
};

export const Framed: Story = {
	args: {
		example: 'default',
		fullHeight: false,
		framed: true
	}
};
