import type { Meta, StoryObj } from '@storybook/svelte';
import DashboardGridToolbarStory from './DashboardGridToolbarStory.svelte';

const meta = {
	title: 'Molecules/DashboardGridToolbar',
	component: DashboardGridToolbarStory,
	tags: ['autodocs']
} satisfies Meta<typeof DashboardGridToolbarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
