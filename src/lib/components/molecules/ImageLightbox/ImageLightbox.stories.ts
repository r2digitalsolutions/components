import type { Meta, StoryObj } from '@storybook/svelte';
import ImageLightboxStory from './ImageLightboxStory.svelte';

const meta = {
	title: 'Molecules/ImageLightbox',
	component: ImageLightboxStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['gallery', 'single', 'many', 'minimal'],
			description: 'Story layout / image set'
		},
		loop: { control: 'boolean' },
		closeOnBackdrop: { control: 'boolean' },
		closeOnEscape: { control: 'boolean' },
		showClose: { control: 'boolean' },
		showNav: { control: 'boolean' },
		showThumbnails: { control: 'boolean' },
		showCounter: { control: 'boolean' },
		showCaptions: { control: 'boolean' },
		blurBackdrop: { control: 'boolean' },
		zoomable: { control: 'boolean' },
		draggable: { control: 'boolean' },
		dismissible: { control: 'boolean' }
	},
	args: {
		variant: 'gallery',
		loop: true,
		closeOnBackdrop: true,
		closeOnEscape: true,
		showClose: true,
		showNav: true,
		showThumbnails: true,
		showCounter: true,
		showCaptions: true,
		blurBackdrop: true,
		zoomable: true,
		draggable: true,
		dismissible: true
	}
} satisfies Meta<typeof ImageLightboxStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleImage: Story = {
	name: 'Single image',
	args: { variant: 'single' }
};

export const ManyImages: Story = {
	name: 'Many images',
	args: { variant: 'many' }
};

export const Minimal: Story = {
	args: { variant: 'minimal', showNav: true }
};

export const NoLoop: Story = {
	name: 'No loop',
	args: { loop: false }
};

export const ZoomOnly: Story = {
	name: 'Zoom only (no drag)',
	args: { draggable: false, zoomable: true, variant: 'single' }
};

export const DragOnly: Story = {
	name: 'Drag only (no zoom)',
	args: { zoomable: false, draggable: true }
};

export const NoBlur: Story = {
	name: 'Solid backdrop',
	args: { blurBackdrop: false }
};

export const NoThumbnails: Story = {
	name: 'No thumbnails',
	args: { showThumbnails: false }
};
