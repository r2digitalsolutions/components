import type { Meta, StoryObj } from '@storybook/svelte';
import StoriesStory from './StoriesStory.svelte';

const meta = {
	title: 'Molecules/Stories',
	component: StoriesStory,
	tags: ['autodocs']
} satisfies Meta<typeof StoriesStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
