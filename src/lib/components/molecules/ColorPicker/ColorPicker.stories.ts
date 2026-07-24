import type { Meta, StoryObj } from '@storybook/svelte';
import ColorPickerStory from './ColorPickerStory.svelte';

const meta = {
	title: 'Molecules/ColorPicker',
	component: ColorPickerStory,
	tags: ['autodocs']
} satisfies Meta<typeof ColorPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
