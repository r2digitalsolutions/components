import type { Meta, StoryObj } from '@storybook/svelte';
import DatePickerStory from './DatePickerStory.svelte';

const meta = {
	title: 'Molecules/DatePicker',
	component: DatePickerStory,
	tags: ['autodocs'],
	argTypes: {
		mode: {
			control: 'select',
			options: ['single', 'multiple', 'range']
		},
		months: {
			control: 'select',
			options: [1, 2]
		},
		variant: {
			control: 'select',
			options: ['field', 'split']
		},
		closeOnSelect: { control: 'boolean' }
	},
	args: {
		mode: 'single',
		months: 1,
		variant: 'field',
		label: 'Date',
		closeOnSelect: true
	}
} satisfies Meta<typeof DatePickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const SingleDualMonths: Story = {
	name: 'Single · 2 months',
	args: { months: 2 }
};

export const Multiple: Story = {
	args: { mode: 'multiple', label: 'Availability' }
};

export const Range: Story = {
	args: { mode: 'range', months: 2, label: 'Stay' }
};

export const Booking: Story = {
	name: 'Booking (split + dual)',
	args: {
		mode: 'range',
		months: 2,
		variant: 'split',
		label: ''
	}
};

export const KeepOpen: Story = {
	name: 'Keep open after select',
	args: { closeOnSelect: false }
};
