import type { Meta, StoryObj } from '@storybook/svelte';
import DashboardTemplateStory from './DashboardTemplateStory.svelte';

const meta = {
	title: 'Templates/DashboardTemplate',
	component: DashboardTemplateStory,
	tags: ['autodocs']
} satisfies Meta<typeof DashboardTemplateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
