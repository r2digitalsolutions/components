import type { Meta, StoryObj } from '@storybook/svelte';
import OverlayStory from './OverlayStory.svelte';

const meta = {
	title: 'Atoms/Overlay',
	component: OverlayStory,
	tags: ['autodocs']
} satisfies Meta<typeof OverlayStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
