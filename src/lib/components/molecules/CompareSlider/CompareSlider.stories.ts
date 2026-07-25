import type { Meta, StoryObj } from '@storybook/svelte';
import CompareSliderStory from './CompareSliderStory.svelte';

const meta = {
	title: 'Molecules/CompareSlider',
	component: CompareSliderStory,
	tags: ['autodocs']
} satisfies Meta<typeof CompareSliderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
