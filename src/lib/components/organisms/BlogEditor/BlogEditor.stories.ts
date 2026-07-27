import type { Meta, StoryObj } from '@storybook/svelte';
import BlogEditorStory from './BlogEditorStory.svelte';

const meta = {
	title: 'Organisms/BlogEditor',
	component: BlogEditorStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof BlogEditorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
