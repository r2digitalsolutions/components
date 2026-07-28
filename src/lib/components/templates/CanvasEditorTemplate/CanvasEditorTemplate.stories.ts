import type { Meta, StoryObj } from '@storybook/svelte';
import CanvasEditorTemplateStory from './CanvasEditorTemplateStory.svelte';

const meta = {
	title: 'Templates/CanvasEditorTemplate',
	component: CanvasEditorTemplateStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof CanvasEditorTemplateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
