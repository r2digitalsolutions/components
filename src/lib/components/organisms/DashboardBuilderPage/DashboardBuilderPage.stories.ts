import type { Meta, StoryObj } from '@storybook/svelte';
import DashboardBuilderPageStory from './DashboardBuilderPageStory.svelte';

const meta = {
	title: 'Organisms/DashboardBuilderPage',
	component: DashboardBuilderPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof DashboardBuilderPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
