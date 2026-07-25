import type { Meta, StoryObj } from '@storybook/svelte';
import FigureStory from './FigureStory.svelte';

const meta = {
	title: 'Atoms/Figure',
	component: FigureStory,
	tags: ['autodocs']
} satisfies Meta<typeof FigureStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
