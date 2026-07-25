import type { Meta, StoryObj } from '@storybook/svelte';
import YearPickerStory from './YearPickerStory.svelte';

const meta = {
	title: 'Molecules/YearPicker',
	component: YearPickerStory,
	tags: ['autodocs'],
	argTypes: {
		min: { control: 'number' },
		max: { control: 'number' }
	},
	args: {}
} satisfies Meta<typeof YearPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LimitedRange: Story = {
	name: 'Limited range',
	args: { min: 2018, max: 2030 }
};
