import type { Meta, StoryObj } from '@storybook/svelte';
import CodeEditorStory from './CodeEditorStory.svelte';

const meta = {
	title: 'Molecules/CodeEditor',
	component: CodeEditorStory,
	tags: ['autodocs']
} satisfies Meta<typeof CodeEditorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
