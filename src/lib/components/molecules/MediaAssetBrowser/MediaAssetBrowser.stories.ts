import type { Meta, StoryObj } from '@storybook/svelte';
import MediaAssetBrowserStory from './MediaAssetBrowserStory.svelte';

const meta = {
	title: 'Molecules/MediaAssetBrowser',
	component: MediaAssetBrowserStory,
	tags: ['autodocs']
} satisfies Meta<typeof MediaAssetBrowserStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
