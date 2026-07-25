import type { Meta, StoryObj } from '@storybook/svelte';
import FormDateTimePickerStory from './FormDateTimePickerStory.svelte';

const meta = {
	title: 'Molecules/FormDateTimePicker',
	component: FormDateTimePickerStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormDateTimePickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
