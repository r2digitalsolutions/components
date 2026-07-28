import type { Meta, StoryObj } from '@storybook/svelte';
import MediaLayerItemStory from './MediaLayerItemStory.svelte';

const meta = {
	title: 'Molecules/MediaLayerItem',
	component: MediaLayerItemStory,
	tags: ['autodocs']
} satisfies Meta<typeof MediaLayerItemStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
