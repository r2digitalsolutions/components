import type { Meta, StoryObj } from '@storybook/svelte';
import ReviewCardStory from './ReviewCardStory.svelte';

const meta = {
	title: 'Molecules/ReviewCard',
	component: ReviewCardStory,
	tags: ['autodocs']
} satisfies Meta<typeof ReviewCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
