import type { Meta, StoryObj } from '@storybook/svelte';
import MediaLayerListStory from './MediaLayerListStory.svelte';

const meta = {
	title: 'Molecules/MediaLayerList',
	component: MediaLayerListStory,
	tags: ['autodocs']
} satisfies Meta<typeof MediaLayerListStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
