import type { Meta, StoryObj } from '@storybook/svelte';
import DateRangePickerStory from './DateRangePickerStory.svelte';

const meta = {
	title: 'Molecules/DateRangePicker',
	component: DateRangePickerStory,
	tags: ['autodocs'],
	argTypes: {
		months: { control: 'select', options: [1, 2] },
		variant: { control: 'select', options: ['field', 'split'] }
	},
	args: {
		months: 2,
		variant: 'split',
		label: ''
	}
} satisfies Meta<typeof DateRangePickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Booking: Story = {};
export const SingleField: Story = {
	args: { variant: 'field', label: 'Stay', months: 2 }
};
export const OneMonth: Story = {
	args: { months: 1, variant: 'field', label: 'Range' }
};
