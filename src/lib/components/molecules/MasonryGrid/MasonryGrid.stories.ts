import type { Meta, StoryObj } from '@storybook/svelte';
import MasonryGridStory from './MasonryGridStory.svelte';

const meta = {
	title: 'Molecules/MasonryGrid',
	component: MasonryGridStory,
	tags: ['autodocs']
} satisfies Meta<typeof MasonryGridStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
