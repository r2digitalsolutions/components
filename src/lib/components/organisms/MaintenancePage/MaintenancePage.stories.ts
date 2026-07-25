import type { Meta, StoryObj } from '@storybook/svelte';
import MaintenancePageStory from './MaintenancePageStory.svelte';

const meta = {
	title: 'Organisms/MaintenancePage',
	component: MaintenancePageStory,
	tags: ['autodocs']
} satisfies Meta<typeof MaintenancePageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
