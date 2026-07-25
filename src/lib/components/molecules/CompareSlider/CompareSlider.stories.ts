import type { Meta, StoryObj } from '@storybook/svelte';
import CompareSliderStory from './CompareSliderStory.svelte';

const meta = {
	title: 'Molecules/CompareSlider',
	component: CompareSliderStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'images', 'vertical', 'custom']
		}
	}
} satisfies Meta<typeof CompareSliderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { variant: 'default' }
};

export const WithImages: Story = {
	args: { variant: 'images' }
};

export const Vertical: Story = {
	args: { variant: 'vertical' }
};

export const CustomContent: Story = {
	args: { variant: 'custom' }
};
