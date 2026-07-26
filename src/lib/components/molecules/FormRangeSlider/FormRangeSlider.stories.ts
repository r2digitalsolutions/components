import type { Meta, StoryObj } from '@storybook/svelte';
import FormRangeSliderStory from './FormRangeSliderStory.svelte';

const meta = {
	title: 'Molecules/FormRangeSlider',
	component: FormRangeSliderStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormRangeSliderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
