import type { Meta, StoryObj } from '@storybook/svelte';
import CameraButtonStory from './CameraButtonStory.svelte';

const meta = {
	title: 'Molecules/CameraButton',
	component: CameraButtonStory,
	tags: ['autodocs']
} satisfies Meta<typeof CameraButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
