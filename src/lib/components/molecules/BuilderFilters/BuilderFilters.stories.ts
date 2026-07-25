import type { Meta, StoryObj } from '@storybook/svelte';
import BuilderFiltersStory from './BuilderFiltersStory.svelte';

const meta = {
	title: 'Molecules/BuilderFilters',
	component: BuilderFiltersStory,
	tags: ['autodocs']
} satisfies Meta<typeof BuilderFiltersStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
