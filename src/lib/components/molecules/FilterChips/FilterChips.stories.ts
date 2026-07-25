import type { Meta, StoryObj } from '@storybook/svelte';
import FilterChipsStory from './FilterChipsStory.svelte';

const meta = {
	title: 'Molecules/FilterChips',
	component: FilterChipsStory,
	tags: ['autodocs']
} satisfies Meta<typeof FilterChipsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
