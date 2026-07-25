import type { Meta, StoryObj } from '@storybook/svelte';
import GaugeStory from './GaugeStory.svelte';

const meta = {
	title: 'Molecules/Gauge',
	component: GaugeStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['cpu', 'health', 'storage', 'score', 'ring', 'horseshoe', 'battery', 'grid']
		},
		value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
		min: { control: 'number' },
		max: { control: 'number' },
		size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
		variant: { control: 'select', options: ['arc', 'horseshoe', 'ring'] },
		tone: {
			control: 'select',
			options: ['brand', 'success', 'warning', 'danger', 'info', 'neutral']
		},
		unit: { control: 'text' },
		label: { control: 'text' },
		description: { control: 'text' },
		showNeedle: { control: 'boolean' },
		showTicks: { control: 'boolean' },
		showMinMax: { control: 'boolean' },
		showZones: { control: 'boolean' },
		animated: { control: 'boolean' }
	},
	args: {
		example: 'cpu',
		value: 72,
		min: 0,
		max: 100,
		size: 'md',
		variant: 'arc',
		tone: 'brand',
		unit: '%',
		label: 'CPU usage',
		description: '',
		showNeedle: true,
		showTicks: false,
		showMinMax: false,
		showZones: true,
		animated: true
	}
} satisfies Meta<typeof GaugeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Health: Story = {
	args: { example: 'health', value: 82, label: 'Health score', unit: '' }
};

export const Storage: Story = {
	args: { example: 'storage', value: 74 }
};

export const Rating: Story = {
	args: { example: 'score', value: 4.6, max: 5, unit: '' }
};

export const Ring: Story = {
	args: { example: 'ring', value: 86, variant: 'ring', showNeedle: false }
};

export const Horseshoe: Story = {
	args: {
		example: 'horseshoe',
		value: 68,
		variant: 'horseshoe',
		showTicks: true,
		showMinMax: true
	}
};

export const Battery: Story = {
	args: { example: 'battery', value: 38, size: 'sm' }
};

export const DashboardGrid: Story = {
	name: 'Dashboard grid',
	args: { example: 'grid' }
};

export const Critical: Story = {
	args: { example: 'cpu', value: 93, label: 'CPU usage' }
};

export const NoNeedle: Story = {
	name: 'No needle',
	args: { example: 'cpu', showNeedle: false, value: 55 }
};
