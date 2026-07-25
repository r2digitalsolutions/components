import type { Meta, StoryObj } from '@storybook/svelte';
import FormDatePickerStory from './FormDatePickerStory.svelte';

const meta = {
	title: 'Molecules/FormDatePicker',
	component: FormDatePickerStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormDatePickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
