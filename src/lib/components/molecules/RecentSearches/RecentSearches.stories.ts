import type { Meta, StoryObj } from '@storybook/svelte';
import RecentSearchesStory from './RecentSearchesStory.svelte';

const meta = {
	title: 'Molecules/RecentSearches',
	component: RecentSearchesStory,
	tags: ['autodocs']
} satisfies Meta<typeof RecentSearchesStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
