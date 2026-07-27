import type { Meta, StoryObj } from '@storybook/svelte';
import BlogRendererStory from './BlogRendererStory.svelte';

const meta = {
	title: 'Organisms/BlogRenderer',
	component: BlogRendererStory,
	tags: ['autodocs']
} satisfies Meta<typeof BlogRendererStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
