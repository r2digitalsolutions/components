import type { Meta, StoryObj } from '@storybook/svelte';
import LeadDetailPageStory from './LeadDetailPageStory.svelte';

const meta = {
	title: 'Organisms/LeadDetailPage',
	component: LeadDetailPageStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof LeadDetailPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
