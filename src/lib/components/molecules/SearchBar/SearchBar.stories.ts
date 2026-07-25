import type { Meta, StoryObj } from '@storybook/svelte';
import SearchBarStory from './SearchBarStory.svelte';

const meta = {
	title: 'Molecules/SearchBar',
	component: SearchBarStory,
	tags: ['autodocs'],
	argTypes: {
		loading: { control: 'boolean' }
	},
	args: {
		placeholder: 'Search components…',
		buttonLabel: 'Search',
		loading: false
	}
} satisfies Meta<typeof SearchBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: { loading: true }
};
