import type { Meta, StoryObj } from '@storybook/svelte';
import FilterSummaryStory from './FilterSummaryStory.svelte';

const meta = {
	title: 'Molecules/FilterSummary',
	component: FilterSummaryStory,
	tags: ['autodocs']
} satisfies Meta<typeof FilterSummaryStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
