import type { Meta, StoryObj } from '@storybook/svelte';
import ChipBarStory from './ChipBarStory.svelte';

const meta = {
	title: 'Molecules/ChipBar',
	component: ChipBarStory,
	tags: ['autodocs']
} satisfies Meta<typeof ChipBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
