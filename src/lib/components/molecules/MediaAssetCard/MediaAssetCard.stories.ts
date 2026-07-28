import type { Meta, StoryObj } from '@storybook/svelte';
import MediaAssetCardStory from './MediaAssetCardStory.svelte';

const meta = {
	title: 'Molecules/MediaAssetCard',
	component: MediaAssetCardStory,
	tags: ['autodocs']
} satisfies Meta<typeof MediaAssetCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
