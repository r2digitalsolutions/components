import type { Meta, StoryObj } from '@storybook/svelte';
import PanZoomViewportStory from './PanZoomViewportStory.svelte';

const meta = {
	title: 'Molecules/PanZoomViewport',
	component: PanZoomViewportStory,
	tags: ['autodocs']
} satisfies Meta<typeof PanZoomViewportStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
