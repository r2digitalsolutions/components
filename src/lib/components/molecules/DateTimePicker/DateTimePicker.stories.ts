import type { Meta, StoryObj } from '@storybook/svelte';
import DateTimePickerStory from './DateTimePickerStory.svelte';

const meta = {
	title: 'Molecules/DateTimePicker',
	component: DateTimePickerStory,
	tags: ['autodocs'],
	argTypes: {
		format: { control: 'select', options: ['24h', '12h'] },
		minuteStep: { control: 'select', options: [1, 5, 10, 15, 30] },
		closeOnSelect: { control: 'boolean' }
	},
	args: {
		format: '24h',
		minuteStep: 5,
		label: 'Date & time',
		closeOnSelect: true
	}
} satisfies Meta<typeof DateTimePickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TwelveHour: Story = { args: { format: '12h' } };
export const KeepOpen: Story = {
	name: 'Keep open after select',
	args: { closeOnSelect: false }
};
