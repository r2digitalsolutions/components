import type { Meta, StoryObj } from '@storybook/svelte';
import RichTextEditorStory from './RichTextEditorStory.svelte';

const meta = {
	title: 'Molecules/RichTextEditor',
	component: RichTextEditorStory,
	tags: ['autodocs']
} satisfies Meta<typeof RichTextEditorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
