import type { Meta, StoryObj } from '@storybook/svelte';
import SearchBarStory from './SearchBarStory.svelte';

const meta = {
	title: 'Molecules/SearchBar',
	component: SearchBarStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['joined', 'soft', 'plain', 'filters', 'sizes']
		},
		variant: { control: 'select', options: ['joined', 'soft', 'plain'] },
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		loading: { control: 'boolean' },
		showButton: { control: 'boolean' }
	},
	args: {
		example: 'joined',
		variant: 'joined',
		size: 'md',
		loading: false,
		showButton: true,
		placeholder: 'Search components…',
		buttonLabel: 'Search',
		shortcut: ''
	}
} satisfies Meta<typeof SearchBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Joined',
	args: { example: 'joined', variant: 'joined' }
};

export const Soft: Story = {
	name: 'Header soft',
	args: { example: 'soft', variant: 'soft', shortcut: '⌘K', showButton: false }
};

export const Plain: Story = {
	args: { example: 'plain', variant: 'plain', showButton: false }
};

export const WithFilters: Story = {
	name: 'With filters',
	args: { example: 'filters' }
};

export const Sizes: Story = {
	args: { example: 'sizes' }
};

export const Loading: Story = {
	args: { example: 'joined', loading: true }
};
