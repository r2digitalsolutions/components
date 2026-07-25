import type { Meta, StoryObj } from '@storybook/svelte';
import SignaturePadStory from './SignaturePadStory.svelte';

const meta = {
	title: 'Molecules/SignaturePad',
	component: SignaturePadStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['default', 'compact', 'preview'] },
		height: { control: { type: 'number', min: 120, max: 360 } },
		disabled: { control: 'boolean' },
		penColor: { control: 'select', options: ['ink', 'brand', 'blue'] }
	},
	args: {
		variant: 'default',
		height: 200,
		disabled: false,
		penColor: 'ink'
	}
} satisfies Meta<typeof SignaturePadStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPreview: Story = {
	name: 'With PNG preview',
	args: { variant: 'preview' }
};

export const Compact: Story = {
	args: { variant: 'compact', height: 140 }
};

export const BrandPen: Story = {
	name: 'Brand pen',
	args: { penColor: 'brand', variant: 'preview' }
};

export const Disabled: Story = {
	args: { disabled: true }
};
