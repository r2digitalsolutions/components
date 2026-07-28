import type { Meta, StoryObj } from '@storybook/svelte';
import CanvasElementsPanelStory from './CanvasElementsPanelStory.svelte';

const meta = {
	title: 'Molecules/CanvasElementsPanel',
	component: CanvasElementsPanelStory,
	tags: ['autodocs']
} satisfies Meta<typeof CanvasElementsPanelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
