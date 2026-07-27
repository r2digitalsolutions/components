import type { Meta, StoryObj } from '@storybook/svelte';
import DashboardGridStory from './DashboardGridStory.svelte';

const meta = {
	title: 'Organisms/DashboardGrid',
	component: DashboardGridStory,
	tags: ['autodocs']
} satisfies Meta<typeof DashboardGridStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
