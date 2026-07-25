import type { Meta, StoryObj } from '@storybook/svelte';
import ImageCropperStory from './ImageCropperStory.svelte';

const meta = {
	title: 'Molecules/ImageCropper',
	component: ImageCropperStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'avatar', 'banner', 'jpeg']
		},
		aspectPreset: {
			control: 'select',
			options: ['1:1', '4:3', '16:9', '3:4', 'free']
		},
		showGrid: { control: 'boolean' },
		showPreview: { control: 'boolean' },
		outputFormat: {
			control: 'select',
			options: ['image/png', 'image/jpeg', 'image/webp']
		},
		outputWidth: { control: { type: 'number', min: 0, max: 1200, step: 64 } },
		disabled: { control: 'boolean' }
	},
	args: {
		variant: 'default',
		aspectPreset: '1:1',
		showGrid: true,
		showPreview: true,
		outputFormat: 'image/png',
		outputWidth: 0,
		disabled: false
	}
} satisfies Meta<typeof ImageCropperStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FreeAspect: Story = {
	name: 'Free aspect',
	args: { aspectPreset: 'free' }
};

export const Landscape: Story = {
	args: { aspectPreset: '16:9' }
};

export const Portrait: Story = {
	args: { aspectPreset: '3:4' }
};

export const Avatar: Story = {
	args: { variant: 'avatar' }
};

export const Banner: Story = {
	args: { variant: 'banner' }
};

export const JpegExport: Story = {
	name: 'JPEG export',
	args: { variant: 'jpeg', aspectPreset: '4:3', outputWidth: 640 }
};

export const NoGrid: Story = {
	args: { showGrid: false }
};

export const Disabled: Story = {
	args: { disabled: true }
};
