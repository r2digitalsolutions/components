import type { Meta, StoryObj } from '@storybook/svelte';
import MeterStory from './MeterStory.svelte';

const meta = {
	title: 'Atoms/Meter',
	component: MeterStory,
	tags: ['autodocs'],
	argTypes: {
		value: { control: { type: 'range', min: 0, max: 100 } },
		tone: { control: 'select', options: ['default', 'success', 'warning', 'error', 'brand'] },
		size: { control: 'select', options: ['sm', 'md', 'lg'] }
	},
	args: { value: 72, tone: 'brand', size: 'md' }
} satisfies Meta<typeof MeterStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
