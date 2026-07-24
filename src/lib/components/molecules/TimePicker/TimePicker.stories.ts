import type { Meta, StoryObj } from '@storybook/svelte';
import TimePickerStory from './TimePickerStory.svelte';

const meta = {
	title: 'Molecules/TimePicker',
	component: TimePickerStory,
	tags: ['autodocs'],
	argTypes: {
		format: { control: 'select', options: ['24h', '12h'] },
		minuteStep: { control: 'select', options: [1, 5, 10, 15, 30] },
		disabled: { control: 'boolean' }
	},
	args: {
		format: '24h',
		minuteStep: 5,
		label: 'Time',
		disabled: false
	}
} satisfies Meta<typeof TimePickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TwelveHour: Story = { args: { format: '12h' } };
export const FineMinutes: Story = { name: '1-minute step', args: { minuteStep: 1 } };
export const Disabled: Story = { args: { disabled: true } };
