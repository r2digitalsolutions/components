import type { Meta, StoryObj } from '@storybook/svelte';
import VisuallyHiddenStory from './VisuallyHiddenStory.svelte';

const meta = {
	title: 'Atoms/VisuallyHidden',
	component: VisuallyHiddenStory,
	tags: ['autodocs']
} satisfies Meta<typeof VisuallyHiddenStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
