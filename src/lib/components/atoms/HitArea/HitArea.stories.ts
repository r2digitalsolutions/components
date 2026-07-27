import type { Meta, StoryObj } from '@storybook/svelte';
import HitAreaStory from './HitAreaStory.svelte';

const meta = {
	title: 'Atoms/HitArea',
	component: HitAreaStory,
	tags: ['autodocs']
} satisfies Meta<typeof HitAreaStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
