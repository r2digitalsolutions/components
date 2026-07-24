import type { Meta, StoryObj } from '@storybook/svelte';
import ColorPickerStory from './ColorPickerStory.svelte';

const meta = {
	title: 'Molecules/ColorPicker',
	component: ColorPickerStory,
	tags: ['autodocs'],
	argTypes: {
		alpha: { control: 'boolean' },
		format: {
			control: 'select',
			options: ['hex', 'rgb', 'hsl']
		},
		showSwatches: { control: 'boolean' },
		disabled: { control: 'boolean' },
		preset: {
			control: 'select',
			options: ['default', 'brand', 'pastel', 'neon']
		},
		label: { control: 'text' },
		initiallyOpen: { control: 'boolean' }
	},
	args: {
		alpha: false,
		format: 'hex',
		showSwatches: true,
		disabled: false,
		preset: 'default',
		label: 'Brand color',
		initiallyOpen: false
	}
} satisfies Meta<typeof ColorPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAlpha: Story = {
	name: 'With transparency',
	args: { alpha: true, label: 'Overlay color', format: 'hex', initiallyOpen: true }
};

export const RgbaFormat: Story = {
	name: 'RGBA format',
	args: { alpha: true, format: 'rgb', label: 'Background' }
};

export const HslFormat: Story = {
	name: 'HSL format',
	args: { format: 'hsl', label: 'Accent' }
};

export const BrandPalette: Story = {
	args: { preset: 'brand', label: 'Brand scale' }
};

export const PastelPalette: Story = {
	args: { preset: 'pastel', label: 'Pastels' }
};

export const NeonPalette: Story = {
	args: { preset: 'neon', label: 'Neon' }
};

export const NoSwatches: Story = {
	args: { showSwatches: false, label: 'Custom only' }
};

export const Disabled: Story = {
	args: { disabled: true }
};
