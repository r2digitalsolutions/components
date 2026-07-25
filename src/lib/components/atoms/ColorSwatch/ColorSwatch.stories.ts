import type { Meta, StoryObj } from '@storybook/svelte';
import ColorSwatchStory from './ColorSwatchStory.svelte';

const meta = {
	title: 'Atoms/ColorSwatch',
	component: ColorSwatchStory,
	tags: ['autodocs']
} satisfies Meta<typeof ColorSwatchStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
