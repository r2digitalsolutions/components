import type { Meta, StoryObj } from '@storybook/svelte';
import ImageGalleryStory from './ImageGalleryStory.svelte';

const meta = {
	title: 'Molecules/ImageGallery',
	component: ImageGalleryStory,
	tags: ['autodocs']
} satisfies Meta<typeof ImageGalleryStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
