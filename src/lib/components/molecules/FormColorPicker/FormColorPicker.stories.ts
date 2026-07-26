import type { Meta, StoryObj } from '@storybook/svelte';
import FormColorPickerStory from './FormColorPickerStory.svelte';

const meta = {
	title: 'Molecules/FormColorPicker',
	component: FormColorPickerStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormColorPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
