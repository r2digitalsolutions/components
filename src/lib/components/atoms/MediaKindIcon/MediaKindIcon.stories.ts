import type { Meta, StoryObj } from '@storybook/svelte';
import MediaKindIconStory from './MediaKindIconStory.svelte';

const meta = {
	title: 'Atoms/MediaKindIcon',
	component: MediaKindIconStory,
	tags: ['autodocs']
} satisfies Meta<typeof MediaKindIconStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
