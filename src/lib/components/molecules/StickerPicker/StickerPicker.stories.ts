import type { Meta, StoryObj } from '@storybook/svelte';
import StickerPickerStory from './StickerPickerStory.svelte';

const meta = {
	title: 'Molecules/StickerPicker',
	component: StickerPickerStory,
	tags: ['autodocs']
} satisfies Meta<typeof StickerPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
