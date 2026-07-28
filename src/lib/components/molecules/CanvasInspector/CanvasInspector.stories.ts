import type { Meta, StoryObj } from '@storybook/svelte';
import CanvasInspectorStory from './CanvasInspectorStory.svelte';

const meta = {
	title: 'Molecules/CanvasInspector',
	component: CanvasInspectorStory,
	tags: ['autodocs']
} satisfies Meta<typeof CanvasInspectorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
