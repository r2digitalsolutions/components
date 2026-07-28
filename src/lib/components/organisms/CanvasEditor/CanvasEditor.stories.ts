import type { Meta, StoryObj } from '@storybook/svelte';
import CanvasEditorStory from './CanvasEditorStory.svelte';

const meta = {
	title: 'Organisms/CanvasEditor',
	component: CanvasEditorStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof CanvasEditorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
