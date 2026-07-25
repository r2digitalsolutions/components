import type { Meta, StoryObj } from '@storybook/svelte';
import EmojiPickerStory from './EmojiPickerStory.svelte';

const meta = {
	title: 'Molecules/EmojiPicker',
	component: EmojiPickerStory,
	tags: ['autodocs']
} satisfies Meta<typeof EmojiPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
