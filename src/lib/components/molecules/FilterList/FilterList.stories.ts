import type { Meta, StoryObj } from '@storybook/svelte';
import FilterListStory from './FilterListStory.svelte';

const meta = {
	title: 'Molecules/FilterList',
	component: FilterListStory,
	tags: ['autodocs']
} satisfies Meta<typeof FilterListStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
