import type { Meta, StoryObj } from '@storybook/svelte';
import SliderStory from './SliderStory.svelte';

const meta = {
	title: 'Atoms/Slider',
	component: SliderStory,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		min: { control: 'number' },
		max: { control: 'number' },
		step: { control: 'number' },
		value: { control: 'number' },
		disabled: { control: 'boolean' },
		showValue: { control: 'boolean' },
		valuePosition: { control: 'select', options: ['tooltip', 'header'] },
		showMarks: { control: 'boolean' },
		unit: { control: 'text' },
		size: { control: 'select', options: ['sm', 'md', 'lg'] }
	},
	args: {
		label: 'Volume',
		min: 0,
		max: 100,
		step: 1,
		value: 65,
		disabled: false,
		showValue: true,
		valuePosition: 'tooltip',
		showMarks: true,
		unit: '%',
		size: 'md'
	}
} satisfies Meta<typeof SliderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FloatingTooltip: Story = {
	args: { label: 'Volume Control', value: 75, valuePosition: 'tooltip', showMarks: true }
};
export const HeaderValue: Story = {
	args: { label: 'Budget Limit', valuePosition: 'header', min: 100, max: 2000, step: 50, value: 850, unit: '€', showMarks: true }
};
export const LargeSize: Story = {
	args: { label: 'Zoom Level', size: 'lg', value: 120, min: 50, max: 200, unit: '%', showMarks: true }
};
