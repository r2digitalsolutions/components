import type { Meta, StoryObj } from '@storybook/svelte';
import AdvancedFiltersStory from './AdvancedFiltersStory.svelte';

const meta = {
	title: 'Molecules/AdvancedFilters',
	component: AdvancedFiltersStory,
	tags: ['autodocs']
} satisfies Meta<typeof AdvancedFiltersStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
