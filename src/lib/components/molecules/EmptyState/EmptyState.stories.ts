import type { Meta, StoryObj } from '@storybook/svelte';
import EmptyStateStory from './EmptyStateStory.svelte';

const meta = {
	title: 'Molecules/EmptyState',
	component: EmptyStateStory,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		description: { control: 'text' },
		eyebrow: { control: 'text' },
		hint: { control: 'text' },
		variant: { control: 'inline-radio', options: ['dashed', 'card', 'plain'] },
		size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
		background: { control: 'inline-radio', options: ['none', 'gradient'] },
		iconStyle: { control: 'inline-radio', options: ['soft', 'elevated'] },
		showAction: { control: 'boolean' },
		customIcon: { control: 'boolean' }
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

/** The full-page treatment: eyebrow, large heading, elevated icon tile, glow and a hint under the action. */
export const Hero: Story = {
	args: {
		size: 'lg',
		variant: 'card',
		background: 'gradient',
		iconStyle: 'elevated',
		customIcon: true,
		eyebrow: 'It starts with hello',
		title: 'Your conversations start here',
		description: 'Ask about a listing, work out the details and come back here to keep talking.',
		hint: 'Look for the “Send message” button on each listing.'
	}
};
export const Gradient: Story = { args: { background: 'gradient', variant: 'card', iconStyle: 'elevated' } };
export const Card: Story = { args: { variant: 'card' } };
export const Plain: Story = { args: { variant: 'plain', showAction: false } };
export const Small: Story = { args: { size: 'sm', title: 'Nothing here yet', description: 'Items you add will show up here.', showAction: false } };
export const WithEyebrow: Story = { args: { eyebrow: 'Getting started' } };
