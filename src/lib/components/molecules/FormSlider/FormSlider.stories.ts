import type { Meta, StoryObj } from '@storybook/svelte';
import FormSliderStory from './FormSliderStory.svelte';

const meta = {
	title: 'Molecules/FormSlider',
	component: FormSliderStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormSliderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
