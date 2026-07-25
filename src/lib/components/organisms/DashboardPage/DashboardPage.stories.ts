import type { Meta, StoryObj } from '@storybook/svelte';
import DashboardPageStory from './DashboardPageStory.svelte';

const meta = {
	title: 'Organisms/DashboardPage',
	component: DashboardPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof DashboardPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
