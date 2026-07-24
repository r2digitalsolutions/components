import type { Meta, StoryObj } from '@storybook/svelte';
import RangeSliderStory from './RangeSliderStory.svelte';

const meta = {
	title: 'Atoms/RangeSlider',
	component: RangeSliderStory,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		min: { control: 'number' },
		max: { control: 'number' },
		step: { control: 'number' },
		disabled: { control: 'boolean' },
		showValue: { control: 'boolean' },
		unit: { control: 'text' },
		size: { control: 'select', options: ['sm', 'md', 'lg'] }
	},
	args: {
		label: 'Price Range',
		min: 0,
		max: 100,
		step: 1,
		disabled: false,
		showValue: true,
		unit: '$',
		size: 'md'
	}
} satisfies Meta<typeof RangeSliderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithStep: Story = {
	args: { label: 'Budget', min: 0, max: 1000, step: 50, unit: '€' }
};

export const Large: Story = {
	args: { size: 'lg', label: 'Temperature Range', unit: '°C', min: -20, max: 40 }
};

export const Disabled: Story = {
	args: { disabled: true }
};
