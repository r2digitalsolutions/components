import type { Meta, StoryObj } from '@storybook/svelte';
import MarkdownPreviewStory from './MarkdownPreviewStory.svelte';

const meta = {
	title: 'Molecules/MarkdownPreview',
	component: MarkdownPreviewStory,
	tags: ['autodocs']
} satisfies Meta<typeof MarkdownPreviewStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
