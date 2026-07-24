import type { Meta, StoryObj } from '@storybook/svelte';
import SliderStory from './SliderStory.svelte';

const meta = {
	title: 'Atoms/Slider',
	component: SliderStory,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text', description: 'Label text' },
		min: { control: 'number' },
		max: { control: 'number' },
		step: { control: 'number' },
		value: { control: 'number' },
		disabled: { control: 'boolean' },
		showValue: { control: 'boolean' },
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
		unit: '%',
		size: 'md'
	}
} satisfies Meta<typeof SliderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'Brightness', value: 80, unit: '%' } };
export const Currency: Story = { args: { label: 'Max Price', min: 10, max: 500, step: 5, value: 250, unit: '€' } };
export const Large: Story = { args: { label: 'Zoom Level', size: 'lg', value: 150, min: 50, max: 300, unit: '%' } };
export const Disabled: Story = { args: { label: 'Locked Slider', disabled: true, value: 40 } };
