import type { Meta, StoryObj } from '@storybook/svelte';
import FormRatingStory from './FormRatingStory.svelte';

const meta = {
	title: 'Molecules/FormRating',
	component: FormRatingStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormRatingStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
