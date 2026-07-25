import type { Meta, StoryObj } from '@storybook/svelte';
import BlogPostStory from './BlogPostStory.svelte';

const meta = {
	title: 'Organisms/BlogPost',
	component: BlogPostStory,
	tags: ['autodocs']
} satisfies Meta<typeof BlogPostStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
