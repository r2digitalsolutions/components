import type { Meta, StoryObj } from '@storybook/svelte';
import FilterBarStory from './FilterBarStory.svelte';

const meta = {
	title: 'Molecules/FilterBar',
	component: FilterBarStory,
	tags: ['autodocs']
} satisfies Meta<typeof FilterBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
