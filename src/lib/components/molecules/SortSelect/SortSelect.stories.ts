import type { Meta, StoryObj } from '@storybook/svelte';
import SortSelectStory from './SortSelectStory.svelte';

const meta = {
	title: 'Molecules/SortSelect',
	component: SortSelectStory,
	tags: ['autodocs']
} satisfies Meta<typeof SortSelectStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
