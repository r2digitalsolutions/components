import type { Meta, StoryObj } from '@storybook/svelte';
import SavedSearchRowStory from './SavedSearchRowStory.svelte';

const meta = {
	title: 'Molecules/SavedSearchRow',
	component: SavedSearchRowStory,
	tags: ['autodocs']
} satisfies Meta<typeof SavedSearchRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
