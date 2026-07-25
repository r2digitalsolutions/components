import type { Meta, StoryObj } from '@storybook/svelte';
import FormDateRangePickerStory from './FormDateRangePickerStory.svelte';

const meta = {
	title: 'Molecules/FormDateRangePicker',
	component: FormDateRangePickerStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormDateRangePickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
