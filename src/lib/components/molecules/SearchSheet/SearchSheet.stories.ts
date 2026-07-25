import type { Meta, StoryObj } from '@storybook/svelte';
import SearchSheetStory from './SearchSheetStory.svelte';

const meta = {
	title: 'Molecules/SearchSheet',
	component: SearchSheetStory,
	tags: ['autodocs']
} satisfies Meta<typeof SearchSheetStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
