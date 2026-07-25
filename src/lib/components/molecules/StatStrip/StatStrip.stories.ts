import type { Meta, StoryObj } from '@storybook/svelte';
import StatStripStory from './StatStripStory.svelte';

const meta = {
	title: 'Molecules/StatStrip',
	component: StatStripStory,
	tags: ['autodocs']
} satisfies Meta<typeof StatStripStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
