import type { Meta, StoryObj } from '@storybook/svelte';
import CalendarStory from './CalendarStory.svelte';

const meta = {
	title: 'Molecules/Calendar',
	component: CalendarStory,
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
		showMinMax: { control: 'boolean' },
		showDisabledDates: { control: 'boolean' },
		showEnabledOnly: { control: 'boolean' },
		showDots: { control: 'boolean' }
	},
	args: {
		mode: 'single',
		months: 1,
		showMinMax: false,
		showDisabledDates: false,
		showEnabledOnly: false,
		showDots: false
	}
} satisfies Meta<typeof CalendarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const DualMonths: Story = {
	name: 'Dual months',
	args: { months: 2 }
};

export const Multiple: Story = {
	args: { mode: 'multiple' }
};

export const Range: Story = {
	args: { mode: 'range' }
};

export const RangeDual: Story = {
	name: 'Range · dual months',
	args: { mode: 'range', months: 2 }
};

export const MinMax: Story = {
	name: 'Min / Max',
	args: { showMinMax: true }
};

export const DisabledDates: Story = {
	args: { showDisabledDates: true }
};

export const EnabledOnly: Story = {
	name: 'Enabled dates only',
	args: { showEnabledOnly: true }
};

export const WithDots: Story = {
	args: { showDots: true }
};

export const RangeWithDots: Story = {
	args: { mode: 'range', showDots: true }
};

export const MultipleWithDisabled: Story = {
	args: { mode: 'multiple', showDisabledDates: true, showDots: true }
};

export const BookingExample: Story = {
	name: 'Booking (range + dual)',
	args: { mode: 'range', months: 2, showMinMax: true, showDots: true }
};
