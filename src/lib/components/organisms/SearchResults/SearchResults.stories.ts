import type { Meta, StoryObj } from '@storybook/svelte';
import SearchResultsStory from './SearchResultsStory.svelte';

const meta = {
	title: 'Organisms/SearchResults',
	component: SearchResultsStory,
	tags: ['autodocs']
} satisfies Meta<typeof SearchResultsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
