import type { Meta, StoryObj } from '@storybook/svelte';
import TestimonialsStory from './TestimonialsStory.svelte';

const meta = {
	title: 'Organisms/Testimonials',
	component: TestimonialsStory,
	tags: ['autodocs']
} satisfies Meta<typeof TestimonialsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
