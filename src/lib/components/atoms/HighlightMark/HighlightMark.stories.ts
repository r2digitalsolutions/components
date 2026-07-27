import type { Meta, StoryObj } from '@storybook/svelte';
import HighlightMarkStory from './HighlightMarkStory.svelte';

const meta = {
	title: 'Atoms/HighlightMark',
	component: HighlightMarkStory,
	tags: ['autodocs']
} satisfies Meta<typeof HighlightMarkStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
