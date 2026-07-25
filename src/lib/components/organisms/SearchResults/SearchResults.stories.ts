import type { Meta, StoryObj } from '@storybook/svelte';
import SearchResultsStory from './SearchResultsStory.svelte';

const meta = {
	title: 'Organisms/SearchResults',
	component: SearchResultsStory,
	tags: ['autodocs'],
	argTypes: {
		layout: {
			control: 'select',
			options: ['list', 'grid', 'compact']
		},
		loading: { control: 'boolean' },
		empty: { control: 'boolean' },
		idle: { control: 'boolean' }
	}
} satisfies Meta<typeof SearchResultsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		layout: 'list',
		loading: false,
		empty: false,
		idle: false
	}
};

export const Grid: Story = {
	args: {
		layout: 'grid'
	}
};

export const Compact: Story = {
	args: {
		layout: 'compact'
	}
};

export const Loading: Story = {
	args: {
		loading: true
	}
};

export const Empty: Story = {
	args: {
		empty: true
	}
};

export const Idle: Story = {
	args: {
		idle: true
	}
};
