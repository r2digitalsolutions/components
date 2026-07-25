import type { Meta, StoryObj } from '@storybook/svelte';
import HeatmapStory from './HeatmapStory.svelte';

const meta = {
	title: 'Molecules/Heatmap',
	component: HeatmapStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: [
				'activity',
				'correlation',
				'risk',
				'calendar',
				'values',
				'sparse',
				'diverging'
			]
		},
		palette: {
			control: 'select',
			options: ['brand', 'green', 'red', 'blue', 'orange', 'purple', 'diverging']
		},
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		showValues: { control: 'boolean' },
		showLegend: { control: 'boolean' },
		interactive: { control: 'boolean' },
		rotateColLabels: { control: 'boolean' },
		unit: { control: 'text' }
	},
	args: {
		example: 'activity',
		palette: 'brand',
		size: 'md',
		showValues: false,
		showLegend: true,
		interactive: true,
		rotateColLabels: false,
		unit: ''
	}
} satisfies Meta<typeof HeatmapStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Activity',
	args: { example: 'activity' }
};

export const Correlation: Story = {
	args: { example: 'correlation', palette: 'blue', showValues: true }
};

export const Risk: Story = {
	name: 'Incident density',
	args: { example: 'risk', palette: 'red', showValues: true }
};

export const Calendar: Story = {
	name: 'Contributions',
	args: { example: 'calendar', palette: 'green', size: 'sm' }
};

export const WithValues: Story = {
	name: 'With values',
	args: { example: 'values', palette: 'orange', size: 'lg', showValues: true }
};

export const Sparse: Story = {
	args: { example: 'sparse', palette: 'purple' }
};

export const Diverging: Story = {
	args: { example: 'diverging', palette: 'diverging', showValues: true }
};
