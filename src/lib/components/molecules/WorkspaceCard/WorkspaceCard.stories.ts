import type { Meta, StoryObj } from '@storybook/svelte';
import WorkspaceCardStory from './WorkspaceCardStory.svelte';

const meta = {
	title: 'Molecules/WorkspaceCard',
	component: WorkspaceCardStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['card', 'row', 'favorites', 'statuses']
		}
	}
} satisfies Meta<typeof WorkspaceCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cards: Story = {
	args: { example: 'card' }
};

export const ListRows: Story = {
	args: { example: 'row' }
};

export const Favorites: Story = {
	args: { example: 'favorites' }
};

export const Statuses: Story = {
	args: { example: 'statuses' }
};
