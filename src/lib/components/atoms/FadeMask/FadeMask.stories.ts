import type { Meta, StoryObj } from '@storybook/svelte';
import FadeMaskStory from './FadeMaskStory.svelte';

const meta = {
	title: 'Atoms/FadeMask',
	component: FadeMaskStory,
	tags: ['autodocs']
} satisfies Meta<typeof FadeMaskStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
