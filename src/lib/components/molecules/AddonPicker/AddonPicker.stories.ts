import type { Meta, StoryObj } from '@storybook/svelte';
import AddonPickerStory from './AddonPickerStory.svelte';

const meta = {
	title: 'Molecules/AddonPicker',
	component: AddonPickerStory,
	tags: ['autodocs']
} satisfies Meta<typeof AddonPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
