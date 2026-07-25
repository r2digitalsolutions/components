import type { Meta, StoryObj } from '@storybook/svelte';
import ImageCropperStory from './ImageCropperStory.svelte';

const meta = {
	title: 'Molecules/ImageCropper',
	component: ImageCropperStory,
	tags: ['autodocs']
} satisfies Meta<typeof ImageCropperStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
