import type { Meta, StoryObj } from '@storybook/svelte';
import MultiWorkspaceDashboardStory from './MultiWorkspaceDashboardStory.svelte';

const meta = {
	title: 'Organisms/MultiWorkspaceDashboard',
	component: MultiWorkspaceDashboardStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof MultiWorkspaceDashboardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
