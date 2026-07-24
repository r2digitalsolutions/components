import type { Meta, StoryObj } from '@storybook/svelte';
import EmptyStateStory from './EmptyStateStory.svelte';

const meta = {
	title: 'Molecules/EmptyState',
	component: EmptyStateStory,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		description: { control: 'text' }
	},
	args: {
		title: 'No invoices found',
		description: 'You haven’t created any invoices yet. Create your first invoice to get started.'
	}
} satisfies Meta<typeof EmptyStateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { title: 'No results found', description: 'Try adjusting your search or filter options.' } };
export const NoProjects: Story = { args: { title: 'No projects yet', description: 'Get started by creating a new workspace project.' } };
