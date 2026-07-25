import type { Meta, StoryObj } from '@storybook/svelte';
import ImageGalleryStory from './ImageGalleryStory.svelte';

const meta = {
	title: 'Molecules/ImageGallery',
	component: ImageGalleryStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'featured', 'masonry']
		}
	}
} satisfies Meta<typeof ImageGalleryStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { variant: 'default' }
};

export const Featured: Story = {
	args: { variant: 'featured' }
};

export const Masonry: Story = {
	args: { variant: 'masonry' }
};
