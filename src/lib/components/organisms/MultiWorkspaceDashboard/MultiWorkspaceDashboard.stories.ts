import type { Meta, StoryObj } from '@storybook/svelte';
import MultiWorkspaceDashboardStory from './MultiWorkspaceDashboardStory.svelte';

const meta = {
	title: 'Organisms/MultiWorkspaceDashboard',
	component: MultiWorkspaceDashboardStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		example: {
			control: 'select',
			options: [
				'default',
				'list',
				'filtered',
				'empty',
				'loading',
				'invites',
				'at-capacity',
				'favorites',
				'compact'
			]
		}
	}
} satisfies Meta<typeof MultiWorkspaceDashboardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'default' }
};

export const ListView: Story = {
	args: { example: 'list' }
};

export const FilteredOwner: Story = {
	args: { example: 'filtered' }
};

export const Empty: Story = {
	args: { example: 'empty' }
};

export const Loading: Story = {
	args: { example: 'loading' }
};

export const WithInvites: Story = {
	args: { example: 'invites' }
};

export const AtCapacity: Story = {
	args: { example: 'at-capacity' }
};

export const Favorites: Story = {
	args: { example: 'favorites' }
};

export const CompactList: Story = {
	args: { example: 'compact' }
};
