import type { Meta, StoryObj } from '@storybook/svelte';
import BottomSheetStory from './BottomSheetStory.svelte';

const meta = {
	title: 'Molecules/BottomSheet',
	component: BottomSheetStory,
	tags: ['autodocs']
} satisfies Meta<typeof BottomSheetStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
